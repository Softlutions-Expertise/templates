import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Brackets, Repository } from 'typeorm';
import { VagaEntity } from '../../escola/entities/vaga.entity';
import { FilaGeradaPosicaoEntity } from '../../fila/entities/fila-gerada-posicao.entity';
import { ReportFilaDTO } from '../dtos/report-fila.dto';

@Injectable()
export class ReportFilaService {
  constructor(
    @Inject('FILA_GERADA_REPOSITORY')
    private filaGeradaRepository: Repository<FilaGeradaPosicaoEntity>,
    @Inject('VAGAS_REPOSITORY')
    private vagasRepository: Repository<VagaEntity>,
  ) { }

  async execute(query: any) {
    try {
      const reportFilaDTO = plainToClass(ReportFilaDTO, query);
      await validateOrReject(reportFilaDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const filter = await this.buildQueryBuilder(query);
    const entities = await filter.getMany();

    return await this.mapEntitiesToData(entities, query);
  }

  private async buildQueryBuilder(query: any) {
    const qb = this.filaGeradaRepository.createQueryBuilder(
      'fila_gerada_posicao',
    );
    qb.groupBy('fila_gerada_posicao.id');
    qb.orderBy();

    qb.leftJoin('fila_gerada_posicao.filaGerada', 'fila');
    qb.addSelect(['fila.id', 'fila.createdAt', 'fila.anoLetivo', 'fila.turno']);
    qb.addGroupBy('fila.id');

    qb.addGroupBy('fila.anoLetivo');
    qb.andWhere('fila.anoLetivo = :year', { year: query.year });

    qb.leftJoin('fila_gerada_posicao.entrevista', 'entrevista');
    qb.addSelect(['entrevista.id', 'entrevista.dataEntrevista']);
    qb.addGroupBy('entrevista.id');

    qb.leftJoin('entrevista.secretariaMunicipal', 'secretaria_municipal');
    qb.addSelect([
      'secretaria_municipal.id',
      'secretaria_municipal.nomeFantasia',
    ]);
    qb.addGroupBy('secretaria_municipal.id');
    qb.andWhere('secretaria_municipal.id = :secretariaMunicipalId', {
      secretariaMunicipalId: query.secretariaMunicipalId,
    });

    qb.leftJoin('fila.escola', 'escola');
    qb.addSelect(['escola.id', 'escola.nomeFantasia']);
    qb.addGroupBy('escola.id');
    if (query.unidadeEscolarId) {
      qb.andWhere('escola.id = :unidadeEscolarId ', {
        unidadeEscolarId: query.unidadeEscolarId,
      });
    }

    qb.leftJoin('fila.etapa', 'etapa');
    qb.addSelect(['etapa.id', 'etapa.nome']);
    qb.addGroupBy('etapa.id');

    qb.leftJoin(
      'etapa.secretariaMunicipalEtapas',
      'sme',
      'sme.secretariaMunicipal = secretaria_municipal.id AND sme.ativa = true',
    );
    qb.addSelect([
      'sme.id',
      'sme.apelido',
      'sme.idadeInicial',
      'sme.idadeFinal',
    ]);
    qb.addGroupBy('sme.id');
    qb.addGroupBy('sme.apelido');
    qb.addGroupBy('sme.idadeInicial');
    qb.addGroupBy('sme.idadeFinal');

    if (query.etapaId) {
      qb.andWhere('etapa.id = :etapaId', {
        etapaId: query.etapaId,
      });
    }

    qb.addGroupBy('fila.turno');
    if (query.turn) {
      qb.andWhere('fila.turno = :turn', {
        turn: query.turn,
      });
    }

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
                AND fila2.turno =  fila.turno
                AND fila2.etapa_id =  fila.etapa_id
                AND fila2.ano_letivo =  fila.ano_letivo
              ORDER BY fila2.created_at DESC
              LIMIT 1 
            )
          `,
        );
      }),
    );

    if (query.startPosition) {
      qb.andWhere('fila_gerada_posicao.posicao_geral >= :startPosition', {
        startPosition: query.startPosition,
      });
    }

    if (query.endPosition) {
      qb.andWhere('fila_gerada_posicao.posicao_geral <= :endPosition', {
        endPosition: query.endPosition,
      });
    }

    if (query.startEntryDate) {
      qb.andWhere('DATE(entrevista.data_entrevista) >= :startEntryDate', {
        startEntryDate: query.startEntryDate,
      });
    }

    if (query.endEntryDate) {
      qb.andWhere('DATE(entrevista.data_entrevista) <= :endEntryDate', {
        endEntryDate: query.endEntryDate,
      });
    }

    qb.leftJoin('entrevista.registrarContato', 'registrar_contato');
    qb.addSelect([
      'registrar_contato.id',
      'registrar_contato.dataContato',
      'registrar_contato.ligacaoAceita',
    ]);
    qb.addGroupBy('registrar_contato.id');

    if (query.lastContactResult) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb.where(
            `registrar_contato.id = (
              SELECT rc.id
              FROM registrar_contato rc
              WHERE rc.entrevista_id = entrevista.id
              ORDER BY rc.data_contato DESC
              LIMIT 1
            ) AND registrar_contato.ligacaoAceita = :lastContactResult`,
            { lastContactResult: query.lastContactResult },
          );
        }),
      );
    }

    qb.leftJoin(
      'entrevista.crianca',
      'crianca',
      'crianca.id = entrevista.crianca',
    );
    qb.addSelect([
      'crianca.id',
      'crianca.nome',
      'crianca.cpf',
      'crianca.dataNascimento',
    ]);
    qb.addGroupBy('crianca.id');

    qb.leftJoin(
      'crianca.responsavel',
      'responsavel',
      'responsavel.id = crianca.responsavel',
    );
    qb.addSelect(['responsavel.id', 'responsavel.nomeRes']);
    qb.addGroupBy('responsavel.id');

    qb.leftJoin(
      'crianca.responsavel2',
      'responsavel2',
      'responsavel2.id = crianca.responsavel2',
    );
    qb.addSelect(['responsavel2.id', 'responsavel2.nomeRes']);
    qb.addGroupBy('responsavel2.id');

    // qb.leftJoin('crianca.contato', 'contato', 'contato.id = crianca.contato');
    // qb.addSelect(['contato.id', 'contato.telefones']);
    // qb.addGroupBy('contato.id');

    if (query.viewPreferredGroups === 'true') {
      // critérios da secretaria municipal
      qb.leftJoin(
        'secretaria_municipal.configuracoesCriterios',
        'configuracoes_criterios',
        'configuracoes_criterios.secretariaMunicipal = secretaria_municipal.id AND data_vigencia_fim IS NULL',
      );
      qb.addSelect(['configuracoes_criterios.id']);
      qb.addGroupBy('configuracoes_criterios.id');

      qb.leftJoin(
        'configuracoes_criterios.criteriosConfiguracaoCriterio',
        'criterios_configuracao_criterio',
        'criterios_configuracao_criterio.criteriosConfiguracaoId = configuracoes_criterios.id',
      );
      qb.addSelect([
        'criterios_configuracao_criterio.id',
        'criterios_configuracao_criterio.posicao',
        'criterios_configuracao_criterio.subPosicao',
        'criterios_configuracao_criterio.exigirComprovacao',
      ]);
      qb.addGroupBy('criterios_configuracao_criterio.id');
      qb.addOrderBy('criterios_configuracao_criterio.posicao', 'ASC');
      qb.addOrderBy('criterios_configuracao_criterio.subPosicao', 'ASC');

      qb.leftJoin(
        'criterios_configuracao_criterio.criterio',
        'criterio',
        'criterio.id = criterios_configuracao_criterio.criterio_id',
      );
      qb.addSelect(['criterio.id', 'criterio.nome']);
      qb.addGroupBy('criterio.id');

      // critérios da entrevista
      qb.leftJoin(
        'entrevista.matchCriterios',
        'match_criterios',
        '(match_criterios.id is null) OR (match_criterios.ativo = TRUE AND match_criterios.versaoMaisRecente = true)',
      );
      qb.addSelect(['match_criterios.id']);
      qb.addGroupBy('match_criterios.id');

      qb.leftJoin('match_criterios.criterio', 'criterio_match');
      qb.addSelect(['criterio_match.id']);
      qb.addGroupBy('criterio_match.id');
    }

    qb.addOrderBy('fila.anoLetivo', 'DESC');
    qb.addOrderBy('secretaria_municipal.nomeFantasia', 'ASC');
    qb.addOrderBy('escola.nomeFantasia', 'ASC');
    qb.addOrderBy('etapa.nome', 'ASC');
    qb.addOrderBy('fila.turno', 'ASC');
    qb.addOrderBy('fila_gerada_posicao.posicao_geral', 'ASC');

    return qb;
  }

  private async getAllEtapasLegend(secretariaMunicipalId: string) {
    const smes = await this.filaGeradaRepository
      .createQueryBuilder()
      .select('etapa.nome', 'nome')
      .addSelect('sme.apelido', 'apelido')
      .addSelect('sme.idadeInicial', 'idade_inicial')
      .addSelect('sme.idadeFinal', 'idade_final')
      .from('secretaria_municipal_etapa', 'sme')
      .innerJoin('etapa', 'etapa', 'etapa.id = sme.etapa_id')
      .where('sme.secretaria_municipal_id = :secretariaMunicipalId', {
        secretariaMunicipalId,
      })
      .andWhere('sme.ativa = true')
      .groupBy('etapa.nome, sme.apelido, sme.idadeInicial, sme.idadeFinal')
      .orderBy('etapa.nome', 'ASC')
      .getRawMany();

    return smes;
  }

  private async mapEntitiesToData(entities: any[], query: any) {
    const currentDate = new Date();

    const filteredEntities = entities
      .map((entity) => ({
        ...entity,
        diasPermanencia: Math.floor(
          (currentDate.getTime() -
            new Date(entity.entrevista.dataEntrevista).getTime()) /
          (1000 * 60 * 60 * 24),
        ),
      }))
      .filter((entity) => {
        const { startDayStay, endDayStay } = query;
        const diasPermanencia = entity.diasPermanencia;

        if (startDayStay && endDayStay) {
          return (
            diasPermanencia >= Number(startDayStay) &&
            diasPermanencia <= Number(endDayStay)
          );
        }
        if (startDayStay) return diasPermanencia >= Number(startDayStay);
        if (endDayStay) return diasPermanencia <= Number(endDayStay);

        return true;
      });

    const allEtapasLegend = await this.getAllEtapasLegend(
      query.secretariaMunicipalId,
    );

    let totalCount = 0;

    const groupedData = await filteredEntities.reduce(
      async (accPromise, entity) => {
        const acc = await accPromise;
        const {
          filaGerada: { anoLetivo, escola, etapa, turno },
          entrevista: {
            secretariaMunicipal,
            crianca,
            dataEntrevista,
            registrarContato,
            matchCriterios,
          },
          posicaoGeral,
          diasPermanencia,
        } = entity;

        const escolaNome = escola.nomeFantasia;
        const secretariaNome = secretariaMunicipal.nomeFantasia;
        const etapaNome = etapa.nome;

        const sme = etapa.secretariaMunicipalEtapas?.[0];
        const apelido = sme?.apelido;

        let vagasLivres = Infinity;
        if (query.linePerVacancy === 'true') {
          vagasLivres = await this.buildQueryBuilderLinePerVacancy(
            anoLetivo,
            secretariaMunicipal.id,
            escola.id,
            etapa.id,
            turno,
          );
        }

        if (vagasLivres > 0) {
          acc[anoLetivo] ??= {};
          acc[anoLetivo][secretariaNome] ??= {
            escolas: {},
            grupos_preferenciais: null,
            etapas: allEtapasLegend,
          };
          acc[anoLetivo][secretariaNome].escolas[escolaNome] ??= {};

          acc[anoLetivo][secretariaNome].escolas[escolaNome][etapaNome] ??= {
            apelido: apelido,
            turnos: {},
          };
          acc[anoLetivo][secretariaNome].escolas[escolaNome][etapaNome].turnos[
            turno
          ] ??= [];

          const escolaEtapaTurnoArray =
            acc[anoLetivo][secretariaNome].escolas[escolaNome][etapaNome]
              .turnos[turno];

          if (escolaEtapaTurnoArray.length < vagasLivres) {
            const criterios = (matchCriterios || [])
              .map((matchCriterio) => {
                const configCriterio =
                  secretariaMunicipal.configuracoesCriterios
                    .flatMap(
                      (criterio) => criterio.criteriosConfiguracaoCriterio,
                    )
                    .find(
                      (configCriterio) =>
                        configCriterio.criterio.id ===
                        matchCriterio.criterio.id,
                    );

                return configCriterio
                  ? {
                    posicao: configCriterio.posicao,
                    subPosicao: configCriterio.subPosicao,
                  }
                  : null;
              })
              .filter((criterio) => criterio !== null)
              .sort((a, b) => {
                if (a.posicao === b.posicao) {
                  return a.subPosicao - b.subPosicao;
                }
                return a.posicao - b.posicao;
              });

            escolaEtapaTurnoArray.push({
              data_entrevista: dataEntrevista,
              posicao_geral: posicaoGeral,
              dias_permanencia: diasPermanencia,
              crianca: {
                nome: crianca.nome,
                cpf: crianca.cpf,
                data_nascimento: crianca.dataNascimento,
              },
              responsavel: {
                nome: crianca.responsavel.nomeRes,
              },
              responsavel2: crianca.responsavel2
                ? { nome: crianca.responsavel2.nomeRes }
                : null,
              registros_contato: registrarContato
                ? registrarContato.map((rc) => ({
                  data_contato: rc.dataContato,
                  ligacao_aceita: rc.ligacaoAceita,
                }))
                : null,
              criterios: criterios.filter((criterio) => criterio !== null),
            });
            totalCount++;
          }

          if (
            secretariaMunicipal.configuracoesCriterios &&
            !acc[anoLetivo][secretariaNome].grupos_preferenciais
          ) {
            acc[anoLetivo][secretariaNome].grupos_preferenciais =
              secretariaMunicipal.configuracoesCriterios.flatMap((criterio) =>
                criterio.criteriosConfiguracaoCriterio.map(
                  (configCriterio) => ({
                    posicao: configCriterio.posicao,
                    subPosicao: configCriterio.subPosicao,
                    exigirComprovacao: configCriterio.exigirComprovacao,
                    criterio: configCriterio.criterio.nome,
                  }),
                ),
              );
          }
        }

        return acc;
      },
      Promise.resolve({} as Record<string, any>),
    );

    const data = Object.entries(groupedData).map(([year, secretarias]) => ({
      year,
      secretarias: Object.entries(secretarias).map(
        ([secretaria, { escolas, grupos_preferenciais, etapas }]) => ({
          secretaria,
          grupos_preferenciais,
          etapas,
          escolas: Object.entries(escolas).map(([escola, etapasMap]) => ({
            escola,
            etapas: Object.entries(etapasMap).map(([etapaNome, etapaData]) => {
              return {
                etapa: etapaNome,
                apelido: (etapaData as any).apelido,
                turnos: Object.entries((etapaData as any).turnos).map(
                  ([turno, entries]) => ({
                    turno,
                    entries,
                  }),
                ),
              };
            }),
          })),
        }),
      ),
    }));

    return {
      data,
      count:
        query.linePerVacancy === 'true' ? totalCount : filteredEntities.length,
    };
  }

  private async buildQueryBuilderLinePerVacancy(
    anoLetivo: string,
    secretariaMunicipalId: string,
    unidadeEscolarId: string,
    etapaId: string,
    turno: string,
  ) {
    const qb = this.vagasRepository.createQueryBuilder('vagas');
    qb.where('vagas.ativa = true');
    qb.andWhere('vagas.anoLetivo = :anoLetivo', { anoLetivo });
    qb.leftJoin('vagas.escola', 'escola', 'escola.id = vagas.escola.id');
    qb.andWhere('escola.secretariaMunicipal.id = :secretariaMunicipalId', {
      secretariaMunicipalId,
    });
    qb.andWhere('vagas.escola.id = :unidadeEscolarId', { unidadeEscolarId });
    qb.leftJoin('vagas.turma', 'turma', 'turma.id = vagas.turma.id');
    qb.andWhere('turma.etapa.id = :etapaId', { etapaId });
    qb.andWhere('turma.turno = :turno', { turno });

    return await qb.getCount();
  }
}
