import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EventEmitter } from 'events';
import * as JSZip from 'jszip';
import { pick } from 'lodash';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import pMap from 'p-map';
import slug from 'slug';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import { TZ_OFFSET } from '../../../config/TZ_OFFSET';
import eventBus from '../../../helpers/eventEmitter.helper';
import { LimparCpf } from '../../../helpers/functions/Mask';
import { getPMap } from '../../../helpers/p-map';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ArquivoService } from '../../../infrastructure/arquivo/arquivo.service';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import { EnderecoService } from '../../base/services/endereco.service';
import { CriteriosConfiguracaoService } from '../../configuracao-criterio/criterios-configuracao.service';
import { ReservaVagaStatusEnum } from '../../reserva-vaga/enums/reserva-vaga-status.enum';
import { CreateEntrevistaDto } from '../dto/create-entrevista.dto';
import { EntrevistaStatusEnum } from '../dto/enums/entrevista-status-enum';
import { UpdateEntrevistaElegivelFilaDto } from '../dto/update-entrevista-elegivel-fila.dto';
import { UpdateEntrevistaDto } from '../dto/update-entrevista.dto';
import { EntrevistaEntity } from '../entities/entrevista.entity';
import { CriteriosService } from './criterios.service';

export type IEntrevistaComMetadata = EntrevistaEntity & {
  _meta: {
    possuiArquivosEmCriteriosAtuais: boolean;
  };
};

@Injectable()
export class EntrevistaService {
  private _eventEmitterr: EventEmitter;
  private _eventEmitterrOld: EventEmitter;

  constructor(
    private arquivoService: ArquivoService,
    private criteriosService: CriteriosService,
    private databaseContextService: DatabaseContextService,
    private criteriosConfiguracaoService: CriteriosConfiguracaoService,
  ) {
    this._eventEmitterr = new EventEmitter();
    this._eventEmitterrOld = new EventEmitter();
  }

  get eventGenerateFila() {
    return this._eventEmitterr;
  }

  get eventGenerateOldFila() {
    return this._eventEmitterrOld;
  }

  get entrevistaRepository() {
    return this.databaseContextService.entrevistaRepository;
  }

  get arquivoRepository() {
    return this.databaseContextService.arquivoRepository;
  }

  get entrevistaMatchCriterioRepository() {
    return this.databaseContextService.entrevistaMatchCriterioRepository;
  }

  static UnidadeQueryView(qb: SelectQueryBuilder<any>, alias = 'escola') {
    qb.leftJoin(`${alias}.endereco`, `${alias}_endereco`);
    EnderecoService.EnderecoQueryView(qb, `${alias}_endereco`);

    qb.leftJoin(`${alias}.secretariaMunicipal`, `${alias}_secretaria`);
    qb.addSelect([`${alias}_secretaria`]);
  }

  static EntrevistaQueryView(
    qb: SelectQueryBuilder<EntrevistaEntity>,
    {
      filterMaisRecente = true,
      filterMatchCriterioSomenteAtivo = false,
      orderByDataEntrevistaFirst = true,
      selectMatchCriterioArquivo = true,
      includeEtapaApelido = true, // Novo parâmetro
    }: {
      filterMaisRecente?: boolean;
      filterMatchCriterioSomenteAtivo?: boolean;
      orderByDataEntrevistaFirst?: boolean;
      selectMatchCriterioArquivo?: boolean;
      includeEtapaApelido?: boolean; // Novo parâmetro
    } = {},
  ) {
    qb.leftJoin('entrevista.entrevistador', 'entrevista_entrevistador');

    if (orderByDataEntrevistaFirst) {
      qb.addOrderBy('entrevista.dataEntrevista', 'ASC');
    }

    qb.leftJoin(
      'entrevista.preferenciaUnidade',
      'entrevista_preferenciaUnidade1',
    );
    EntrevistaService.UnidadeQueryView(qb, 'entrevista_preferenciaUnidade1');

    qb.leftJoin('entrevista.crianca', 'entrevista_crianca');

    qb.leftJoin('entrevista.reservaVaga', 'entrevista_reservaVaga');

    qb.leftJoin('entrevista.etapa', 'entrevista_etapa');

    //entrevista.secretariaMunicipal.endereco

    qb.leftJoin(
      'entrevista.secretariaMunicipal',
      'entrevista_secretariaMunicipal',
    );

    // Adiciona JOIN com endereco da secretaria municipal
    qb.leftJoin(
      'entrevista_secretariaMunicipal.endereco',
      'entrevista_secretariaMunicipal_endereco',
    );

    // Adiciona JOIN com contato da secretaria municipal
    qb.leftJoin(
      'entrevista_secretariaMunicipal.contato',
      'entrevista_secretariaMunicipal_contato',
    );

    // Adiciona dados do endereco da secretaria municipal ao select
    EnderecoService.EnderecoQueryView(
      qb,
      'entrevista_secretariaMunicipal_endereco',
    );
    // Adiciona dados do contato da secretaria municipal ao select
    qb.addSelect('entrevista_secretariaMunicipal_contato');

    // Adiciona JOIN com secretaria_municipal_etapa para buscar o apelido
    if (includeEtapaApelido) {
      qb.leftJoin(
        'secretaria_municipal_etapa',
        'entrevista_sme',
        'entrevista_sme.secretaria_municipal_id = entrevista.secretaria_municipal_id AND entrevista_sme.etapa_id = entrevista.etapa_id',
      );
      qb.addSelect('entrevista_sme.apelido', 'etapaApelido');
    }

    qb.leftJoin(
      'entrevista.preferenciaUnidade2',
      'entrevista_preferenciaUnidade2',
    );
    EntrevistaService.UnidadeQueryView(qb, 'entrevista_preferenciaUnidade2');

    qb.leftJoin(
      'entrevista.unidadeEscolarIrmao',
      'entrevista_unidadeEscolarIrmao',
    );
    EntrevistaService.UnidadeQueryView(qb, 'entrevista_unidadeEscolarIrmao');

    qb.leftJoin(
      'entrevista_entrevistador.pessoa',
      'entrevista_entrevistador_pessoa',
    );

    // Adiciona JOIN com endereco da criança
    qb.leftJoin('entrevista_crianca.endereco', 'entrevista_crianca_endereco');

    qb.leftJoin('entrevista_crianca.contato', 'entrevista_crianca_contato');

    EnderecoService.EnderecoQueryView(qb, 'entrevista_crianca_endereco');

    qb.leftJoin(
      'entrevista_crianca.responsavel',
      'entrevista_crianca_responsavel',
    );
    qb.leftJoin(
      'entrevista_crianca.responsavel2',
      'entrevista_crianca_responsavel2',
    );

    qb.leftJoin(
      'entrevista.matchCriterios',
      'entrevista_matchCriterio',
      `
        (
          ${filterMaisRecente
        ? `(entrevista_matchCriterio.versaoMaisRecente = TRUE) AND`
        : ''
      }
          ${filterMatchCriterioSomenteAtivo
        ? `(entrevista_matchCriterio.ativo = TRUE) AND`
        : ''
      }
          (entrevista_matchCriterio.entrevistaId = entrevista.id)
        )
      `,
    );

    qb.leftJoin(
      'entrevista_matchCriterio.entrevista',
      'entrevista_matchCriterio_entrevista',
    );

    qb.leftJoin(
      'entrevista_matchCriterio.criterio',
      'entrevista_matchCriterio_criterio',
    );

    qb.leftJoin(
      'entrevista_matchCriterio.arquivo',
      'entrevista_matchCriterio_arquivo',
    );

    qb.addSelect([
      'entrevista',
      'entrevista.id',
      'entrevista_etapa',
      'entrevista_reservaVaga',
      'entrevista_entrevistador',
      'entrevista_preferenciaUnidade1',
      'entrevista_crianca',
      'entrevista_crianca_endereco',
      'entrevista_crianca_contato',
      'entrevista_preferenciaUnidade2',
      'entrevista_entrevistador_pessoa',
      'entrevista_unidadeEscolarIrmao',
      'entrevista_secretariaMunicipal',
      'entrevista_crianca_responsavel',
      'entrevista_crianca_responsavel2',
      'entrevista_matchCriterio',
      'entrevista_matchCriterio_entrevista.id',
      'entrevista_matchCriterio_criterio.id',
      'entrevista_matchCriterio_criterio.nome',
    ]);

    qb.leftJoin(
      'entrevista_preferenciaUnidade1.turmas',
      'entrevista_preferenciaUnidade1_turma',
    );

    qb.addSelect([
      'entrevista_preferenciaUnidade1_turma.id',
      'entrevista_preferenciaUnidade1_turma.turno',
    ]);

    qb.leftJoin(
      'entrevista_preferenciaUnidade2.turmas',
      'entrevista_preferenciaUnidade2_turma',
    );

    qb.addSelect([
      'entrevista_preferenciaUnidade2_turma.id',
      'entrevista_preferenciaUnidade2_turma.turno',
    ]);

    if (selectMatchCriterioArquivo) {
      qb.addSelect(['entrevista_matchCriterio_arquivo']);
    }

    return qb;
  }

  async getEntrevistaMatchCriteriosComDefinicoes(entity: EntrevistaEntity) {
    try {
      const definicoesAtual =
        await this.criteriosConfiguracaoService.consultaDefinicoesAtual(
          null,
          entity.secretariaMunicipal.id,
        );

      const matchCriterios = entity.matchCriterios ?? [];

      return matchCriterios.map((matchCriterio) => {
        const definicao = definicoesAtual.definicoes.find(
          (definicao) => definicao.criterio.id === matchCriterio.criterio.id,
        );

        const currentConfiguracaoCriterio = pick(definicao, [
          'id',
          'notaTecnica',
          'posicao',
          'subPosicao',
          'exigirComprovacao',
        ]);

        return {
          ...matchCriterio,

          criterio: {
            ...matchCriterio.criterio,

            ...definicao.criterio,

            currentConfiguracaoCriterio: {
              ...currentConfiguracaoCriterio,
              criteriosConfiguracaoId: definicoesAtual.configuracao.id,
            },
          },
        };
      });
    } catch (_) { }

    return [];
  }

  async attachEntrevistaMatchCriteriosComDefinicoes(entity: EntrevistaEntity) {
    try {
      if (entity) {
        const matchCriteriosComDefinicoes =
          await this.getEntrevistaMatchCriteriosComDefinicoes(entity);

        entity.matchCriterios = matchCriteriosComDefinicoes as any[];
      }
    } catch (_) { }

    return entity;
  }

  async attachEntrevistasMatchCriteriosComDefinicoes(
    entities: EntrevistaEntity[],
  ) {
    if (entities) {
      const pmap = await getPMap();

      return pmap(
        entities,
        (entity) => this.attachEntrevistaMatchCriteriosComDefinicoes(entity),
        { concurrency: 2 },
      );
    }

    return entities;
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<EntrevistaEntity> {
    const qb = this.entrevistaRepository.createQueryBuilder('entrevista');

    EntrevistaService.EntrevistaQueryView(qb, {
      filterMaisRecente: true,
      includeEtapaApelido: true,
    });

    qb.andWhere('entrevista.id = :entrevistaId', { entrevistaId: id });

    const rawResult = await qb.getRawAndEntities();
    const entity = rawResult.entities[0];
    const raw = rawResult.raw[0];

    if (!entity) {
      throw new NotFoundException(`Entrevista não encontrada`);
    }

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'entrevista:read',
        qb,
        entity.id,
      );
    }

    entity.id = entity.id ?? id;

    // Adiciona o apelido dentro do objeto etapa
    if (entity.etapa) {
      (entity.etapa as any).apelido = raw?.etapaApelido || null;
    }

    await this.attachEntrevistaMatchCriteriosComDefinicoes(entity);

    return entity;
  }

  async findAll(
    acessoControl: AcessoControl | null,
    query: PaginateQuery,
    incluirTudo: boolean = false,
  ): Promise<Paginated<IEntrevistaComMetadata>> {

    const qbAcesso = this.entrevistaRepository.createQueryBuilder('entrevista');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'entrevista:read',
      qbAcesso,
    );

    // Adiciona JOIN para buscar o apelido da etapa
    qbAcesso.leftJoin(
      'secretaria_municipal_etapa',
      'sme',
      'sme.secretaria_municipal_id = entrevista.secretaria_municipal_id AND sme.etapa_id = entrevista.etapa_id',
    );
    qbAcesso.addSelect('sme.apelido', 'etapaApelido');

    if (query?.filter?.preferenciaUnidade) {
      qbAcesso.andWhere(
        new Brackets((qb) => {
          qb.where('entrevista.preferencia_unidade = :preferenciaUnidadeId', {
            preferenciaUnidadeId: query.filter.preferenciaUnidade,
          }).orWhere(
            'entrevista.preferencia_unidade2 = :preferenciaUnidadeId',
            {
              preferenciaUnidadeId: query.filter.preferenciaUnidade,
            },
          );
        }),
      );
    }

    if (query?.filter?.preferenciaTurno) {
      qbAcesso.andWhere(
        new Brackets((qb) => {
          qb.where('entrevista.preferencia_turno = :preferenciaTurno', {
            preferenciaTurno: query.filter.preferenciaTurno,
          }).orWhere('entrevista.preferencia_turno2 = :preferenciaTurno', {
            preferenciaTurno: query.filter.preferenciaTurno,
          });
        }),
      );
    }

    const paginated = await paginate(query, qbAcesso, {
      ...paginateConfig,
      defaultSortBy: [
        ['dataEntrevista', 'DESC'],
        ['horarioEntrevista', 'DESC'],
      ],
      sortableColumns: ['dataEntrevista', 'horarioEntrevista'],
      relations: [
        'etapa',
        'crianca',
        'crianca.responsavel',
        'crianca.responsavel2',
        'preferenciaUnidade',
        'preferenciaUnidade2',
        'entrevistador',
        'entrevistador.pessoa',
        'secretariaMunicipal',
        'reservaVaga',
      ],
      searchableColumns: [
        'dataEntrevista',
        'horarioEntrevista',
        'entrevistador.pessoa.nome',
        'crianca.nome',
        'crianca.cpf',
        'crianca.responsavel.nomeRes',
        'crianca.responsavel2.nomeRes',
        'preferenciaUnidade.nomeFantasia',
        'preferenciaUnidade2.nomeFantasia',
        'preferenciaTurno',
        'preferenciaTurno2',
        'updatedAt',
      ],
      filterableColumns: {
        anoLetivo: [FilterOperator.EQ],
        status: [FilterOperator.EQ],
        'crianca.cpf': [FilterOperator.EQ],
        'secretariaMunicipal.id': [FilterOperator.EQ],
        'etapa.id': [FilterOperator.EQ],
      },
      select: [
        'id',
        'nomeResponsavel',
        'dataEntrevista',
        'horarioEntrevista',
        'preferenciaTurno',
        'preferenciaTurno2',
        'elegivelParaFila',
        'elegivelParaFila2',
        'anoLetivo',
        'status',
        'updatedAt',

        'entrevistador.id',
        'entrevistador.pessoa.nome',

        'crianca.id',
        'crianca.nome',
        'crianca.cpf',
        'crianca.responsavel.id',
        'crianca.responsavel.nomeRes',
        'crianca.responsavel2.id',
        'crianca.responsavel2.nomeRes',

        'preferenciaUnidade.id',
        'preferenciaUnidade.nomeFantasia',
        'preferenciaUnidade.razaoSocial',

        'preferenciaUnidade2.id',
        'preferenciaUnidade2.nomeFantasia',
        'preferenciaUnidade2.razaoSocial',

        'etapa.id',
        'etapa.nome',

        'reservaVaga.id',
        'reservaVaga.status',
      ],
    });

    // Busca os apelidos manualmente após a paginação
    const idsEntrevistas = paginated.data.map((item) => item.id);

    const apelidosMap = new Map();
    if (idsEntrevistas.length > 0) {
      const apelidosQuery = await this.entrevistaRepository
        .createQueryBuilder('entrevista')
        .leftJoin(
          'secretaria_municipal_etapa',
          'sme',
          'sme.secretaria_municipal_id = entrevista.secretaria_municipal_id AND sme.etapa_id = entrevista.etapa_id',
        )
        .select('entrevista.id', 'entrevistaId')
        .addSelect('sme.apelido', 'etapaApelido')
        .where('entrevista.id IN (:...ids)', { ids: idsEntrevistas })
        .getRawMany();

      apelidosQuery.forEach((row) => {
        apelidosMap.set(row.entrevistaId, row.etapaApelido);
      });
    }

    const mappedData = await pMap(
      paginated.data,
      async (entrevista): Promise<IEntrevistaComMetadata> => {
        const entrevistaFromFindOne = await this.findOne(null, entrevista.id);

        const possuiArquivosEmCriteriosAtuais =
          entrevistaFromFindOne.matchCriterios.some(
            (matchCriterio) => !!matchCriterio.arquivo,
          );

        return {
          ...(incluirTudo ? entrevistaFromFindOne : entrevista as any),
          etapa: {
            ...entrevista.etapa,
            apelido: apelidosMap.get(entrevista.id) || null, // Adiciona apelido dentro de etapa
          },
          _meta: {
            possuiArquivosEmCriteriosAtuais,
          },
        };
      },
      { concurrency: 3 },
    );

    const paginatedMapped: Paginated<IEntrevistaComMetadata> = {
      ...paginated,
      data: mappedData,
    };

    return paginatedMapped;
  }

  async findAllPublicWithVagas(
    query: PaginateQuery,
  ): Promise<Paginated<EntrevistaEntity>> {
    const qbAcesso = this.entrevistaRepository
      .createQueryBuilder('entrevista')
      .innerJoin(
        'reserva_vaga',
        'reserva_vaga',
        'reserva_vaga.entrevista_id = entrevista.id',
      );

    // Adiciona JOIN para buscar o apelido da etapa
    qbAcesso.leftJoin(
      'secretaria_municipal_etapa',
      'sme',
      'sme.secretaria_municipal_id = entrevista.secretaria_municipal_id AND sme.etapa_id = entrevista.etapa_id',
    );
    qbAcesso.addSelect('sme.apelido', 'etapaApelido');

    // Removendo qualquer parâmetro adicional que não seja processado pela função paginate
    const paginateQuery = { ...query };

    const paginatedResult = await paginate(paginateQuery, qbAcesso, {
      ...paginateConfig,
      defaultSortBy: [
        ['dataEntrevista', 'DESC'],
        ['horarioEntrevista', 'DESC'],
      ],
      sortableColumns: ['dataEntrevista', 'horarioEntrevista'],
      relations: [
        'crianca',
        'reservaVaga',
        'reservaVaga.vaga',
        'reservaVaga.vaga.escola',
        'reservaVaga.vaga.turma',
        'reservaVaga.vaga.turma.etapa',
      ],
      searchableColumns: [
        'dataEntrevista',
        'horarioEntrevista',
        'reservaVaga.vaga.anoLetivo',
        'reservaVaga.vaga.turma.turno',
        'reservaVaga.vaga.escola.razaoSocial',
      ],
      filterableColumns: {
        'reservaVaga.vaga.anoLetivo': [FilterOperator.EQ],
        'reservaVaga.vaga.turma.turno': [FilterOperator.EQ],
        'reservaVaga.vaga.turma.etapa.id': [FilterOperator.EQ],
        'reservaVaga.vaga.escola.id': [FilterOperator.EQ],
      },
    });

    // Busca os apelidos manualmente para os resultados paginados
    const idsEntrevistas = paginatedResult.data.map((item) => item.id);

    const apelidosMap = new Map();
    if (idsEntrevistas.length > 0) {
      const apelidosQuery = await this.entrevistaRepository
        .createQueryBuilder('entrevista')
        .leftJoin(
          'secretaria_municipal_etapa',
          'sme',
          'sme.secretaria_municipal_id = entrevista.secretaria_municipal_id AND sme.etapa_id = entrevista.etapa_id',
        )
        .select('entrevista.id', 'entrevistaId')
        .addSelect('sme.apelido', 'etapaApelido')
        .where('entrevista.id IN (:...ids)', { ids: idsEntrevistas })
        .getRawMany();

      apelidosQuery.forEach((row) => {
        apelidosMap.set(row.entrevistaId, row.etapaApelido);
      });
    }

    const pmap = await getPMap();

    paginatedResult.data = await pmap(
      paginatedResult.data,
      async (result) => {
        const qb = this.entrevistaRepository
          .createQueryBuilder('entrevista')
          .where('entrevista.id = :entrevistaId', { entrevistaId: result.id })

          .leftJoin(
            'reserva_vaga',
            'reserva_vaga',
            'reserva_vaga.entrevista_id = entrevista.id',
          )
          .leftJoin('vagas', 'vagas', 'vagas.id = reserva_vaga.vaga_id')
          .leftJoin('escola', 'escola', 'escola.id = vagas.escola_id')
          .addSelect('vagas.escola_id', 'vagaEscolaId')
          .addSelect('escola.razao_social', 'escolaRazaoSocial');

        EntrevistaService.EntrevistaQueryView(qb, {
          filterMaisRecente: true,
          filterMatchCriterioSomenteAtivo: true,
          includeEtapaApelido: true, // Inclui o apelido
        });

        const rawResult = await qb.getRawAndEntities();
        const qbEntrevista = rawResult.entities[0];
        const raw = rawResult.raw[0];

        await this.attachEntrevistaMatchCriteriosComDefinicoes(qbEntrevista);

        // Adiciona o apelido da etapa se existir
        if (qbEntrevista?.etapa) {
          (qbEntrevista.etapa as any).apelido =
            apelidosMap.get(result.id) || raw?.etapaApelido || null;
        }

        return <EntrevistaEntity>{
          ...result,
          etapa: qbEntrevista?.etapa
            ? {
              ...qbEntrevista.etapa,
              apelido:
                apelidosMap.get(result.id) || raw?.etapaApelido || null,
            }
            : result.etapa,
          matchCriterios: qbEntrevista?.matchCriterios || [],
          escolaRazaoSocial: qbEntrevista?.escolaRazaoSocial || null,
        };
      },
      { concurrency: 2 },
    );

    return paginatedResult;
  }

  private prepareQbCriancaId(
    qb: SelectQueryBuilder<EntrevistaEntity>,
    criancaId: string,
  ) {
    qb.innerJoin('entrevista.crianca', 'crianca');
    qb.where('crianca.id = :criancaId', { criancaId: criancaId });
  }

  private createQbCriancaIdCurrentEntrevista(
    criancaId: string,
    currentEntrevistaId: string | null = null,
  ) {
    const qb = this.entrevistaRepository.createQueryBuilder('entrevista');

    this.prepareQbCriancaId(qb, criancaId);

    if (currentEntrevistaId) {
      qb.andWhere('entrevista.id <> :currentEntrevistaId', {
        currentEntrevistaId: currentEntrevistaId,
      });
    }

    return qb;
  }

  private async isAvailableEntrevistaForCrianca(
    criancaId: string,
    currentEntrevistaId: string | null = null,
  ) {
    const qb = this.createQbCriancaIdCurrentEntrevista(
      criancaId,
      currentEntrevistaId,
    );

    const exists = await qb.getExists();

    if (!exists) {
      return true;
    }

    return false;
  }

  async checarCriancaPodeSerAtribuidaNaEntrevista(
    acessoControl: AcessoControl | null,
    criancaId: string,
    currentEntrevistaId: string | null = null,
    secretariaId: string | null = null,
  ) {
    if (acessoControl && !acessoControl.currentFuncionario) {
      throw new ForbiddenException(
        'Você não tem permissão para realizar esta operação',
      );
    }

    const qb = this.entrevistaRepository.createQueryBuilder('entrevista');
    this.prepareQbCriancaId(qb, criancaId);

    if (currentEntrevistaId) {
      qb.andWhere('entrevista.id <> :currentEntrevistaId', {
        currentEntrevistaId,
      });
    }

    if (secretariaId) {
      qb.andWhere('entrevista.secretariaMunicipal.id = :secretariaId', {
        secretariaId,
      });
    }

    qb.orderBy('entrevista.createdAt', 'DESC');

    const entrevistaExistente = await qb.getOne();

    if (entrevistaExistente) {
      return {
        isAvailable: false,
        entrevista: {
          id: entrevistaExistente.id,
          status: entrevistaExistente.status,
        },
      };
    }

    return {
      isAvailable: true,
      entrevista: null,
    };
  }

  async create(acessoControl: AcessoControl | null, dto: CreateEntrevistaDto) {
    if (dto.cpfResponsavel) {
      dto.cpfResponsavel = LimparCpf(dto.cpfResponsavel);
    }

    if (dto.cpfIrmao) {
      dto.cpfIrmao = LimparCpf(dto.cpfIrmao);
    }

    if (acessoControl) {
      await acessoControl.ensureCanPerform('entrevista:create', dto);
    }

    const entrevistaExistente =
      await this.internalFindOneByCriancaIdAndSecretariaMunicipalId(
        dto.crianca.id,
        dto.secretariaMunicipal.id,
      );

    let entrevistaStatus = EntrevistaStatusEnum.AGUARDANDO;

    if (entrevistaExistente) {
      switch (entrevistaExistente.status) {
        case EntrevistaStatusEnum.AGUARDANDO:
        case EntrevistaStatusEnum.TRANSFERENCIA:
          throw new UnprocessableEntityException(
            `Não é possível criar uma nova entrevista. Já existe uma com status "${entrevistaExistente.status}" para esta criança.`,
          );

        case EntrevistaStatusEnum.CONCLUIDO:
          entrevistaStatus = EntrevistaStatusEnum.TRANSFERENCIA;
          break;

        default:
          break;
      }

      const hasReservaVagaPendente = entrevistaExistente.reservaVaga?.status
        ? entrevistaExistente.reservaVaga.status ===
        ReservaVagaStatusEnum.PENDENTE
        : false;
      if (hasReservaVagaPendente) {
        throw new UnprocessableEntityException(
          'Não é possível criar uma nova entrevista. Já existe uma reserva de vaga pendente para esta criança.',
        );
      }
    }

    const { criterios: dtoCriterios, ...data } = dto;

    const entrevista = this.entrevistaRepository.create({
      id: uuidv4(),
      status: entrevistaStatus,
      ...pick(data, [
        'dataEntrevista',
        'horarioEntrevista',
        'etapa.id',
        'preferenciaTurno',
        'preferenciaTurno2',
        'preferenciaUnidade.id',
        'preferenciaUnidade2.id',
        'tipoResponsavel',
        'anoLetivo',
        'nomeResponsavel',
        'parentescoResponsavel',
        'cpfResponsavel',
        'dataNascimentoResponsavel',
        'sexoResponsavel',
        'estadoCivilResponsavel',
        'possuiIrmaoNaUnidade',
        'nomeIrmao',
        'cpfIrmao',
        'unidadeEscolarIrmao',
        'membrosEderecoCrianca',
        'membrosContribuintesRenda',
        'valorRendaFamiliar',
        'observacoesFamilia',
        'observacoesCentralVagas',
        'crianca.id',
        'entrevistador.id',
        'secretariaMunicipal.id',
      ]),
    });

    await this.entrevistaRepository.save(entrevista);

    for (const dtoCriterio of dtoCriterios) {
      await this.criteriosService.findOne(null, dtoCriterio.id);
    }

    for (const dtoCriterio of dtoCriterios) {
      const matchCriterio = this.entrevistaMatchCriterioRepository.create({
        id: uuidv4(),

        ativo: dtoCriterio.ativo,
        versaoMaisRecente: true,

        entrevista: {
          id: entrevista.id,
        },

        criterio: {
          id: dtoCriterio.id,
        },
      });

      if (dtoCriterio.arquivo) {
        try {
          const { arquivo } =
            await this.arquivoService.uploadInterviewCriterionFromBase64(
              acessoControl,

              matchCriterio.entrevista.id,
              matchCriterio.criterio.id,

              dtoCriterio.arquivo,

              {
                nomeArquivo: dtoCriterio.nomeArquivo,
                tipoArquivo: dtoCriterio.tipoArquivo,
                nameSizeFile: dtoCriterio.nameSizeFile,
                byteString: dtoCriterio.byteString,
              },
            );

          this.entrevistaMatchCriterioRepository.merge(matchCriterio, {
            arquivo: {
              id: arquivo.id,
            },
          });
        } catch (error) {
          console.error(error);
        }
      }

      await this.entrevistaMatchCriterioRepository.save(matchCriterio);
    }

    await this.entrevistaRepository.save(entrevista);

    if (
      entrevista.etapa &&
      ((entrevista.preferenciaUnidade && entrevista.preferenciaTurno) ||
        (entrevista.preferenciaUnidade2 && entrevista.preferenciaTurno2))
    ) {
      this.eventGenerateFila.emit('criarFila', entrevista);
    }

    const entity = await this.findOne(acessoControl, entrevista.id);

    eventBus.emit('agendamento:finalizarAgendamento', entity.crianca.cpf);

    eventBus.emit('mailer:enviarComprovanteEntrevista', entity);
    eventBus.emit('whatsapp:enviarComprovanteEntrevista', entity);

    return entity;
  }

  async update(
    acessoControl: AcessoControl | null,
    id: string,
    dto: UpdateEntrevistaDto,
  ): Promise<EntrevistaEntity> {
    const entrevista = await this.findOne(acessoControl, id);
    //NAO mexer nesse trecho pq da ero nao sei pq , investigar depois
    const entrevistaOld = await this.findOne(null, id);

    // Verifica se a entrevista já possui uma reserva de vaga vinculada
    // e impede a alteração da entrevista caso já exista uma reserva de vaga vinculada
    const hasReservaVaga = await this.entrevistaRepository
      .createQueryBuilder('entrevista')
      .innerJoin(
        'reserva_vaga',
        'reserva_vaga',
        'reserva_vaga.entrevista_id = entrevista.id',
      )
      .where('entrevista.id = :entrevistaId', { entrevistaId: id })
      .getCount();
    if (hasReservaVaga) {
      throw new ForbiddenException(
        'Não é possível alterar a entrevista pois já existe uma Reserva de Vaga vinculada a ela.',
      );
    }

    if (dto.cpfResponsavel) {
      dto.cpfResponsavel = LimparCpf(dto.cpfResponsavel);
    }

    if (dto.cpfIrmao) {
      dto.cpfIrmao = LimparCpf(dto.cpfIrmao);
    }

    delete dto.crianca;
    delete dto.secretariaMunicipal;

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'entrevista:update',
        null,
        id,
        dto,
      );
    }

    const { criterios: dtoCriterios, ...data } = dto;

    entrevista.updatedAt = new Date();

    this.entrevistaRepository.merge(entrevista, {
      ...pick(data, [
        'dataEntrevista',
        'horarioEntrevista',
        'etapa.id',
        'anoLetivo',
        'preferenciaTurno',
        'preferenciaTurno2',
        'preferenciaUnidade.id',
        'preferenciaUnidade2.id',
        'tipoResponsavel',
        'nomeResponsavel',
        'parentescoResponsavel',
        'cpfResponsavel',
        'dataNascimentoResponsavel',
        'sexoResponsavel',
        'estadoCivilResponsavel',
        'possuiIrmaoNaUnidade',
        'nomeIrmao',
        'cpfIrmao',
        'unidadeEscolarIrmao',
        'membrosEderecoCrianca',
        'membrosContribuintesRenda',
        'valorRendaFamiliar',
        'observacoesFamilia',
        'observacoesCentralVagas',
        'crianca.id',
        'entrevistador.id',
        'secretariaMunicipal.id',
      ]),
    });

    const updt = { ...entrevista };

    delete updt.criterios;
    delete updt.matchCriterios;

    await this.entrevistaRepository.save(updt);

    if (dtoCriterios) {
      for (const dtoCriterio of dtoCriterios) {
        await this.criteriosService.findOne(null, dtoCriterio.id);
      }

      const matchCriteriosAtuais = await this.entrevistaMatchCriterioRepository
        .createQueryBuilder('entrevista_match_criterio')
        .innerJoin('entrevista_match_criterio.entrevista', 'entrevista')
        .where('entrevista.id = :entrevistaId', { entrevistaId: entrevista.id })
        .andWhere('entrevista_match_criterio.versaoMaisRecente = TRUE')
        .select(['entrevista_match_criterio.id'])
        .getMany();

      await this.entrevistaMatchCriterioRepository
        .createQueryBuilder('entrevista_match_criterio')
        .update()
        .set({
          versaoMaisRecente: false,
        })
        .whereInIds(matchCriteriosAtuais.map((i) => i.id))
        .execute();

      for (const dtoCriterio of dtoCriterios) {
        const matchCriterio = this.entrevistaMatchCriterioRepository.create({
          id: uuidv4(),

          ativo: dtoCriterio.ativo,
          versaoMaisRecente: true,

          entrevista: {
            id: entrevista.id,
          },

          criterio: {
            id: dtoCriterio.id,
          },
        });

        if (dtoCriterio.arquivo) {
          const customPattern =
            /^entrevista::[0-9a-fA-F-]{36}::comprovantes-criterios::[0-9a-fA-F-]{36}::[0-9a-fA-F-]{36}$/;
          if (!customPattern.test(dtoCriterio.arquivo)) {
            try {
              const { arquivo } =
                await this.arquivoService.uploadInterviewCriterionFromBase64(
                  acessoControl,
                  matchCriterio.entrevista.id,
                  matchCriterio.criterio.id,
                  dtoCriterio.arquivo,
                  {
                    nomeArquivo: dtoCriterio.nomeArquivo,
                    tipoArquivo: dtoCriterio.tipoArquivo,
                    nameSizeFile: dtoCriterio.nameSizeFile,
                    byteString: dtoCriterio.byteString,
                  },
                );

              this.entrevistaMatchCriterioRepository.merge(matchCriterio, {
                arquivo: { id: arquivo.id },
              });
            } catch (error) {
              console.error(error);
            }
          } else {
            const arquivo = await this.arquivoRepository.findOne({
              where: {
                accessToken: dtoCriterio.arquivo,
              },
            });

            this.entrevistaMatchCriterioRepository.merge(matchCriterio, {
              arquivo: arquivo ?? null,
            });
          }
        }

        await this.entrevistaMatchCriterioRepository.save(matchCriterio);
      }
    }

    const _entrevista = await this.findOne(null, entrevista.id);
    if (
      _entrevista.etapa &&
      ((_entrevista.preferenciaUnidade && _entrevista.preferenciaTurno) ||
        (_entrevista.preferenciaUnidade2 && _entrevista.preferenciaTurno2))
    ) {
      this.eventGenerateFila.emit('criarFila', _entrevista);
    }

    if (
      entrevistaOld.etapa &&
      ((entrevistaOld.preferenciaUnidade && entrevistaOld.preferenciaTurno) ||
        (entrevistaOld.preferenciaUnidade2 && entrevistaOld.preferenciaTurno2))
    ) {
      this.eventGenerateOldFila.emit('criarFilaOld', entrevistaOld);
    }

    eventBus.emit('agendamento:finalizarAgendamento', _entrevista.crianca.cpf);

    return _entrevista;
  }

  async updateElegivelFila(
    acessoControl: AcessoControl | null,
    id: string,
    dto: UpdateEntrevistaElegivelFilaDto,
  ): Promise<EntrevistaEntity> {
    let entrevista = await this.findOne(acessoControl, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'entrevista:update',
        null,
        id,
        dto,
      );
    }

    if (
      dto.elegivelParaFila === entrevista.elegivelParaFila &&
      dto.elegivelParaFila === entrevista.elegivelParaFila2
    ) {
      throw new UnprocessableEntityException(
        'Não é possível alterar a elegibilidade da entrevista para fila, pois a mesma já está com o valor informado.',
      );
    }

    const currentDate = new Date();
    entrevista.updatedAt = currentDate;

    const data = {
      elegivelParaFila: dto.elegivelParaFila,
      elegivelParaFila2: dto.elegivelParaFila,
      dataEntrevista: entrevista.dataEntrevista,
      horarioEntrevista: entrevista.horarioEntrevista,
    };
    // RN: Só irá atualizar a data e horário da entrevista se a entrevista não estiver elegível para ambas as filas (preferenciaUnidade e preferênciaUnidade2)
    if (
      entrevista.elegivelParaFila === false &&
      entrevista.elegivelParaFila2 === false
    ) {
      const dataEntrevista = new Date(currentDate);
      const horarioEntrevista = new Date(currentDate);
      dataEntrevista.setUTCHours(
        dataEntrevista.getUTCHours() - TZ_OFFSET,
        0,
        0,
        0,
      );
      dataEntrevista.setUTCHours(TZ_OFFSET, 0, 0, 0);
      horarioEntrevista.setUTCHours(
        horarioEntrevista.getUTCHours() - TZ_OFFSET,
      );
      const horarioEntrevistaString = `${horarioEntrevista
        .getUTCHours()
        .toString()
        .padStart(2, '0')}:${horarioEntrevista
          .getUTCMinutes()
          .toString()
          .padStart(2, '0')}`;

      data.dataEntrevista = dataEntrevista;
      data.horarioEntrevista = horarioEntrevistaString;
    }

    this.entrevistaRepository.merge(entrevista, data);

    delete entrevista.criterios;
    delete entrevista.matchCriterios;

    // Verifica se a entrevista já possui uma reserva de vaga vinculada
    // e exclui tanto a reserva de vaga quanto a vaga vinculada caso a
    // entrevista seja marcada como elegível para fila
    const reservaVaga =
      await this.databaseContextService.reservaVagaRepository.findOne({
        where: {
          entrevista: { id },
          status: ReservaVagaStatusEnum.INDEFERIDA,
        },
        relations: ['vaga'],
      });

    if (reservaVaga) {
      await this.databaseContextService.reservaVagaRepository.remove(
        reservaVaga,
      );
      await this.databaseContextService.vagaRepository.remove(reservaVaga.vaga);
    }

    await this.entrevistaRepository.save(entrevista);

    if (
      entrevista.etapa &&
      ((entrevista.preferenciaUnidade && entrevista.preferenciaTurno) ||
        (entrevista.preferenciaUnidade2 && entrevista.preferenciaTurno2))
    ) {
      eventBus.emit('criarFila', entrevista);
    }

    return entrevista;
  }

  async remove(acessoControl: AcessoControl | null, id: string) {
    const entity = await this.findOne(acessoControl, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget('entrevista:delete', null, id);
    }

    await this.entrevistaRepository.remove(entity);

    if (entity.etapa && entity.preferenciaUnidade && entity.preferenciaTurno) {
      this.eventGenerateFila.emit(
        'criarFila',
        pick(entity, [
          'secretariaMunicipal.id',
          'preferenciaUnidade.id',
          'etapa.id',
          'preferenciaTurno',
        ]),
      );
    }

    if (
      entity.etapa &&
      entity.preferenciaUnidade2 &&
      entity.preferenciaTurno2
    ) {
      this.eventGenerateFila.emit(
        'criarFila',
        pick(entity, [
          'secretariaMunicipal.id',
          'preferenciaUnidade2.id',
          'etapa.id',
          'preferenciaTurno2',
        ]),
      );
    }
    return entity;
  }

  async findAllEntrevistadoresBySecretariaId(
    acessoControl: AcessoControl | null,
    secretariaId: string,
  ): Promise<{ id: string; nome: string }[]> {
    const qb = this.entrevistaRepository.createQueryBuilder('entrevista');

    qb.innerJoin('entrevista.entrevistador', 'entrevistador')
      .innerJoin('entrevistador.pessoa', 'pessoa')
      .andWhere('entrevista.secretariaMunicipal.id = :secretariaId', {
        secretariaId,
      })
      .select(['entrevistador.id', 'pessoa.nome'])
      .distinct(true);

    const raw = await qb.getRawMany<{
      entrevistador_id: string;
      pessoa_nome: string;
    }>();

    return raw.map((item) => ({
      id: item.entrevistador_id,
      nome: item.pessoa_nome,
    }));
  }

  async downloadArquivosCriteriosZip(
    acessoControl: AcessoControl | null,
    entrevistaId: string,
  ) {
    const entrevista = await this.findOne(acessoControl, entrevistaId);
    const criterios = entrevista.matchCriterios;
    const zip = new JSZip();

    let hasFiles = false;

    for (const criterio of criterios) {
      if (criterio.arquivo) {
        try {
          const arquivo =
            await this.arquivoService.getUploadedFileByAccessToken(
              acessoControl,
              criterio.arquivo.accessToken,
            );

          if (arquivo && arquivo.stream) {
            const contentType = arquivo.headers['Content-Type'];

            const chunks = [];
            for await (const chunk of arquivo.stream) {
              chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            const safeFolder = slug(
              `${criterio.criterio.nome.substring(0, 50)}`,
              {
                lower: true,
              },
            );

            const safeFile = slug(`${criterio.arquivo.nomeArquivo}`, {
              lower: true,
            });
            zip.file(`${safeFolder}/${safeFile}`, buffer, { binary: true });

            hasFiles = true;
          }
        } catch (error) {
          console.error(
            `Erro ao processar arquivo para critério ${criterio.criterio.nome}:`,
            error.message,
          );
        }
      }
    }

    if (!hasFiles) {
      throw new NotFoundException('Nenhum arquivo encontrado para download');
    }

    return zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true });
  }

  async internalFindOneByCriancaCpf(cpf: string): Promise<EntrevistaEntity> {
    return await this.entrevistaRepository.findOne({
      relations: ['crianca'],
      where: {
        crianca: {
          cpf: cpf,
        },
      },
    });
  }

  async internalFindOneByCriancaIdAndSecretariaMunicipalId(
    criancaId: string,
    secretariaMunicipalId: string,
  ): Promise<EntrevistaEntity | null> {
    return await this.entrevistaRepository.findOne({
      relations: ['crianca', 'secretariaMunicipal', 'reservaVaga'],
      where: {
        crianca: { id: criancaId },
        secretariaMunicipal: { id: secretariaMunicipalId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
