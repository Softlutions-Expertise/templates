import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../config/paginate.config';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ArquivoService } from '../../infrastructure/arquivo/arquivo.service';
import { DatabaseContextService } from '../../infrastructure/database-context/database-context.service';
import { ContatoService } from '../base/services/contato.service';
import { EnderecoService } from '../base/services/endereco.service';
import { CriteriosDefinidos } from '../configuracao-criterio/fixtures/CriteriosDefinidos';
import { LocalAtendimentoService } from '../local-atendimento/local-atendimento.service';
import { SecretariaMunicipalEtapaService } from '../secretaria-municipal-etapa/secretaria-municipal-etapa.service';
import { CreateSecretariaMunicipalDto } from './dto/create-secretaria-municipal.dto';
import {
  SecretariaMunicipalFindAllFilterAction,
  SecretariaMunicipalFindAllFilterConfiguracao,
} from './dto/secretaria-municipal.dto';
import { UpdateSecretariaMunicipalDto } from './dto/update-secretaria-municipal.dto';
import { SecretariaMunicipalEntity } from './entities/secretaria-municipal.entity';

@Injectable()
export class SecretariaMunicipalService {
  constructor(
    @Inject('SECRETARIA_MUNICIPAL_REPOSITORY')
    private repository: Repository<SecretariaMunicipalEntity>,
    private readonly enderecoService: EnderecoService,
    private readonly contatoService: ContatoService,
    @Inject(forwardRef(() => SecretariaMunicipalEtapaService))
    private readonly secretariaMunicipalEtapaService: SecretariaMunicipalEtapaService,
    private readonly localAtendimentoService: LocalAtendimentoService,
    private readonly databaseContextService: DatabaseContextService,
    private readonly arquivoService: ArquivoService,
  ) {}

  get criterioRepository() {
    return this.databaseContextService.criterioRepository;
  }

  get criteriosConfiguracaoRepository() {
    return this.databaseContextService.criteriosConfiguracaoRepository;
  }

  get criteriosConfiguracaoCriterioRepository() {
    return this.databaseContextService.criteriosConfiguracaoCriterioRepository;
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<SecretariaMunicipalEntity> {
    const qb = this.repository
      .createQueryBuilder('secretaria')
      .leftJoinAndSelect('secretaria.endereco', 'endereco')
      .leftJoinAndSelect('endereco.distrito', 'distrito')
      .leftJoinAndSelect('endereco.subdistrito', 'subdistrito')
      .leftJoinAndSelect('endereco.cidade', 'cidade')
      .leftJoinAndSelect('cidade.estado', 'estado')
      .leftJoinAndSelect('secretaria.contato', 'contato')
      .leftJoinAndSelect(
        'secretaria.secretariaMunicipalEtapas',
        'secretariaMunicipalEtapas',
      )
      .leftJoinAndSelect('secretariaMunicipalEtapas.etapa', 'etapa')
      .leftJoinAndSelect('secretaria.locaisAtendimentos', 'locaisAtendimentos')
      .leftJoinAndSelect('locaisAtendimentos.endereco', 'localEndereco')
      .leftJoinAndSelect('localEndereco.cidade', 'localCidade')
      .leftJoinAndSelect('localEndereco.distrito', 'localDistrito')
      .leftJoinAndSelect('localEndereco.subdistrito', 'localSubdistrito')
      .leftJoinAndSelect('locaisAtendimentos.contato', 'localContato')
      .where('secretaria.id = :id', { id });

    const entity = await qb.getOne();

    if (!entity) {
      throw new NotFoundException(`secretaria municipal não encontrada`);
    }

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'secretaria:read',
        this.repository.createQueryBuilder('secretaria'),
        id,
      );
    }

    // Adiciona o apelido nas etapas se existirem
    if (
      entity.secretariaMunicipalEtapas &&
      entity.secretariaMunicipalEtapas.length > 0
    ) {
      entity.secretariaMunicipalEtapas.forEach((sme) => {
        if (sme.etapa) {
          (sme.etapa as any).apelido = (sme as any).apelido || null;
        }
      });
    }

    return entity;
  }

  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
    filterConfiguracao: SecretariaMunicipalFindAllFilterConfiguracao = SecretariaMunicipalFindAllFilterConfiguracao.ALL,
    filterAction: SecretariaMunicipalFindAllFilterAction = SecretariaMunicipalFindAllFilterAction[
      'secretaria:read'
    ],
  ): Promise<Paginated<SecretariaMunicipalEntity>> {
    const qb = this.repository.createQueryBuilder('secretaria');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      filterAction,
      qb,
    );

    qb.innerJoin('secretaria.endereco', 'endereco');
    qb.innerJoin('endereco.cidade', 'cidade');
    qb.innerJoin('cidade.estado', 'estado');
    qb.innerJoin('secretaria.contato', 'contato');

    // Adiciona JOIN com secretariaMunicipalEtapas para incluir o apelido
    qb.leftJoin(
      'secretaria.secretariaMunicipalEtapas',
      'secretariaMunicipalEtapas',
    );
    qb.leftJoin('secretariaMunicipalEtapas.etapa', 'etapa');
    // Adiciona JOIN com locaisAtendimentos
    qb.leftJoin('secretaria.locaisAtendimentos', 'locaisAtendimentos');
    qb.leftJoin('locaisAtendimentos.endereco', 'localEndereco');
    qb.leftJoin('localEndereco.cidade', 'localCidade');
    qb.leftJoin('localEndereco.distrito', 'localDistrito');
    qb.leftJoin('localEndereco.subdistrito', 'localSubdistrito');
    qb.leftJoin('locaisAtendimentos.contato', 'localContato');

    switch (filterConfiguracao) {
      case SecretariaMunicipalFindAllFilterConfiguracao.CONFIGURADO: {
        qb.innerJoin('locaisAtendimentos.gerenciaAgendamento', 'gerenciaAgendamento'); 
        break;
      }

      case SecretariaMunicipalFindAllFilterConfiguracao.NAO_CONFIGURADO: {
        qb.leftJoin('locaisAtendimentos.gerenciaAgendamento', 'gerenciaAgendamento');
        qb.andWhere('gerenciaAgendamento.id IS NULL');
        break;
      }

      case SecretariaMunicipalFindAllFilterConfiguracao.ALL:
      default: {
        break;
      }
    }

    qb.select([
      'secretaria',
      'endereco',
      'cidade',
      'estado',
      'contato',
      'secretariaMunicipalEtapas',
      'etapa',
      'locaisAtendimentos',
      'localEndereco',
      'localCidade',
      'localDistrito',
      'localSubdistrito',
      'localContato',
    ]);

    const paginatedResult = await paginate(query, qb, {
      ...paginateConfig,
      relations: [
        'endereco',
        'endereco.cidade',
        'endereco.distrito',
        'endereco.subdistrito',
        'endereco.cidade.estado',
        'contato',
        'secretariaMunicipalEtapas',
        'secretariaMunicipalEtapas.etapa',
      ],
      searchableColumns: [
        'razaoSocial',
        'nomeFantasia',
        'cnpj',
        'secretario',
        'vincEnteFederativo',
        'endereco.cidade.nome',
        'secretariaMunicipalEtapas.apelido', // Permite buscar pelo apelido
      ],
      filterableColumns: {
        'id': [FilterOperator.EQ],
        'endereco.cidade.id': [FilterOperator.EQ],
        'secretariaMunicipalEtapas.apelido': [FilterOperator.EQ], // Permite filtrar pelo apelido
      },
    });

    // Mapeia os resultados para incluir o apelido nas etapas
    paginatedResult.data = paginatedResult.data.map((secretaria) => {
      if (
        secretaria.secretariaMunicipalEtapas &&
        secretaria.secretariaMunicipalEtapas.length > 0
      ) {
        secretaria.secretariaMunicipalEtapas.forEach((sme) => {
          if (sme.etapa) {
            (sme.etapa as any).apelido = (sme as any).apelido || null;
          }
        });
      }
      return secretaria;
    });

    return paginatedResult;
  }

  async create(
    acessoControl: AcessoControl,
    data: CreateSecretariaMunicipalDto,
  ) {
    // remover a mascara do cnpj
    data.cnpj = data.cnpj?.replace(/\D/g, '');

    await acessoControl.ensureCanPerform('secretaria:create', data);

    const {
      endereco,
      contato,
      secretariaMunicipalEtapas,
      locaisAtendimentos,
      ...entity
    } = data;

    const _endereco = await this.enderecoService.createOrUpdate(endereco);
    const _contato = await this.contatoService.createOrUpdate(contato);

    if (data.logo) {
      const accessToken =
        await this.arquivoService.uploadSecretariaMunicipalLogoFromBase64(
          acessoControl,
          data.id,
          data.logo,
        );

      data.logo = accessToken;
    }

    const secretaria = await this.repository.save({
      ...entity,
      id: uuidv4(),
      endereco: _endereco,
      contato: _contato,
    });

    const criteriosConfiguracao = this.criteriosConfiguracaoRepository.create();

    this.criteriosConfiguracaoRepository.merge(criteriosConfiguracao, {
      id: uuidv4(),
      dataVigenciaFim: null,
      dataVigenciaInicio: new Date(),
      secretariaMunicipal: { id: secretaria.id },
    });

    await this.criteriosConfiguracaoRepository.save(criteriosConfiguracao);

    for (const criterioDefinido of Object.values(CriteriosDefinidos)) {
      const criterio = this.criterioRepository.create();

      this.criterioRepository.merge(criterio, {
        id: uuidv4(),
        nome: criterioDefinido.label,
        secretariaMunicipal: { id: secretaria.id },
      });

      await this.criterioRepository.save(criterio);

      const criteriosConfiguracaoCriterio =
        this.criteriosConfiguracaoCriterioRepository.create();

      this.criteriosConfiguracaoCriterioRepository.merge(
        criteriosConfiguracaoCriterio,
        {
          id: uuidv4(),
          subPosicao: null,
          exigirComprovacao: false,
          posicao: criterioDefinido.posicao,
          notaTecnica: criterioDefinido.notaTecnica,
          criterio: { id: criterio.id },
          criteriosConfiguracaoId: criteriosConfiguracao.id,
          criteriosConfiguracao: { id: criteriosConfiguracao.id },
        },
      );

      await this.criteriosConfiguracaoCriterioRepository.save(
        criteriosConfiguracaoCriterio,
      );
    }

    for (const secretariaMunicipalEtapa of secretariaMunicipalEtapas) {
      secretariaMunicipalEtapa.secretariaMunicipal = secretaria;

      await this.secretariaMunicipalEtapaService.create(
        secretariaMunicipalEtapa,
      );
    }

    for (const localAtendimento of locaisAtendimentos) {
      const { endereco, contato, ...localAtendimentoEntity } = localAtendimento;

      let _localAtendimentoEndereco;
      let _localAtendimentoContato;

      if (endereco !== undefined) {
        _localAtendimentoEndereco = await this.enderecoService.createOrUpdate(
          endereco,
          endereco?.id,
        );
      }

      if (contato !== undefined) {
        _localAtendimentoContato = await this.contatoService.createOrUpdate(
          contato,
          contato?.id,
        );
      }
      const _localAtendimentoSecretariaMunicipal = {
        id: secretaria.id,
      } as SecretariaMunicipalEntity;

      await this.localAtendimentoService.createOrUpdate({
        ...localAtendimentoEntity,
        endereco: _localAtendimentoEndereco,
        contato: _localAtendimentoContato,
        secretariaMunicipal: _localAtendimentoSecretariaMunicipal,
      });
    }

    return secretaria;
  }

  async update(
    acessoControl: AcessoControl,
    id: string,
    data: UpdateSecretariaMunicipalDto,
  ) {
    let {
      endereco,
      contato,
      secretariaMunicipalEtapas,
      locaisAtendimentos,
      ...entity
    } = await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'secretaria:update',
      this.repository.createQueryBuilder('secretaria'),
      id,
      data,
    );

    if (data.endereco !== undefined)
      endereco = await this.enderecoService.createOrUpdate(
        data.endereco,
        endereco?.id,
      );

    if (data.contato !== undefined)
      contato = await this.contatoService.createOrUpdate(data, contato?.id);

    if (data.secretariaMunicipalEtapas !== undefined) {
      for (const dataSecretariaMunicipalEtapa of data.secretariaMunicipalEtapas) {
        if (dataSecretariaMunicipalEtapa.id) {
          const existingSecretariaMunicipalEtapa =
            secretariaMunicipalEtapas.find((etapa) => {
              return etapa.id === dataSecretariaMunicipalEtapa.id;
            });
          if (existingSecretariaMunicipalEtapa) {
            Object.assign(
              existingSecretariaMunicipalEtapa,
              dataSecretariaMunicipalEtapa,
            );

            await this.secretariaMunicipalEtapaService.update(
              existingSecretariaMunicipalEtapa.id,
              existingSecretariaMunicipalEtapa,
            );
          }
        } else {
          //A FAZER - Implementar lógica para criar nova etapa quando a etapa passada não tiver um id
        }
      }
    }

    if (data.locaisAtendimentos !== undefined) {
      for (const localAtendimento of data.locaisAtendimentos) {
        let {
          endereco: _localAtendimentoEndereco,
          contato: _localAtendimentoContato,
          secretariaMunicipal: _localAtendimentoSecretariaMunicipal,
          ...localAtendimentoEntity
        } = localAtendimento;

        if (localAtendimento.endereco !== undefined) {
          _localAtendimentoEndereco = await this.enderecoService.createOrUpdate(
            localAtendimento.endereco,
            localAtendimento.endereco?.id,
          );
        }
        if (localAtendimento.contato !== undefined) {
          _localAtendimentoContato = await this.contatoService.createOrUpdate(
            localAtendimento.contato,
            localAtendimento.contato?.id,
          );
        }
        if (!localAtendimento.secretariaMunicipal) {
          _localAtendimentoSecretariaMunicipal = {
            id: entity.id,
          } as SecretariaMunicipalEntity;

          localAtendimento.secretariaMunicipal =
            _localAtendimentoSecretariaMunicipal;
        }
        await this.localAtendimentoService.createOrUpdate({
          ...localAtendimentoEntity,
          endereco: _localAtendimentoEndereco,
          contato: _localAtendimentoContato,
          secretariaMunicipal: _localAtendimentoSecretariaMunicipal,
        });
      }
    }

    delete data.endereco;
    delete data.contato;
    delete data.secretariaMunicipalEtapas;
    delete data.locaisAtendimentos;

    if (data.logo) {
      const accessToken =
        await this.arquivoService.uploadSecretariaMunicipalLogoFromBase64(
          acessoControl,
          entity.id,
          data.logo,
        );

      data.logo = accessToken;
    }

    entity = await this.repository.preload({
      id,
      ...data,
    } as any);

    return await this.repository.save(entity);
  }

  async remove(acessoControl: AcessoControl, id: string) {
    const entity = await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'secretaria:delete',
      this.repository.createQueryBuilder('secretaria'),
      id,
    );

    return await this.repository.remove(entity);
  }
}
