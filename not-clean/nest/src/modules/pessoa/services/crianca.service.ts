import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import { LimparCpf } from '../../../helpers/functions/Mask';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ContatoService } from '../../base/services/contato.service';
import { EnderecoService } from '../../base/services/endereco.service';
import { EntrevistaStatusEnum } from '../../entrevista/dto/enums/entrevista-status-enum';
import { CreateCriancaDto } from '../dto/create-crianca.dto';
import { UpdateCriancaDto } from '../dto/update-crianca.dto';
import { CriancaEntity } from '../entities/crianca.entity';
import { ResponsavelService } from './responsavel.service';

@Injectable()
export class CriancaService {
  constructor(
    @Inject('CRIANCA_REPOSITORY')
    private criancaRepository: Repository<CriancaEntity>,
    private readonly enderecoService: EnderecoService,
    private readonly contatoService: ContatoService,
    private readonly responsavelService: ResponsavelService,
  ) { }

  async findOneByCpf(
    acessoControl: AcessoControl,
    cpfRaw: string,
  ): Promise<CriancaEntity> {
    const cpf = LimparCpf(cpfRaw);

    const entity = await this.criancaRepository.findOne({
      where: { cpf },
      relations: ['responsavel', 'responsavel2', 'endereco', 'contato'],
    });

    if (!entity) {
      throw new NotFoundException(`Crianca não encontrada`);
    }

    await acessoControl.ensureCanReachTarget(
      'crianca:read',
      this.criancaRepository.createQueryBuilder('crianca'),
      entity.id,
    );

    return entity;
  }

  async findOne(
    acessoControl: AcessoControl,
    id: string,
  ): Promise<CriancaEntity> {
    await acessoControl.ensureCanReachTarget(
      'crianca:read',
      this.criancaRepository.createQueryBuilder('crianca'),
      id,
    );

    const entity = await this.criancaRepository.findOne({
      where: { id },
      relations: ['responsavel', 'responsavel2', 'endereco', 'contato'],
    });

    if (!entity) {
      throw new NotFoundException(`Crianca não encontrada`);
    }

    return entity;
  }

  async findAllByCidade(
    acessoControl: AcessoControl,
    idCidade,
  ): Promise<CriancaEntity[]> {
    const qbAcesso = this.criancaRepository.createQueryBuilder('crianca');

    const entity = await this.criancaRepository.find({
      where: {
        id: await acessoControl.getReachableTargetsTypeorm(
          'crianca:read',
          qbAcesso,
        ),
        endereco: {
          cidade: {
            id: idCidade,
          },
        },
      },
      relations: ['endereco'],
    });

    if (!entity) {
      throw new NotFoundException(
        `Nenhuma criança encontrada para a cidade ${idCidade}`,
      );
    }

    return entity;
  }

  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
  ): Promise<Paginated<CriancaEntity>> {
    const qbAcesso = this.criancaRepository.createQueryBuilder('crianca');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'crianca:read',
      qbAcesso,
    );

    const statusVagaConcedida = query?.filter?.vagaConcedida === 'true';
    const statusAguardandoVaga = query?.filter?.aguardandoVaga === 'true';
    if (statusAguardandoVaga || statusVagaConcedida) {
      qbAcesso
        .innerJoin(
          subQuery => {
            return subQuery
              .select('e.*')
              .from('entrevista', 'e')
              .where(qb => {
                const subSelect = qb
                  .subQuery()
                  .select("MAX(CONCAT(e2.data_entrevista::text, ' ', e2.horario_agendamento))")
                  .from('entrevista', 'e2')
                  .where('e2.crianca_id = e.crianca_id')
                  .getQuery();
                return "CONCAT(e.data_entrevista::text, ' ', e.horario_agendamento) = " + subSelect;
              });
          },
          'entrevista',
          'entrevista.crianca_id = crianca.id'
        )
        .andWhere('entrevista.status = :status', {
          status: statusVagaConcedida ? EntrevistaStatusEnum.CONCLUIDO : EntrevistaStatusEnum.AGUARDANDO,
        });
    }

    return paginate(query, qbAcesso.clone(), {
      ...paginateConfig,
      relations: {
        endereco: { cidade: true },
        responsavel: true,
        responsavel2: true,
        contato: true,
      },
      searchableColumns: [
        'nome',
        'cpf',
        'responsavel.nomeRes',
        'responsavel2.nomeRes',
        'contato.telefones',
      ],
      filterableColumns: {
        'endereco.cidade.id': [FilterOperator.EQ],
      },
    });
  }

  async create(
    acessoControl: AcessoControl,
    data: CreateCriancaDto,
  ): Promise<CriancaEntity> {
    // remover a mascara do cpf
    data.cpf = data.cpf?.replace(/\D/g, '');
    data.responsavel.cpfRes = data.responsavel.cpfRes?.replace(/\D/g, '');

    await acessoControl.ensureCanPerform('crianca:create', data);

    const { endereco, contato, ...entity } = data;

    const _endereco = await this.enderecoService.createOrUpdate(endereco);
    const _contato = await this.contatoService.createOrUpdate(contato);

    let responsavel;

    if (!data.responsavel.id) {
      responsavel = await this.responsavelService.create(data.responsavel);
    } else {
      responsavel = await this.responsavelService.findOne(data.responsavel.id);
    }
    let responsavel2;

    if (data.responsavel2) {
      data.responsavel2.cpfRes = data.responsavel2.cpfRes?.replace(/\D/g, '');
      if (!data.responsavel2.id) {
        responsavel2 = await this.responsavelService.create(data.responsavel2);
      } else {
        responsavel2 = await this.responsavelService.findOne(
          data.responsavel2.id,
        );
      }
    }

    delete data.endereco;
    delete data.contato;

    return this.criancaRepository.save({
      ...entity,
      id: uuidv4(),
      endereco: _endereco,
      contato: _contato,
      responsavel: responsavel,
      responsavel2: responsavel2,
    });
  }

  async update(
    acessoControl: AcessoControl,
    id: string,
    data: UpdateCriancaDto,
  ) {
    if (data.cpf) {
      data.cpf = LimparCpf(data.cpf);
    }

    await acessoControl.ensureCanReachTarget(
      'crianca:update',
      this.criancaRepository.createQueryBuilder('crianca'),
      id,
      data,
    );

    let { endereco, contato, responsavel, responsavel2, ...entity } =
      await this.findOne(acessoControl, id);

    if (data.endereco !== undefined)
      endereco = await this.enderecoService.createOrUpdate(
        data.endereco,
        endereco?.id,
      );
    if (data.contato !== undefined)
      contato = await this.contatoService.createOrUpdate(data, contato?.id);

    if (data.responsavel !== undefined) {
      if (data.responsavel.cpfRes) {
        data.responsavel.cpfRes = LimparCpf(data.responsavel.cpfRes);
      }

      responsavel = await this.responsavelService.update(
        responsavel?.id,
        data?.responsavel,
      );
    }

    if (data.responsavel2 !== undefined) {
      if (data.responsavel2 !== null) {
        if (data.responsavel2.cpfRes) {
          data.responsavel2.cpfRes = LimparCpf(data.responsavel2.cpfRes);
        }

        responsavel2 = await this.responsavelService.createOrUpdate(
          data.responsavel2,
          responsavel2?.id,
        );
      } else {
        responsavel2 = null;
      }
    }

    entity = await this.criancaRepository.preload({
      ...data,
      id,
      endereco,
      contato,
      responsavel,
      responsavel2,
    } as any);

    return this.criancaRepository.save(entity);
  }

  async remove(acessoControl: AcessoControl, id: string) {
    await acessoControl.ensureCanReachTarget(
      'crianca:delete',
      this.criancaRepository.createQueryBuilder('crianca'),
      id,
    );

    const entity = await this.findOne(acessoControl, id);

    return this.criancaRepository.remove(entity);
  }
}
