import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import { LimparCpf } from '../../../helpers/functions/Mask';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { CreateColaboradorDto } from '../dto/create-colaborador.dto';
import { UpdateColaboradorDto } from '../dto/update-colaborador.dto';
import { NivelAcesso } from '../entities/enums/pessoa.enum';
import { ColaboradorEntity } from '../entities/colaborador.entity';
import { PessoaService } from './pessoa.service';
import { UsuarioService } from './usuario.service';

@Injectable()
export class ColaboradorService {
  constructor(
    @Inject('COLABORADOR_REPOSITORY')
    private colaboradorRepository: Repository<ColaboradorEntity>,
    private readonly usuarioService: UsuarioService,
    private readonly pessoaService: PessoaService,
  ) {}

  async findOneByCpf(
    acessoControl: AcessoControl,
    cpfRaw: string,
  ): Promise<ColaboradorEntity> {
    const cpf = LimparCpf(cpfRaw);

    const entity = await this.colaboradorRepository.findOne({
      where: {
        pessoa: { cpf: cpf },
      },
      relations: {
        pessoa: {
          enderecos: true,
          contato: true,
        },
        usuario: true,
      },
    });

    if (!entity) {
      throw new NotFoundException(`Colaborador não encontrado`);
    }

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'colaborador:read',
        null,
        entity.id,
      );
    }

    return entity;
  }

  async findOne(
    acessoControl: AcessoControl,
    id: string,
  ): Promise<ColaboradorEntity> {
    const entity = await this.colaboradorRepository.findOne({
      where: { id },
      relations: {
        pessoa: {
          enderecos: true,
          contato: true,
        },
        usuario: true,
      },
      order: {
        pessoa: {
          enderecos: { createdAt: 'DESC' },
        },
      },
    });

    if (!entity) {
      throw new NotFoundException(`Colaborador não encontrado.`);
    }

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget('colaborador:read', null, id);
    }

    return entity;
  }

  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
    instituicaoId?: string,
  ): Promise<Paginated<ColaboradorEntity>> {
    const qb = this.colaboradorRepository.createQueryBuilder('colaborador');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'colaborador:read',
      qb,
    );

    if (instituicaoId) {
      qb.andWhere('colaborador.instituicaoId = :instituicaoId', {
        instituicaoId,
      });
    }

    return paginate<ColaboradorEntity>(query, qb, {
      ...paginateConfig,
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: [
        'pessoa.nome',
        'pessoa.contato.emails',
        'pessoa.contato.telefones',
        'cargo',
        'usuario.usuario',
        'tipoVinculo',
      ],
      relations: {
        pessoa: {
          enderecos: true,
          contato: true,
        },
        usuario: true,
      },
    });
  }

  async create(
    acessoControl: AcessoControl,
    data: CreateColaboradorDto,
  ): Promise<ColaboradorEntity> {
    data.id = undefined;

    // remover a mascara do cpf
    data.cpf = data.cpf?.replace(/\D/g, '');

    switch (data.nivelAcesso) {
      case NivelAcesso.Administrador:
      case NivelAcesso.Defensoria: {
        data.tipoVinculo = null;
        break;
      }
    }

    await acessoControl.ensureCanPerform('colaborador:create', data);

    const pessoa = await this.pessoaService.create(acessoControl, data);
    const usuario = await this.usuarioService.createOrUpdate(data);

    const colaborador = this.colaboradorRepository.create({
      ...data,
      id: uuidv4(),
      pessoa: pessoa,
      usuario: usuario,
    });

    return this.colaboradorRepository.save(colaborador);
  }

  async update(
    acessoControl: AcessoControl,
    id: string,
    data: UpdateColaboradorDto,
  ): Promise<ColaboradorEntity> {
    if (data.cpf) {
      data.cpf = LimparCpf(data.cpf);
    }

    switch (data.nivelAcesso) {
      case NivelAcesso.Administrador:
      case NivelAcesso.Defensoria: {
        data.tipoVinculo = null;
        break;
      }
    }

    await acessoControl.ensureCanReachTarget(
      'colaborador:update',
      this.colaboradorRepository.createQueryBuilder('colaborador'),
      id,
      data,
    );

    const colaborador = await this.colaboradorRepository.findOne({
      where: { id },
      relations: {
        pessoa: {
          enderecos: true,
          contato: true,
        },
        usuario: true,
      },
      order: {
        pessoa: {
          enderecos: { createdAt: 'DESC' },
        },
      },
    });

    const pessoa = await this.pessoaService.update(
      acessoControl,
      colaborador.pessoa.id,
      data,
    );

    const usuario = await this.usuarioService.createOrUpdate(
      data,
      colaborador.usuario.id,
    );

    return this.colaboradorRepository.save(<ColaboradorEntity>{
      ...colaborador,
      ...data,
      id,
      pessoa: { id: pessoa.id },
      usuario: { id: usuario.id },
    });
  }

  async remove(acessoControl: AcessoControl, id: string): Promise<void> {
    const colaborador = await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'colaborador:delete',
      this.colaboradorRepository.createQueryBuilder('colaborador'),
      id,
    );

    await this.colaboradorRepository.softDelete(id);
  }

  /**
   * Busca colaboradores com coordenadas para exibição no mapa
   */
  async findAllWithCoordinates(
    acessoControl: AcessoControl,
    cidadeId?: string,
  ): Promise<ColaboradorEntity[]> {
    const qb = this.colaboradorRepository.createQueryBuilder('colaborador');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'colaborador:read',
      qb,
    );

    qb.leftJoinAndSelect('colaborador.pessoa', 'pessoa')
      .leftJoinAndSelect('pessoa.enderecos', 'endereco')
      .leftJoinAndSelect('endereco.cidade', 'cidade')
      .leftJoinAndSelect('pessoa.contato', 'contato')
      .where('endereco.latitude IS NOT NULL')
      .andWhere('endereco.longitude IS NOT NULL');

    if (cidadeId) {
      qb.andWhere('cidade.id = :cidadeId', { cidadeId });
    }

    qb.select([
      'colaborador.id',
      'colaborador.cargo',
      'colaborador.tipoVinculo',
      'colaborador.instituicaoNome',
      'pessoa.id',
      'pessoa.nome',
      'pessoa.dataNascimento',
      'endereco.id',
      'endereco.logradouro',
      'endereco.numero',
      'endereco.bairro',
      'endereco.latitude',
      'endereco.longitude',
      'cidade.id',
      'cidade.nome',
      'contato.id',
      'contato.telefones',
      'contato.emails',
    ]);

    return qb.getMany();
  }
}
