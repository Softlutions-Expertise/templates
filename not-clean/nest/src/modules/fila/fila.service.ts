import {
  Inject,
  Injectable,
  NotFoundException,
  Optional,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { differenceInDays, format } from 'date-fns';
import { parse } from 'json2csv';
import { get, has } from 'lodash';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import PQueue from 'p-queue';
import {
  Brackets,
  DataSource,
  DeepPartial,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../config/paginate.config';
import eventBus from '../../helpers/eventEmitter.helper';
import { generateRandomInt } from '../../helpers/generate-random-int';
import { getPMap } from '../../helpers/p-map';
import { getPRetry } from '../../helpers/p-retry';
import { PromiseWithResolvers } from '../../helpers/promise-withResolvers';
import { IMaybeString } from '../../helpers/typings';
import { wait } from '../../helpers/wait';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../infrastructure/database-context/database-context.service';
import { FilaQueueService } from '../../infrastructure/queue/fila-queue.service';
import { CriteriosConfiguracaoService } from '../configuracao-criterio/criterios-configuracao.service';
import { CriteriosEntity } from '../entrevista/entities/criterios.entity';
import { EntrevistaEntity } from '../entrevista/entities/entrevista.entity';
import { EntrevistaService } from '../entrevista/services/entrevista.service';
import { ReservaVagaService } from '../reserva-vaga/reserva-vaga.service';
import { SecretariaMunicipalEntity } from '../secretaria-municipal/entities/secretaria-municipal.entity';
import { FilaGeradaPosicaoEntity } from './entities/fila-gerada-posicao.entity';
import { Fila } from './entities/fila.entity';
import {
  EntrevistaInformacoesNecessarias,
  ordenarEntrevistas,
} from './helpers/ordenacao';

const CHECK_AUTHZ = true;

const getPreferenciaTurnoFromDto = (turno: string) => {
  switch (String(turno).trim()) {
    case '1':
    case 'Matutino': {
      return 'Matutino';
    }
    case '2':
    case 'Vespertino': {
      return 'Vespertino';
    }
    case '3':
    case 'Integral': {
      return 'Integral';
    }
  }
};

export type FilaGeradaResult = EntrevistaInformacoesNecessarias[];

export type MappedLastFila = {
  fila: {
    id: string;
    createdAt: Date | string;
  };
  secretariaMunicipal: {
    id: string;
    nomeFantasia: string;
  };
  escola: {
    id: string;
    nomeFantasia: string;
  };
  etapa: {
    id: number;
    nome: string;
  };

  turno: {
    nome: string;
  };

  anoLetivo: string;

  quantidadeCriancas: number;
};

@Injectable()
export class FilaService {
  protected readonly dataSource: DataSource;
  private useQueue: boolean;

  #gerarFilaQueue = new PQueue({ concurrency: 3 });

  #createFilaActive = new Map<string, Promise<FilaGeradaResult>>();
  #createFilaPending = new Map<string, Promise<FilaGeradaResult>>();

  constructor(
    @Inject('FILA_REPOSITORY')
    private filaRepository: Repository<Fila>,
    @Inject('FILA_GERADA_REPOSITORY')
    private posicaoRepository: Repository<FilaGeradaPosicaoEntity>,
    private entrevistaService: EntrevistaService,
    private databaseContextService: DatabaseContextService,
    private criteriosConfiguracaoService: CriteriosConfiguracaoService,
    private reservaVagaService: ReservaVagaService,
    private configService: ConfigService,
    @Optional() private filaQueueService?: FilaQueueService,
  ) {
    this.useQueue = process.env.QUEUE_MODE === 'queue';
    try {
      this.entrevistaService.eventGenerateFila.on(
        'criarFila',
        async (
          entrevistaRequest:
            | Pick<EntrevistaEntity, 'id'>
            | Pick<
              EntrevistaEntity,
              | 'secretariaMunicipal'
              | 'preferenciaUnidade'
              | 'preferenciaUnidade2'
              | 'etapa'
              | 'preferenciaTurno'
              | 'preferenciaTurno2'
            >,
        ) => {
          try {
            const entrevista = has(entrevistaRequest, 'id')
              ? await this.entrevistaService.findOne(
                null,
                get(entrevistaRequest, 'id') as string,
              )
              : entrevistaRequest;

            if (
              get(entrevista, 'preferenciaUnidade') &&
              get(entrevista, 'preferenciaTurno')
            ) {
              await this.create(
                get(entrevista, 'secretariaMunicipal.id'),
                get(entrevista, 'preferenciaUnidade.id'),
                get(entrevista, 'etapa.id'),
                get(entrevista, 'preferenciaTurno'),
                get(entrevista, 'anoLetivo'),
              );
            }

            if (
              get(entrevista, 'preferenciaUnidade2') &&
              get(entrevista, 'preferenciaTurno2') &&
              (get(entrevista, 'preferenciaUnidade2') !==
                get(entrevista, 'preferenciaUnidade') ||
                get(entrevista, 'preferenciaTurno2') !==
                get(entrevista, 'preferenciaTurno'))
            ) {
              await this.create(
                get(entrevista, 'secretariaMunicipal.id'),
                get(entrevista, 'preferenciaUnidade2.id'),
                get(entrevista, 'etapa.id'),
                get(entrevista, 'preferenciaTurno2'),
                get(entrevista, 'anoLetivo'),
              );
            }
          } catch (error) {
            console.error(`Error in generate new fila: ${error}`);
            throw error;
          }
        },
      );

      eventBus.on(
        'criarFila',
        async (
          entrevistaRequest:
            | Pick<EntrevistaEntity, 'id'>
            | Pick<
              EntrevistaEntity,
              | 'secretariaMunicipal'
              | 'preferenciaUnidade'
              | 'preferenciaUnidade2'
              | 'etapa'
              | 'preferenciaTurno'
              | 'preferenciaTurno2'
            >,
        ) => {
          try {
            const entrevista = has(entrevistaRequest, 'id')
              ? await this.entrevistaService.findOne(
                null,
                get(entrevistaRequest, 'id') as string,
              )
              : entrevistaRequest;

            if (
              get(entrevista, 'preferenciaUnidade') &&
              get(entrevista, 'preferenciaTurno')
            ) {
              await this.create(
                get(entrevista, 'secretariaMunicipal.id'),
                get(entrevista, 'preferenciaUnidade.id'),
                get(entrevista, 'etapa.id'),
                get(entrevista, 'preferenciaTurno'),
                get(entrevista, 'anoLetivo'),
              );
            }

            if (
              get(entrevista, 'preferenciaUnidade2') &&
              get(entrevista, 'preferenciaTurno2') &&
              (get(entrevista, 'preferenciaUnidade2') !==
                get(entrevista, 'preferenciaUnidade') ||
                get(entrevista, 'preferenciaTurno2') !==
                get(entrevista, 'preferenciaTurno'))
            ) {
              await this.create(
                get(entrevista, 'secretariaMunicipal.id'),
                get(entrevista, 'preferenciaUnidade2.id'),
                get(entrevista, 'etapa.id'),
                get(entrevista, 'preferenciaTurno2'),
                get(entrevista, 'anoLetivo'),
              );
            }
          } catch (error) {
            console.error(`Error in generate new fila: ${error}`);
            throw error;
          }
        },
      );

      this.entrevistaService.eventGenerateOldFila.on(
        'criarFilaOld',
        async (oldEntrevista) => {
          try {
            if (
              oldEntrevista.preferenciaUnidade &&
              oldEntrevista.preferenciaTurno
            ) {
              await this.create(
                oldEntrevista.secretariaMunicipal.id,
                oldEntrevista.preferenciaUnidade.id,
                oldEntrevista.etapa.id,
                oldEntrevista.preferenciaTurno,
                oldEntrevista.anoLetivo,
              );
            }

            if (
              oldEntrevista.preferenciaUnidade2 &&
              oldEntrevista.preferenciaTurno2 &&
              (oldEntrevista.preferenciaUnidade2 !==
                oldEntrevista.preferenciaUnidade ||
                oldEntrevista.preferenciaTurno2 !==
                oldEntrevista.preferenciaTurno)
            ) {
              await this.create(
                oldEntrevista.secretariaMunicipal.id,
                oldEntrevista.preferenciaUnidade2.id,
                oldEntrevista.etapa.id,
                oldEntrevista.preferenciaTurno2,
                oldEntrevista.anoLetivo,
              );
            }
          } catch (error) {
            console.error(`Error in criarFilaOld: ${error}`);
            throw error;
          }
        },
      );

      eventBus.on('criarFila', async (entrevista) => {
        try {
          if (entrevista.preferenciaUnidade && entrevista.preferenciaTurno) {
            await this.create(
              entrevista.secretariaMunicipal.id,
              entrevista.preferenciaUnidade.id,
              entrevista.etapa.id,
              entrevista.preferenciaTurno,
              entrevista.anoLetivo,
            );
          }

          if (
            entrevista.preferenciaUnidade2 &&
            entrevista.preferenciaTurno2 &&
            (entrevista.preferenciaUnidade2 !== entrevista.preferenciaUnidade ||
              entrevista.preferenciaTurno2 !== entrevista.preferenciaTurno)
          ) {
            await this.create(
              entrevista.secretariaMunicipal.id,
              entrevista.preferenciaUnidade2.id,
              entrevista.etapa.id,
              entrevista.preferenciaTurno2,
              entrevista.anoLetivo,
            );
          }
        } catch (error) {
          console.error(`Error in criarFila: ${error}`);
          throw error;
        }
      });
    } catch (error) {
      console.error(`Error in eventGenerateFila: ${error}`);
      throw error;
    }
  }

  get registrarContatoRepository() {
    return this.databaseContextService.registrarContatoRepository;
  }

  get entrevistaRepository() {
    return this.databaseContextService.entrevistaRepository;
  }

  async prepareLastFilasQueryBuilder(
    secretariasIds?: IMaybeString[],
    escolasIds?: IMaybeString[],
    anoLetivoCompare?:
      | { year: string | number; compare?: '=' | '>=' }
      | null
      | undefined,
  ) {
    const qb: SelectQueryBuilder<FilaGeradaPosicaoEntity> =
      this.databaseContextService.dataSource.createQueryBuilder();

    qb.from(FilaGeradaPosicaoEntity, 'fila_gerada_posicao');
    qb.select([]);

    qb.innerJoin('fila_gerada_posicao.filaGerada', 'fila');
    qb.innerJoin('fila_gerada_posicao.entrevista', 'entrevista');

    qb.addSelect('fila.id', 'fila_id');
    qb.addSelect('fila.createdAt', 'fila_createdAt');
    qb.addSelect('fila.anoLetivo', 'fila_ano_letivo');

    qb.innerJoin('fila.etapa', 'fila_etapa');
    qb.addSelect('fila_etapa.id', 'fila_etapa_id');
    qb.addSelect('fila_etapa.nome', 'fila_etapa_nome');

    // =======================================================================
    qb.innerJoin('fila.escola', 'escola');
    qb.addSelect('escola.id', 'escola_id');
    qb.addSelect('escola.nome_fantasia', 'escola_nome_fantasia');

    // =======================================================================
    qb.innerJoin('entrevista.secretariaMunicipal', 'secretaria_municipal');
    qb.addSelect('secretaria_municipal.id', 'secretaria_municipal_id');
    qb.addSelect(
      'secretaria_municipal.nomeFantasia',
      'secretaria_municipal_nomeFantasia',
    );

    // =======================================================================
    if (secretariasIds && secretariasIds.length > 0) {
      qb.andWhere('secretaria_municipal.id IN (:...secretariasIds)', {
        secretariasIds,
      });
    }

    if (escolasIds && escolasIds.length > 0) {
      qb.andWhere('escola.id IN (:...escolasIds)', { escolasIds });
    }

    if (anoLetivoCompare) {
      switch (anoLetivoCompare.compare) {
        case '>=': {
          qb.andWhere('fila.anoLetivo >= :anoLetivo', {
            anoLetivo: anoLetivoCompare.year,
          });
          break;
        }

        case '=':
        default: {
          qb.andWhere('fila.anoLetivo = :anoLetivo', {
            anoLetivo: anoLetivoCompare.year,
          });

          break;
        }
      }
    }
    // =======================================================================

    qb.addSelect('fila.turno', 'fila_turno');
    qb.addSelect('count(*)', 'quantidade_criancas');

    qb.groupBy('fila.id');
    qb.addGroupBy('secretaria_municipal.id');
    qb.addGroupBy('escola.id');
    qb.addGroupBy('fila_etapa.id');
    qb.addGroupBy('fila_turno');
    qb.addGroupBy('fila_ano_letivo');

    qb.orderBy();
    qb.addOrderBy('fila.anoLetivo', 'DESC');
    qb.addOrderBy('secretaria_municipal.nomeFantasia', 'ASC');
    qb.addOrderBy('escola.nome_fantasia', 'ASC');
    qb.addOrderBy('fila_etapa.nome', 'ASC');
    qb.addOrderBy('fila.turno', 'ASC');

    qb.andWhere(
      new Brackets((subQb) => {
        subQb.where(
          `
            fila.id 
            IN (
              SELECT 
                fila2.id
              FROM fila fila2
              WHERE 
                fila2.escola_id = fila.escola_id
                AND fila2.turno = fila.turno
                AND fila2.etapa_id = fila.etapa_id
                AND fila2.ano_letivo = fila.ano_letivo
              ORDER BY fila2.created_at DESC
              LIMIT 1 
            )
          `,
        );
      }),
    );

    return qb;
  }

  mapLastFilaFromQueryBuilder(row: any): MappedLastFila {
    return {
      fila: {
        id: row.fila_id,
        createdAt: row.fila_createdAt,
      },
      secretariaMunicipal: {
        id: row.secretaria_municipal_id,
        nomeFantasia: row.secretaria_municipal_nomeFantasia,
      },
      escola: {
        id: row.escola_id,
        nomeFantasia: row.escola_nome_fantasia,
      },
      etapa: {
        id: row.fila_etapa_id,
        nome: row.fila_etapa_nome,
      },
      turno: {
        nome: row.fila_turno,
      },
      anoLetivo: row.fila_ano_letivo,
      quantidadeCriancas: Number.parseInt(row.quantidade_criancas),
    };
  }

  mapLastFilasFromQueryBuilder(rows: any[]) {
    return rows.map(this.mapLastFilaFromQueryBuilder);
  }

  async getMappedLastFilasByQueryBuilder(qb: SelectQueryBuilder<any>) {
    const results = await qb.getRawMany();

    const mappedResults = this.mapLastFilasFromQueryBuilder(results);

    return mappedResults;
  }

  async getLastFilas(
    secretariaId?: IMaybeString,
    escolaId?: IMaybeString,
    anoLetivoYear?: IMaybeString,
  ) {
    const qb = await this.prepareLastFilasQueryBuilder(
      [secretariaId],
      [escolaId],
      anoLetivoYear && { year: anoLetivoYear, compare: '=' },
    );
    return this.getMappedLastFilasByQueryBuilder(qb);
  }

  async *getEntrevistasFilas(
    secretariaId?: IMaybeString,
    escolaId?: IMaybeString,
    anoLetivo?: IMaybeString,
  ) {
    const { entrevistaRepository } = this.databaseContextService;

    const qb = entrevistaRepository.createQueryBuilder('entrevista');

    qb.select([]);

    qb.innerJoin('entrevista.secretariaMunicipal', 'secretaria_municipal');
    qb.addSelect('secretaria_municipal.id', 'secretaria_municipal_id');

    qb.addSelect('entrevista.anoLetivo', 'ano_letivo');

    qb.innerJoin('entrevista.etapa', 'etapa');
    qb.addSelect('etapa.id', 'etapa_id');
    qb.addSelect('etapa.nome', 'etapa_nome');

    qb.leftJoin('entrevista.preferenciaUnidade', 'preferencia_unidade1');
    qb.addSelect('preferencia_unidade1.id', 'preferencia_unidade_1_id');
    qb.addSelect('entrevista.preferenciaTurno', 'preferencia_turno_1');

    qb.leftJoin('entrevista.preferenciaUnidade2', 'preferencia_unidade2');
    qb.addSelect('preferencia_unidade2.id', 'preferencia_unidade_2_id');
    qb.addSelect('entrevista.preferenciaTurno2', 'preferencia_turno_2');

    qb.groupBy('secretaria_municipal.id');
    qb.addGroupBy('etapa.id');
    qb.addGroupBy('preferencia_unidade1.id');
    qb.addGroupBy('entrevista.preferenciaTurno');
    qb.addGroupBy('preferencia_unidade2.id');
    qb.addGroupBy('entrevista.preferenciaTurno2');
    qb.addGroupBy('entrevista.anoLetivo');

    if (secretariaId) {
      qb.andWhere('secretaria_municipal.id = :secretariaId', {
        secretariaId,
      });
    }

    if (escolaId) {
      qb.andWhere(
        'preferencia_unidade1.id = :escolaId OR preferencia_unidade2.id = :escolaId',
        {
          escolaId,
        },
      );
    }

    if (anoLetivo) {
      qb.andWhere('entrevista.anoLetivo = :anoLetivo', {
        anoLetivo,
      });
    }

    const registros = await qb.getRawMany();

    for (const registro of registros) {
      if (!registro.secretaria_municipal_id || !registro.etapa_id) {
        continue;
      }

      if (
        registro.preferencia_unidade_1_id &&
        registro.preferencia_turno_1 &&
        (!escolaId || registro.preferencia_unidade_1_id === escolaId)
      ) {
        yield {
          idSecretaria: registro.secretaria_municipal_id,
          idEscola: registro.preferencia_unidade_1_id,
          idEtapa: registro.etapa_id,
          turno: registro.preferencia_turno_1,
          anoLetivo: registro.ano_letivo,
        };
      }

      if (
        registro.preferencia_unidade_2_id &&
        registro.preferencia_turno_2 &&
        (!escolaId || registro.preferencia_unidade_2_id === escolaId)
      ) {
        yield {
          idSecretaria: registro.secretaria_municipal_id,
          idEscola: registro.preferencia_unidade_2_id,
          idEtapa: registro.etapa_id,
          turno: registro.preferencia_turno_2,
          anoLetivo: registro.ano_letivo,
        };
      }
    }
  }

  private async gerarFilaCore(
    idSecretaria: string,
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
  ) {
    const key = FilaService.getFilaKey(
      idSecretaria,
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
    );
    console.debug(`gerarFilaCore: ${key}`);

    const entrevistas = await this.getEntrevistasByFilter(
      idSecretaria,
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
    );

    console.debug(
      `gerarFilaCore: ${key} | entrevistas populadas: ${entrevistas.length}`,
    );

    const fila = await this.gerarFilaByEntrevistas(idSecretaria, entrevistas);

    return fila;
  }

  static getFilaKey(
    idSecretaria: string,
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
  ) {
    return `(secretaria=${idSecretaria} - escola=${idEscola} - etapa=${idEtapa} - turno=${turno} - anoLetivo=${anoLetivo})`;
  }

  /** job para a criação da fila */
  private async gerarFila(
    idSecretaria: string,
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
  ) {
    const key = FilaService.getFilaKey(
      idSecretaria,
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
    );

    const pRetry = await getPRetry();

    const scheduleJob = async () => {
      console.log(`gerarFila: ${key} - job agendado`);

      return this.#gerarFilaQueue.add(() => {
        return this.gerarFilaCore(
          idSecretaria,
          idEscola,
          idEtapa,
          turno,
          anoLetivo,
        );
      });
    };

    return pRetry(scheduleJob, {
      retries: 3,
      onFailedAttempt(error) {
        console.error(error);
        console.error(`gerarFila: ${key} - erro na geração da fila`);
      },
    });
  }

  private async *retrieveAllFilas(
    secretariaId?: IMaybeString,
    escolaId?: IMaybeString,
    anoLetivo?: IMaybeString,
  ): AsyncIterable<{
    idSecretaria: string;
    idEscola: string;
    idEtapa: number;
    turno: string;
    anoLetivo: string;
  }> {
    const filas = await this.getLastFilas(secretariaId, escolaId, anoLetivo);

    for (const fila of filas) {
      yield {
        idSecretaria: fila.secretariaMunicipal.id,
        idEscola: fila.escola.id,
        idEtapa: fila.etapa.id,
        turno: fila.turno.nome,
        anoLetivo: fila.anoLetivo,
      };
    }

    for await (const entrevistaFila of this.getEntrevistasFilas(
      secretariaId,
      escolaId,
      anoLetivo,
    )) {
      yield {
        ...entrevistaFila,
      };
    }
  }

  private async *retrieveAllFilasUnique(
    secretariaId?: IMaybeString,
    escolaId?: IMaybeString,
    anoLetivo?: IMaybeString,
  ) {
    const accessed = new Set();

    for await (const fila of this.retrieveAllFilas(
      secretariaId,
      escolaId,
      anoLetivo,
    )) {
      const key = FilaService.getFilaKey(
        fila.idSecretaria,
        fila.idEscola,
        fila.idEtapa,
        fila.turno,
        fila.anoLetivo,
      );

      if (!accessed.has(key)) {
        accessed.add(key);
        yield fila;
      }
    }
  }

  private async regerarFilasCore(
    secretariaId?: IMaybeString,
    escolaId?: IMaybeString,
    anoLetivo?: IMaybeString,
  ) {
    let count = 0;

    for await (const fila of this.retrieveAllFilasUnique(
      secretariaId,
      escolaId,
      anoLetivo,
    )) {
      this.create(
        fila.idSecretaria,
        fila.idEscola,
        fila.idEtapa,
        fila.turno,
        fila.anoLetivo,
      );
      count++;
    }

    return {
      status: 'queued',
      total: count,
    };
  }

  async regerarFilas(
    acessoControl: AcessoControl | null,
    secretariaId?: IMaybeString,
    escolaId?: IMaybeString,
    anoLetivo?: IMaybeString,
  ) {
    let targetSecretariaId = secretariaId;
    let targetEscolaId = escolaId;
    let targetAnoLetivo = anoLetivo;

    // if (acessoControl) {
    //   const resolvedProfile = await AcessoControl.resolveProfile(
    //     acessoControl,
    //     secretariaId,
    //     escolaId,
    //   );

    //   targetSecretariaId = resolvedProfile.targetSecretariaId;
    //   targetEscolaId = resolvedProfile.targetEscolaId;
    // }

    return this.regerarFilasCore(
      targetSecretariaId,
      targetEscolaId,
      targetAnoLetivo,
    );
  }

  async getEntrevistasByFilter(
    idSecretaria: string,
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
  ) {
    const params = {
      idSecretaria,
      idEscola,
      idEtapa,
      preferenciaTurno: getPreferenciaTurnoFromDto(turno),
      anoLetivo,
    };
    const qb = this.entrevistaRepository.createQueryBuilder('entrevista');

    EntrevistaService.EntrevistaQueryView(qb, {
      filterMaisRecente: true,
      filterMatchCriterioSomenteAtivo: true,
      orderByDataEntrevistaFirst: true,
    });

    qb.andWhere('entrevista_secretariaMunicipal.id = :idSecretaria', {
      idSecretaria: params.idSecretaria,
    });

    qb.andWhere(
      `
      (
        (
          entrevista_preferenciaUnidade1.id = :idEscola
          AND
          entrevista.preferenciaTurno = :preferenciaTurno
          AND
          entrevista.elegivelParaFila = TRUE
        )
        OR 
        (
          entrevista_preferenciaUnidade2.id = :idEscola
          AND
          entrevista.preferenciaTurno2 = :preferenciaTurno
          AND
          entrevista.elegivelParaFila2 = TRUE
        )
      )
    `,
      {
        idEscola: params.idEscola,
        preferenciaTurno: params.preferenciaTurno,
      },
    );

    qb.andWhere('entrevista_reservaVaga.id IS NULL');

    qb.andWhere('entrevista.etapa_id = :idEtapa', {
      idEtapa: params.idEtapa,
    });

    qb.andWhere('entrevista.anoLetivo = :anoLetivo', {
      anoLetivo: params.anoLetivo,
    });

    qb.leftJoin('entrevista_matchCriterio.criterio', 'criterio');

    qb.addSelect(['criterio.id', 'criterio.nome']);

    const entrevistas = await qb.getMany();

    const entrevistasMatchCriteriosComDefinicoes =
      await this.entrevistaService.attachEntrevistasMatchCriteriosComDefinicoes(
        entrevistas,
      );

    return entrevistasMatchCriteriosComDefinicoes;
  }

  private async getConfiguracaoAtualSecretaria(idSecretaria: string) {
    return this.criteriosConfiguracaoService.internalConsultaDefinicoesAtual(
      idSecretaria,
    );
  }

  async gerarFilaByEntrevistas(
    idSecretaria: SecretariaMunicipalEntity['id'],
    targetEntrevistas:
      | AsyncIterable<Pick<EntrevistaEntity, 'id'>>
      | Iterable<Pick<EntrevistaEntity, 'id'>>,
  ) {
    const configuracaoAtualSecretaria =
      await this.getConfiguracaoAtualSecretaria(idSecretaria);

    const getConfiguracaoCriterio = (criterioId: CriteriosEntity['id']) => {
      const definicao = configuracaoAtualSecretaria.definicoes.find(
        (i) => i.criterio.id === criterioId,
      );

      return definicao ?? null;
    };

    const entrevistasComInformacoesNecessarias: EntrevistaInformacoesNecessarias[] =
      [];

    for await (const targetEntrevista of targetEntrevistas) {
      const entrevista = await this.entrevistaRepository
        .createQueryBuilder('entrevista')
        .leftJoin(
          'entrevista.matchCriterios',
          'matchCriterio',
          '(matchCriterio.id is null) OR (matchCriterio.ativo = TRUE AND matchCriterio.versaoMaisRecente = true)',
        )
        .leftJoin('matchCriterio.criterio', 'criterio')
        .select([
          'entrevista.id',
          'entrevista.dataEntrevista',
          'entrevista.horarioEntrevista',
          'matchCriterio.id',
          'criterio.id',
        ])
        .where('entrevista.id IS NOT NULL')
        .andWhere('entrevista.id = :entrevistaId', {
          entrevistaId: targetEntrevista.id,
        })
        .getOne();

      if (!entrevista) {
        continue;
      }

      entrevistasComInformacoesNecessarias.push({
        idEntrevista: entrevista.id,
        dataEntrevista: entrevista.dataEntrevista,
        horarioEntrevista: entrevista.horarioEntrevista,
        colocacao: null,
        criteriosAtivos: entrevista.matchCriterios
          .map((matchCriterio) => {
            const configuracaoCriterio = getConfiguracaoCriterio(
              matchCriterio.criterio.id,
            );

            if (!configuracaoCriterio) {
              return null;
            }

            return {
              idCriterio: matchCriterio.criterio.id,
              notaTecnica: configuracaoCriterio.notaTecnica,
              posicao: configuracaoCriterio.posicao,
              subPosicao: configuracaoCriterio.subPosicao,
              exigirComprovacao: configuracaoCriterio.exigirComprovacao,
            };
          })
          .filter((i) => i !== null),
      });
    }

    const entrevistasOrdenadasPorCriterios = ordenarEntrevistas(
      entrevistasComInformacoesNecessarias,
    );

    for (const idx in entrevistasOrdenadasPorCriterios) {
      const index = +idx;

      const entrevista = entrevistasOrdenadasPorCriterios[index];

      entrevista.colocacao = index + 1;
    }

    return entrevistasOrdenadasPorCriterios;
  }

  async createCore(
    idSecretaria: string,
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
  ) {
    const requiredFields = {
      idSecretaria,
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
    };

    const fieldMessages = {
      idSecretaria: 'Secretaria não informada',
      idEscola: 'Escola não informada',
      idEtapa: 'Série não informada',
      turno: 'Turno não informado',
      anoLetivo: 'Ano letivo não informado',
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        console.error(fieldMessages[field]); // Output the appropriate error message
        return;
      }
    }

    const escola = await this.databaseContextService.escolaRepository.findOne({
      where: { id: idEscola },
    });

    if (!escola) {
      throw new Error('Escola não encontrada');
    }

    const etapa = await this.databaseContextService.etapaRepository.findOne({
      where: { id: idEtapa },
    });

    if (!etapa) {
      throw new Error('Etapa não encontrada');
    }

    const fila = await this.filaRepository.save({
      id: uuidv4(),
      turno: turno,
      etapa: etapa,
      escola: escola,
      anoLetivo: anoLetivo,
    });

    const entrevistasClassificadas = await this.gerarFila(
      idSecretaria,
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
    );

    const pmap = await getPMap();

    await pmap(
      entrevistasClassificadas,
      async (entrevista) => {
        await this.posicaoRepository.save({
          id: uuidv4(),
          filaGerada: fila.id,
          entrevista: entrevista.idEntrevista,
          posicaoGeral: entrevista.colocacao,
        } as DeepPartial<FilaGeradaPosicaoEntity>);
      },
      { concurrency: 3 },
    );

    return entrevistasClassificadas;
  }

  async create(
    idSecretaria: string,
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
  ) {
    const key = FilaService.getFilaKey(
      idSecretaria,
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
    );

    console.log(`FilaService#create: Generated key: ${key} - Mode: ${this.useQueue ? 'queue' : 'sync'}`);

    if (this.useQueue && this.filaQueueService) {
      try {
        await this.filaQueueService.addFilaGenerationJob({
          idSecretaria,
          idEscola,
          idEtapa,
          turno,
          anoLetivo,
        });

        console.log(`FilaService#create: ${key} - Job queued successfully`);
        return { status: 'queued', key };
      } catch (error) {
        console.error(`FilaService#create: ${key} - Queue error, falling back to sync:`, error);
      }
    }

    return this.createSync(idSecretaria, idEscola, idEtapa, turno, anoLetivo);
  }

  async createSync(
    idSecretaria: string,
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
  ) {
    const key = FilaService.getFilaKey(
      idSecretaria,
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
    );

    console.log(`FilaService#createSync: Starting with key: ${key}`);

    const esperaAleatoria = generateRandomInt(300, 3000);
    await wait(esperaAleatoria);

    if (this.#createFilaPending.has(key)) {
      console.log(
        `FilaService#createSync: ${key} - já existe um job não iniciado para a mesma fila, retornando ele`,
      );

      return this.#createFilaPending.get(key);
    }

    console.log(
      `FilaService#createSync: ${key} - não existe um job não iniciado para a mesma fila, criando um novo`,
    );

    const { promise, resolve, reject } =
      PromiseWithResolvers<FilaGeradaResult>();

    this.#createFilaPending.set(key, promise);

    const initializeCreation = async () => {
      if (this.#createFilaActive.has(key)) {
        console.log(
          `FilaService#createSync: ${key} - aguardando job ativo para esta fila`,
        );

        const createFileActivePromise = this.#createFilaActive.get(key);
        await createFileActivePromise.finally(() => { });
      } else {
        console.log(
          `FilaService#createSync: ${key} - não há job ativo para esta fila`,
        );
      }

      console.log(
        `FilaService#createSync: ${key} - promovendo job de não iniciado para ativo`,
      );
      this.#createFilaPending.delete(key);
      this.#createFilaActive.set(key, promise);

      return this.createCore(idSecretaria, idEscola, idEtapa, turno, anoLetivo);
    };

    initializeCreation()
      .then((result) => {
        console.log(`FilaService#createSync: ${key} - Job completed successfully`);
        resolve(result);
      })
      .catch((error) => {
        console.error(`FilaService#createSync: ${key} - Job failed:`, error);
        reject(error);
      })
      .finally(() => {
        console.log(`FilaService#createSync: ${key} - Cleaning up active job`);
        this.#createFilaActive.delete(key);
      });

    return promise;
  }

  async getFilaPosicao(
    acessoControl: AcessoControl | null,
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
    query?: PaginateQuery,
  ) {
    const qbLastFila = this.filaRepository.createQueryBuilder('fila');

    qbLastFila.where('FALSE');

    if (CHECK_AUTHZ && acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'fila:read',
        qbLastFila,
      );
    }

    qbLastFila.orderBy('fila.created_at', 'DESC');
    qbLastFila.innerJoin('fila.escola', 'escola');

    qbLastFila.andWhere('escola.id = :idEscola', { idEscola });

    if (idEtapa) {
      qbLastFila.andWhere('fila.etapa_id = :idEtapa', {
        idEtapa: idEtapa,
      });
    }

    if (turno) {
      qbLastFila.andWhere('fila.turno = :turno', {
        turno: getPreferenciaTurnoFromDto(turno),
      });
    }
    if (anoLetivo) {
      qbLastFila.andWhere('fila.anoLetivo = :anoLetivo', { anoLetivo });
    }

    const lastFila = await qbLastFila.getOne();

    if (!lastFila) {
      return {
        data: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 0,
          totalPages: 0,
          currentPage: 0,
        },
      };
    }

    const qbFiltroFilaPosicao = this.posicaoRepository
      .createQueryBuilder('fila_gerada_posicao')
      .leftJoinAndSelect('fila_gerada_posicao.filaGerada', 'fila')
      .leftJoinAndSelect('fila_gerada_posicao.entrevista', 'entrevista')
      .leftJoinAndSelect('entrevista.etapa', 'etapa')
      .leftJoinAndSelect('entrevista.crianca', 'crianca')
      .leftJoinAndSelect('entrevista.preferenciaUnidade', 'preferenciaUnidade')
      .leftJoinAndSelect('entrevista.preferenciaUnidade2', 'preferenciaUnidade2')
      .leftJoinAndSelect('entrevista.registroContatos', 'registroContatos')
      .leftJoinAndSelect('registroContatos.servidor', 'servidor')
      .leftJoinAndSelect('servidor.pessoa', 'pessoa')
      .leftJoinAndSelect('entrevista.secretariaMunicipal', 'secretariaMunicipal')
      .where('fila.id = :id', { id: lastFila.id });

    const paginated = await paginate(query, qbFiltroFilaPosicao, {
      ...paginateConfig,
      defaultSortBy: [['posicaoGeral', 'ASC']],
      searchableColumns: [
        'crianca.nome',
        'crianca.cpf',
        'crianca.dataNascimento',
        'entrevista.nomeResponsavel',
        'entrevista.tipoResponsavel',
        'entrevista.preferenciaTurno',
        'entrevista.preferenciaTurno2',
        'preferenciaUnidade.razaoSocial',
        'preferenciaUnidade2.razaoSocial',
        'entrevista.dataEntrevista',
      ],
    });

    // Busca os apelidos das etapas se houver dados
    if (paginated.data.length > 0) {
      await this.addApelidosToFilaPosicao(paginated.data);
    }

    const pmap = await getPMap();

    const mappedResults: FilaItemColumns[] = await pmap(
      paginated.data,

      async (result) => {
        const entrevistaQb =
          this.entrevistaRepository.createQueryBuilder('entrevista');

        EntrevistaService.EntrevistaQueryView(entrevistaQb, {
          filterMaisRecente: true,
          filterMatchCriterioSomenteAtivo: true,
          orderByDataEntrevistaFirst: true,
        });

        entrevistaQb.andWhere('entrevista.id = :entrevistaId', {
          entrevistaId: result.entrevista.id,
        });

        const entrevista =
          await this.entrevistaService.attachEntrevistaMatchCriteriosComDefinicoes(
            await entrevistaQb.getOne(),
          );

        const diasNaFila = differenceInDays(
          new Date(),
          result.entrevista.dataEntrevista,
        );

        return {
          id: result.id,
          idEntrevista: result.entrevista.id,
          colocacao: result.posicaoGeral,
          nomeCrianca: result.entrevista.crianca.nome,
          idCrianca: result.entrevista.crianca.id,
          cpfCrianca: result.entrevista.crianca.cpf,
          dataNascimentoCrianca: result.entrevista.crianca.dataNascimento,
          status: result.entrevista.status,
          nomeResponsavel: result.entrevista.nomeResponsavel,
          parentescoResponsavel: result.entrevista.parentescoResponsavel,
          tipoResponsavel: result.entrevista.tipoResponsavel,
          etapa: result.entrevista?.etapa?.nome ?? '',
          apelido: (result.entrevista?.etapa as any)?.apelido || null, // Adiciona o apelido da etapa
          preferenciaTurno: result.entrevista?.preferenciaTurno ?? '',
          preferenciaTurno2: result.entrevista?.preferenciaTurno2 ?? '',
          razaoSocialPreferenciaUnidade:
            result.entrevista?.preferenciaUnidade?.razaoSocial ?? '',
          razaoSocialPreferenciaUnidade2:
            result.entrevista.preferenciaUnidade2?.razaoSocial,
          registrosContato: result.entrevista.registroContatos
            .sort(
              (a, b) =>
                new Date(b.dataContato).getTime() -
                new Date(a.dataContato).getTime(),
            )
            .map((registro) => (
              // console.log(registro),
              {
                id: registro.id,
                dataContato: registro.dataContato,
                tipoContato: registro.tipoContato,
                nomeContato: registro.nomeContato,
                ligacaoAceita: registro.ligacaoAceita,
                comprovante: registro.comprovante,
                observacao: registro.observacao,
                crianca: registro.crianca,
                entrevista: registro.entrevista,
                servidor: registro?.servidor?.pessoa?.nome,
              })),
          matchCriterios: entrevista.matchCriterios,
          dataEntrevista: result.entrevista.dataEntrevista,
          horarioEntrevista: result.entrevista.horarioEntrevista,
          diasPermanenciaFila: diasNaFila,
        };
      },
      { concurrency: 2 },
    );

    paginated.data = mappedResults as any;

    return paginated;
  }
  // No FilaService
  async getApelidosEtapas(secretariaIds: string[], etapaIds: number[]): Promise<Map<string, string>> {
    if (!secretariaIds.length || !etapaIds.length) {
      return new Map();
    }

    try {
      const apelidosQuery = await this.filaRepository
        .createQueryBuilder('fila')
        .select('sme.etapa_id', 'etapaId')
        .addSelect('sme.secretaria_municipal_id', 'secretariaId')
        .addSelect('sme.apelido', 'apelido')
        .from('secretaria_municipal_etapa', 'sme')
        .where('sme.secretaria_municipal_id IN (:...secretariaIds)', { secretariaIds })
        .andWhere('sme.etapa_id IN (:...etapaIds)', { etapaIds })
        .getRawMany();

      const apelidosMap = new Map<string, string>();
      apelidosQuery.forEach(row => {
        apelidosMap.set(`${row.secretariaId}-${row.etapaId}`, row.apelido);
      });

      return apelidosMap;
    } catch (error) {
      console.error('Erro ao buscar apelidos das etapas:', error);
      return new Map();
    }
  }

  async getFilaPosicaoAnonimizada(
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
    query?: PaginateQuery,
  ) {
    const qbLastFila = this.filaRepository.createQueryBuilder('fila');

    qbLastFila.orderBy('fila.created_at', 'DESC');
    qbLastFila.innerJoin('fila.escola', 'escola');

    qbLastFila.andWhere('escola.id = :idEscola', { idEscola });

    if (idEtapa) {
      qbLastFila.andWhere('fila.etapa_id = :idEtapa', {
        idEtapa: idEtapa,
      });
    }

    if (turno) {
      qbLastFila.andWhere('fila.turno = :turno', {
        turno: getPreferenciaTurnoFromDto(turno),
      });
    }

    if (anoLetivo) {
      qbLastFila.andWhere('fila.anoLetivo = :anoLetivo', { anoLetivo });
    }

    const lastFila = await qbLastFila.getOne();

    if (!lastFila) {
      return {
        data: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 0,
          totalPages: 0,
          currentPage: 0,
        },
      };
    }

    const qbFiltroFilaPosicao = this.posicaoRepository
      .createQueryBuilder('fila_gerada_posicao')
      .leftJoinAndSelect('fila_gerada_posicao.filaGerada', 'fila')
      .where('fila.id = :id', { id: lastFila.id });

    const paginated = await paginate(query, qbFiltroFilaPosicao, {
      ...paginateConfig,
      defaultSortBy: [['posicaoGeral', 'ASC']],
      relations: [
        'entrevista',
        'entrevista.etapa',
        'entrevista.crianca',
        'entrevista.preferenciaUnidade',
        'entrevista.preferenciaUnidade2',
        'entrevista.registroContatos',
        'entrevista.secretariaMunicipal',
      ],
      searchableColumns: [
        'entrevista.crianca.nome',
        'entrevista.crianca.cpf',
        'entrevista.crianca.dataNascimento',
        'entrevista.nomeResponsavel',
        'entrevista.tipoResponsavel',
        'entrevista.etapa.nome',
        'entrevista.preferenciaTurno',
        'entrevista.preferenciaTurno2',
        'entrevista.preferenciaUnidade.razaoSocial',
        'entrevista.preferenciaUnidade2.razaoSocial',
        'entrevista.dataEntrevista',
      ],
    });

    if (paginated.data.length > 0) {
      await this.addApelidosToFilaPosicao(paginated.data);
    }

    const pmap = await getPMap();

    const mappedResults: FilaItemColumnsAnonimizada[] = await pmap(
      paginated.data,
      async (result) => {
        const entrevistaQb =
          this.entrevistaRepository.createQueryBuilder('entrevista');

        EntrevistaService.EntrevistaQueryView(entrevistaQb, {
          filterMaisRecente: true,
          filterMatchCriterioSomenteAtivo: true,
          orderByDataEntrevistaFirst: true,
          selectMatchCriterioArquivo: false,
        });

        entrevistaQb.andWhere('entrevista.id = :entrevistaId', {
          entrevistaId: result.entrevista.id,
        });

        const entrevista =
          await this.entrevistaService.attachEntrevistaMatchCriteriosComDefinicoes(
            await entrevistaQb.getOne(),
          );

        return {
          id: result.id,
          idEntrevista: result.entrevista.id,
          colocacao: result.posicaoGeral,
          nomeCrianca: this.anonymizeName(result.entrevista.crianca.nome),
          dataNascimentoCrianca: result.entrevista.crianca.dataNascimento,
          status: result.entrevista.status,
          etapa: result.entrevista?.etapa?.nome ?? '',
          apelido: (result.entrevista?.etapa as any)?.apelido || null, // Adiciona o apelido da etapa
          preferenciaTurno: result.entrevista?.preferenciaTurno ?? '',
          preferenciaTurno2: result.entrevista?.preferenciaTurno2 ?? '',
          razaoSocialPreferenciaUnidade:
            result.entrevista?.preferenciaUnidade?.razaoSocial ?? '',
          razaoSocialPreferenciaUnidade2:
            result.entrevista.preferenciaUnidade2?.razaoSocial,
          matchCriterios: entrevista.matchCriterios,
          dataEntrevista: result.entrevista.dataEntrevista,
          horarioEntrevista: result.entrevista.horarioEntrevista,
          diasPermanenciaFila: differenceInDays(
            new Date(),
            result.entrevista.dataEntrevista,
          ),
        };
      },
      { concurrency: 2 },
    );

    paginated.data = mappedResults as any;

    if (paginated.data[0] === null) {
      paginated.data = [];
    }

    return paginated;
  }

  async getFilaPosicaoByCPF(
    cidade: number,
    cpf: string,
    dataNascimento: string,
    query?: any,
  ) {
    const posicaoResults = await this.posicaoRepository
      .createQueryBuilder('fila_gerada_posicao')
      .innerJoinAndSelect('fila_gerada_posicao.entrevista', 'entrevista')
      .innerJoinAndSelect('entrevista.crianca', 'crianca')
      .innerJoinAndSelect('crianca.responsavel', 'responsavel')
      .innerJoinAndSelect('fila_gerada_posicao.filaGerada', 'fila')
      .innerJoinAndSelect('fila.escola', 'escola')
      .innerJoinAndSelect('fila.etapa', 'etapa')
      .innerJoinAndSelect(
        'entrevista.secretariaMunicipal',
        'secretariaMunicipal',
      )
      .innerJoinAndSelect('secretariaMunicipal.endereco', 'endereco')
      .innerJoinAndSelect('endereco.cidade', 'cidade')
      .leftJoin(
        'secretaria_municipal_etapa',
        'secretaria_municipal_etapa',
        'etapa.id = secretaria_municipal_etapa.etapa_id AND secretaria_municipal_etapa.secretaria_municipal_id = secretariaMunicipal.id',
      )
      .addSelect('secretaria_municipal_etapa.apelido')
      .where('crianca.cpf = :cpf', { cpf })
      .andWhere('DATE(crianca.dataNascimento) = DATE(:dataNascimento)', {
        dataNascimento,
      })
      .andWhere(
        `fila.id IN (
          SELECT f.id 
          FROM fila f
          WHERE f.escola_id = fila.escola_id
            AND f.etapa_id = fila.etapa_id 
            AND f.turno = fila.turno
            AND f.ano_letivo = fila.ano_letivo
          ORDER BY f.created_at DESC
          LIMIT 1
        )`,
      )
      .select([
        'fila_gerada_posicao.id',
        'fila_gerada_posicao.posicaoGeral',
        'fila.id',
        'fila.turno',
        'escola.id',
        'escola.nomeFantasia',
        'etapa.id',
        'etapa.nome',
        'entrevista.id',
        'entrevista.anoLetivo',
        'entrevista.dataEntrevista',
        'entrevista.horarioEntrevista',
        'crianca.id',
        'crianca.nome',
        'responsavel.id',
        'responsavel.nomeRes',
        'secretariaMunicipal.id',
        'secretariaMunicipal.nomeFantasia',
        'secretaria_municipal_etapa.id',
        'secretaria_municipal_etapa.apelido',
        'endereco.id',
        'cidade.id',
        'cidade.nome',
      ])
      .getRawAndEntities();

    const rawResults = posicaoResults.raw;
    const posicoes = posicaoResults.entities;

    rawResults.forEach((raw, index) => {
      if (posicoes[index] && raw.secretaria_municipal_etapa_apelido) {
        (posicoes[index].filaGerada.etapa as any).apelido =
          raw.secretaria_municipal_etapa_apelido;
      }
    });

    let opcoesNomes: string[] = [];

    if (posicoes.length > 0) {
      const primeiroNome = posicoes[0].entrevista?.crianca.responsavel.nomeRes
        .split(' ')[0]
        .toUpperCase();
      opcoesNomes.push(primeiroNome);

      const nomesAleatorios = await this.obterNomesAleatorios(4, [
        primeiroNome,
      ]);
      opcoesNomes.push(...nomesAleatorios.map((nome) => nome.toUpperCase()));
    } else {
      opcoesNomes = (await this.obterNomesAleatorios(5, [])).map((nome) =>
        nome.toUpperCase(),
      );
    }

    if (
      query?.nomeResponsavel &&
      posicoes.length > 0 &&
      query?.nomeResponsavel.toUpperCase() ==
      posicoes[0]?.entrevista?.crianca?.responsavel?.nomeRes
        .split(' ')[0]
        .toUpperCase()
    ) {
      const hasPosicoesInCidade = posicoes.some(
        (posicao) =>
          posicao.entrevista?.secretariaMunicipal?.endereco?.cidade?.id ===
          cidade,
      );

      if (!hasPosicoesInCidade) {
        throw new NotFoundException(
          `Não foi identificado posição na fila na cidade ${posicoes[0]?.entrevista?.secretariaMunicipal?.endereco?.cidade?.nome}`,
        );
      }

      const posicoesFiltered = posicoes.filter(
        (posicao) =>
          posicao.entrevista?.secretariaMunicipal?.endereco?.cidade?.id ===
          cidade,
      );

      return posicoesFiltered;
    } else if (query?.nomeResponsavel) {
      throw new UnprocessableEntityException(
        'Dados inconsistentes. Realize a consulta novamente.',
      );
    }

    opcoesNomes = opcoesNomes.sort(() => Math.random() - 0.5);
    return opcoesNomes;
  }

  private async addApelidosToFilaPosicao(filaPosicoes: any[]) {
    const posicoesPorSecretaria = new Map<string, any[]>();

    filaPosicoes.forEach(posicao => {
      const secretariaId = posicao.entrevista?.secretariaMunicipal?.id;
      if (secretariaId) {
        if (!posicoesPorSecretaria.has(secretariaId)) {
          posicoesPorSecretaria.set(secretariaId, []);
        }
        posicoesPorSecretaria.get(secretariaId)!.push(posicao);
      }
    });

    // Busca os apelidos para cada secretaria
    for (const [secretariaId, posicoes] of posicoesPorSecretaria) {
      await this.addApelidosToFilaPosicaoBySecretaria(posicoes, secretariaId);
    }
  }

  private async addApelidosToFilaPosicaoBySecretaria(posicoes: any[], secretariaId: string) {
    const etapaIds = [...new Set(posicoes.map(posicao => posicao.entrevista?.etapa?.id).filter(Boolean))];

    if (etapaIds.length === 0) {
      return;
    }

    const apelidosQuery = await this.posicaoRepository
      .createQueryBuilder()
      .select('sme.etapa_id', 'etapaId')
      .addSelect('sme.apelido', 'apelido')
      .from('secretaria_municipal_etapa', 'sme')
      .where('sme.secretaria_municipal_id = :secretariaId', { secretariaId })
      .andWhere('sme.etapa_id IN (:...etapaIds)', { etapaIds })
      .getRawMany();

    const apelidosMap = new Map();
    apelidosQuery.forEach(row => {
      apelidosMap.set(row.etapaId, row.apelido);
    });

    // Adiciona os apelidos nas etapas
    posicoes.forEach(posicao => {
      if (posicao.entrevista?.etapa) {
        (posicao.entrevista.etapa as any).apelido = apelidosMap.get(posicao.entrevista.etapa.id) || null;
      }
    });
  }


  async getLastFila(
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
  ) {
    const qbLastFila = this.filaRepository.createQueryBuilder('fila');

    qbLastFila.orderBy('fila.created_at', 'DESC');
    qbLastFila.innerJoin('fila.escola', 'escola');
    qbLastFila.leftJoin('escola.secretariaMunicipal', 'secretariaMunicipal');
    qbLastFila.leftJoin('fila.etapa', 'etapa');

    qbLastFila.andWhere('escola.id = :idEscola', { idEscola });

    if (idEtapa) {
      qbLastFila.andWhere('fila.etapa_id = :idEtapa', {
        idEtapa: idEtapa,
      });
    }

    if (turno) {
      qbLastFila.andWhere('fila.turno = :turno', {
        turno: getPreferenciaTurnoFromDto(turno),
      });
    }

    if (anoLetivo) {
      qbLastFila.andWhere('fila.anoLetivo = :anoLetivo', { anoLetivo });
    }

    // Busca a fila com as relações
    const lastFila = await this.filaRepository.findOne({
      where: {
        escola: { id: idEscola },
        ...(idEtapa && { etapa: { id: idEtapa } }),
        ...(turno && { turno: getPreferenciaTurnoFromDto(turno) }),
        ...(anoLetivo && { anoLetivo }),
      },
      relations: [
        'escola',
        'escola.secretariaMunicipal',
        'etapa',
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    if (!lastFila) {
      return {
        data: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 0,
          totalPages: 0,
          currentPage: 0,
        },
      };
    }

    // Adiciona o apelido da etapa se houver secretaria municipal
    if (lastFila.etapa && lastFila.escola?.secretariaMunicipal) {
      await this.addApelidoToEtapa(lastFila.etapa, lastFila.escola.secretariaMunicipal.id);
    }

    const dataHoraFila = this.getDateTimeFila(lastFila);

    return {
      ...dataHoraFila,
      fila: {
        id: lastFila.id,
        createdAt: lastFila.createdAt,
        anoLetivo: lastFila.anoLetivo,
        turno: lastFila.turno,
        etapa: {
          id: lastFila.etapa.id,
          nome: lastFila.etapa.nome,
          apelido: (lastFila.etapa as any)?.apelido || null, // Inclui o apelido
        },
        escola: {
          id: lastFila.escola.id,
          nomeFantasia: lastFila.escola.nomeFantasia,
        },
      },
    };
  }

  private async addApelidoToEtapa(etapa: any, secretariaId: string) {
    if (!etapa?.id) {
      return;
    }

    const apelidoQuery = await this.posicaoRepository
      .createQueryBuilder()
      .select('sme.apelido', 'apelido')
      .from('secretaria_municipal_etapa', 'sme')
      .where('sme.secretaria_municipal_id = :secretariaId', { secretariaId })
      .andWhere('sme.etapa_id = :etapaId', { etapaId: etapa.id })
      .getRawOne();

    if (apelidoQuery) {
      (etapa as any).apelido = apelidoQuery.apelido;
    }
  }

  async getFilaPosicaoAnonimizadacsv(
    idEscola: string,
    idEtapa: number,
    turno: string,
    anoLetivo: string,
    query?: PaginateQuery,
  ) {
    const result = await this.getFilaPosicaoAnonimizada(
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
      query,
    );
    const fila = result.data; // ou apenas result se já for o array esperado
    const csv = await this.convertToCsv(fila as FilaItemColumnsAnonimizada[]);
    return csv;
  }

  async getEntrevistasComVagasCSV(query?: PaginateQuery) {
    const result = await this.getEntrevistasComVagas(query);
    const fila = result.data; // ou apenas result se já for o array esperado
    const csv = await this.convertToCsv(fila);
    return csv;
  }

  async getEntrevistasComVagas(query: PaginateQuery) {
    const entrevistas = await this.entrevistaService.findAllPublicWithVagas(
      query,
    );

    const pmap = await getPMap();

    const mappedResults: FilaItemColumnsAnonimizada[] = await pmap(
      entrevistas.data,
      async (result) => {
        // Busca o apelido da etapa se tivermos escola e secretaria
        let apelido = null;
        if (result?.reservaVaga?.vaga?.turma?.etapa?.id &&
          result?.reservaVaga?.vaga?.escola?.secretariaMunicipal?.id) {

          const apelidoQuery = await this.posicaoRepository
            .createQueryBuilder()
            .select('sme.apelido', 'apelido')
            .from('secretaria_municipal_etapa', 'sme')
            .where('sme.secretaria_municipal_id = :secretariaId', {
              secretariaId: result.reservaVaga.vaga.escola.secretariaMunicipal.id
            })
            .andWhere('sme.etapa_id = :etapaId', {
              etapaId: result.reservaVaga.vaga.turma.etapa.id
            })
            .getRawOne();

          apelido = apelidoQuery?.apelido || null;
        }

        return {
          id: result.id,
          idEntrevista: result.id,
          colocacao: null,
          nomeCrianca: this.anonymizeName(result.crianca.nome),
          dataNascimentoCrianca: result.crianca.dataNascimento,
          status: result.status,
          etapa: result?.reservaVaga?.vaga?.turma?.etapa?.nome ?? '',
          apelido: apelido, // Inclui o apelido da etapa
          preferenciaTurno: result?.reservaVaga?.vaga?.turma?.turno ?? '',
          preferenciaTurno2: '',
          razaoSocialPreferenciaUnidade:
            result?.reservaVaga?.vaga?.escola?.razaoSocial ?? '',
          razaoSocialPreferenciaUnidade2: '',
          anoLetivo: result?.reservaVaga?.vaga?.anoLetivo ?? '',

          matchCriterios: result.matchCriterios,

          dataEntrevista: result.dataEntrevista,
          horarioEntrevista: result.horarioEntrevista,
          diasPermanenciaFila: differenceInDays(
            new Date(),
            result.dataEntrevista,
          ),
        };
      },
      { concurrency: 5 },
    );

    return {
      data: mappedResults,
      meta: entrevistas.meta,
    };
  }

  async convertToCsv(data: FilaItemColumnsAnonimizada[]) {
    const formattedData = data.map((item) => ({
      ...item,
      dataNascimentoCrianca: this.formatDate(
        new Date(item.dataNascimentoCrianca),
      ),
      dataEntrevista: this.formatDate(new Date(item.dataEntrevista)),
      matchCriterios: item.matchCriterios
        .map((criterio) => criterio.criterio.nome)
        .join(', '),
    }));

    const fields = [
      { label: 'Colocação', value: 'colocacao' },
      { label: 'Nome da Criança', value: 'nomeCrianca' },
      {
        label: 'Data de Nascimento da Criança',
        value: 'dataNascimentoCrianca',
      },
      { label: 'Status', value: 'status' },
      { label: 'Etapa', value: 'apelido' },
      { label: 'Turno', value: 'preferenciaTurno' },
      { label: 'Turno2', value: 'preferenciaTurno2' },
      { label: 'Escola', value: 'razaoSocialPreferenciaUnidade' },
      { label: 'Escola Alternativa', value: 'razaoSocialPreferenciaUnidade2' },
      { label: 'Escola Selecionada', value: 'razaosocialUnidadeSelecionada' },
      { label: 'Data da Entrevista', value: 'dataEntrevista' },
      { label: 'Horário de Agendamento', value: 'horarioEntrevista' },
      { label: 'Dias na Fila', value: 'diasPermanenciaFila' },
      { label: 'Critérios de Correspondência', value: 'matchCriterios' },
    ];

    const opts = { fields, delimiter: ';' };

    try {
      const csv = parse(formattedData, opts);
      return csv;
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  private async obterNomesAleatorios(
    quantidade: number,
    nomesExcluidos: string[] = [],
  ): Promise<string[]> {
    const nomesBrasileiros = [
      'Maria',
      'Ana',
      'Francisca',
      'Antônia',
      'Adriana',
      'Juliana',
      'Márcia',
      'Fernanda',
      'José',
      'João',
      'Antônio',
      'Francisco',
      'Carlos',
      'Paulo',
      'Pedro',
      'Lucas',
      'Bruna',
      'Carla',
      'Camila',
      'Daniela',
      'Débora',
      'Eliane',
      'Fátima',
      'Gabriela',
      'André',
      'Bruno',
      'Diego',
      'Eduardo',
      'Felipe',
      'Gustavo',
      'Henrique',
      'Igor',
      'Helena',
      'Ingrid',
      'Jéssica',
      'Karina',
      'Larissa',
      'Letícia',
      'Marina',
      'Natália',
      'Júlio',
      'Leonardo',
      'Marcelo',
      'Mateus',
      'Nicolas',
      'Otávio',
      'Rafael',
      'Rodrigo',
      'Patrícia',
      'Priscila',
      'Renata',
      'Sabrina',
      'Tatiana',
      'Vanessa',
      'Viviane',
      'Yasmin',
    ];

    const nomesDisponiveis = nomesBrasileiros.filter(
      (nome) => !nomesExcluidos.includes(nome),
    );
    return nomesDisponiveis
      .sort(() => Math.random() - 0.5)
      .slice(0, quantidade);
  }

  anonymizeName(name: string): string {
    return name
      .split(' ')
      .map((i) => i.trim())
      .filter((i) => i.length > 0)
      .map((part) => `${part[0].toUpperCase()}.`)
      .join('');
  }

  private formatDate(date: Date): string {
    return format(date, 'dd/MM/yyyy');
  }

  private getDateTimeFila(date) {
    const datahoraFila = new Date(date.createdAt);
    const options = { timeZone: 'America/Porto_Velho', hour12: false };

    const dataFila = datahoraFila.toLocaleDateString('pt-BR', options);
    const horaFila = datahoraFila.toLocaleTimeString('pt-BR', options);

    return { dataFila, horaFila };
  }
}

export interface FilaItemColumns {
  id: string;
  idEntrevista: string;
  colocacao: number;
  nomeCrianca: string;
  idCrianca: string;
  cpfCrianca: string;
  dataNascimentoCrianca: Date;
  nomeResponsavel: string;
  tipoResponsavel: string;
  etapa: string;
  apelido: string | null; // Adiciona o campo apelido
  preferenciaTurno: string;
  preferenciaTurno2: string;
  razaoSocialPreferenciaUnidade: string;
  razaoSocialPreferenciaUnidade2: string;
  registrosContato: any[];
  matchCriterios: any[];
  dataEntrevista: Date;
  horarioEntrevista: string;
  diasPermanenciaFila: number;
}

export interface FilaItemColumnsAnonimizada {
  id: string;
  idEntrevista: string;
  colocacao: number | null;
  nomeCrianca: string;
  dataNascimentoCrianca: Date;
  etapa: string;
  apelido: string | null; // Adiciona o campo apelido
  preferenciaTurno: string;
  preferenciaTurno2: string;
  razaoSocialPreferenciaUnidade: string;
  razaoSocialPreferenciaUnidade2: string;
  matchCriterios: any[];
  dataEntrevista: Date;
  horarioEntrevista: string;
  diasPermanenciaFila: number;
}
