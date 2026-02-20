import { Inject, Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { VagaEntity } from '../escola/entities/vaga.entity';
import { FilaGeradaPosicaoEntity } from './entities/fila-gerada-posicao.entity';
import { Fila } from './entities/fila.entity';

const CHECK_AUTHZ = true;

@Injectable()
export class FilaAnalyticsService {
  protected readonly dataSource: DataSource;

  constructor(
    @Inject('FILA_REPOSITORY')
    private filaRepository: Repository<Fila>,
    @Inject('FILA_GERADA_REPOSITORY')
    private filaGeradaRepository: Repository<FilaGeradaPosicaoEntity>,
    @Inject('VAGAS_REPOSITORY')
    private vagasRepository: Repository<VagaEntity>,
  ) {}

  async getQuantPerFila(
    acessoControl: AcessoControl,
    anoLetivo: string,
    secretariaMunicipalId: string,
    escolaId: string | null,
    etapaId: number | null,
    turno: string | null,
  ) {
    const qbLastFila = this.filaRepository.createQueryBuilder('fila');

    qbLastFila.where('FALSE');

    if (CHECK_AUTHZ && acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'fila:read',
        qbLastFila,
      );
    }

    const qb = await this.baseQueryGetFila(
      anoLetivo,
      secretariaMunicipalId,
      escolaId,
      etapaId,
      turno,
    );

    const result = await qb.getMany();
    const groupedResult = await result.reduce(async (accPromise, item) => {
      const acc = await accPromise;
      const key = `${item.filaGerada.anoLetivo}-${item.entrevista.secretariaMunicipal.nomeFantasia}-${item.filaGerada.escola.nomeFantasia}`;
      if (!acc[key]) {
        const vagasLivres = await this.getVagas(
          true,
          anoLetivo,
          secretariaMunicipalId,
          item.filaGerada.escola.id,
          item.filaGerada.etapa.id,
          item.filaGerada.turno,
        );
        const vagasOcupadas = await this.getVagas(
          false,
          anoLetivo,
          secretariaMunicipalId,
          item.filaGerada.escola.id,
          item.filaGerada.etapa.id,
          item.filaGerada.turno,
        );
        acc[key] = {
          anoLetivo: item.filaGerada.anoLetivo,
          secretariaMunicipal: {
            id: item.entrevista.secretariaMunicipal.id,
            nome: item.entrevista.secretariaMunicipal.nomeFantasia,
          },
          escola: {
            id: item.filaGerada.escola.id,
            nome: item.filaGerada.escola.nomeFantasia,
          },
          etapa: {
            id: item.filaGerada.etapa.id,
            nome: item.filaGerada.etapa.nome,
          },
          turno: item.filaGerada.turno,
          vagasLivres,
          vagasOcupadas,
          fila: 0,
        };
      }
      acc[key].fila += 1;
      return acc;
    }, Promise.resolve({}));

    return Object.values(await groupedResult);
  }

  async getFilaWithInfoCrianca(
    acessoControl: AcessoControl,
    anoLetivo: string,
    secretariaMunicipalId: string,
    escolaId: string | null,
    etapaId: number | null,
    turno: string | null,
  ) {
    const qbLastFila = this.filaRepository.createQueryBuilder('fila');

    qbLastFila.where('FALSE');

    if (CHECK_AUTHZ && acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'fila:read',
        qbLastFila,
      );
    }

    const qb = await this.baseQueryGetFila(
      anoLetivo,
      secretariaMunicipalId,
      escolaId,
      etapaId,
      turno,
    );

    // criança
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
      'crianca.sexo',
      'crianca.numeroSUS',
      'crianca.paisOrigem',
      'crianca.registroNacionalEstrangeiro',
      'crianca.protocoloRefugio',
      'crianca.numeroUnidadeConsumidora',
      'crianca.numeroUnidadeMatriculaIPTU',
    ]);
    qb.addGroupBy('crianca.id');

    // criança contato
    qb.leftJoin('crianca.contato', 'contato', 'contato.id = crianca.contato');
    qb.addSelect(['contato.id', 'contato.telefones']);
    qb.addGroupBy('contato.id');

    // criança endereço
    qb.leftJoin(
      'crianca.endereco',
      'endereco',
      'endereco.id = crianca.endereco',
    );
    qb.addSelect([
      'endereco.id',
      'endereco.cep',
      'endereco.logradouro',
      'endereco.numero',
      'endereco.bairro',
      'endereco.complemento',
      'endereco.latitude',
      'endereco.longitude',
    ]);
    qb.addGroupBy('endereco.id');

    // endereco cidade
    qb.leftJoin('endereco.cidade', 'cidade');
    qb.addSelect(['cidade.id', 'cidade.nome']);
    qb.addGroupBy('cidade.id');

    // cidade estado
    qb.leftJoin('cidade.estado', 'estado');
    qb.addSelect(['estado.id', 'estado.nome', 'estado.uf']);
    qb.addGroupBy('estado.id');

    // endereco distrito
    qb.leftJoin('endereco.distrito', 'distrito');
    qb.addSelect(['distrito.id', 'distrito.nome']);
    qb.addGroupBy('distrito.id');

    // endereco subdistrito
    qb.leftJoin('endereco.subdistrito', 'subdistrito');
    qb.addSelect(['subdistrito.id', 'subdistrito.nome']);
    qb.addGroupBy('subdistrito.id');

    // responsavel
    qb.leftJoin(
      'crianca.responsavel',
      'responsavel',
      'responsavel.id = crianca.responsavel',
    );
    qb.addSelect([
      'responsavel.id',
      'responsavel.nomeRes',
      'responsavel.cpfRes',
      'responsavel.dataNascimentoRes',
      'responsavel.sexoRes',
      'responsavel.nacionalidadeRes',
      'responsavel.registroNacionalEstrangeiroRes',
      'responsavel.protocoloRefugioRes',
      'responsavel.estadoCivil',
      'responsavel.profissao',
      'responsavel.falecido',
      'responsavel.resideCrianca',
      'responsavel.exerceAtividadeProfissional',
      'responsavel.cepLocalTrabalhoResponsavel',
    ]);
    qb.addGroupBy('responsavel.id');

    // responsavel2
    qb.leftJoin(
      'crianca.responsavel2',
      'responsavel2',
      'responsavel2.id = crianca.responsavel2',
    );
    qb.addSelect([
      'responsavel2.id',
      'responsavel2.nomeRes',
      'responsavel2.cpfRes',
      'responsavel2.dataNascimentoRes',
      'responsavel.sexoRes',
      'responsavel.nacionalidadeRes',
      'responsavel.registroNacionalEstrangeiroRes',
      'responsavel.protocoloRefugioRes',
      'responsavel.estadoCivil',
      'responsavel.profissao',
      'responsavel.falecido',
      'responsavel.resideCrianca',
      'responsavel.exerceAtividadeProfissional',
      'responsavel.cepLocalTrabalhoResponsavel',
    ]);
    qb.addGroupBy('responsavel2.id');

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

    const result = await qb.getMany();
    const groupedResult = await result.reduce(async (accPromise, entity) => {
      const acc = await accPromise;

      const {
        filaGerada: { anoLetivo, escola, etapa, turno },
        entrevista: {
          secretariaMunicipal,
          crianca,
          dataEntrevista,
          matchCriterios,
        },
        posicaoGeral,
      } = entity;

      const escolaNome = escola.nomeFantasia;
      const secretariaNome = secretariaMunicipal.nomeFantasia;
      const etapaNome = etapa.nome;

      acc[anoLetivo] ??= {};
      acc[anoLetivo][secretariaNome] ??= { escolas: {}, criterios: [] };
      acc[anoLetivo][secretariaNome].escolas[escolaNome] ??= {};
      acc[anoLetivo][secretariaNome].escolas[escolaNome][etapaNome] ??= {};
      acc[anoLetivo][secretariaNome].escolas[escolaNome][etapaNome][turno] ??=
        [];

      const escolaEtapaTurnoArray =
        acc[anoLetivo][secretariaNome].escolas[escolaNome][etapaNome][turno];

      const criterios = (matchCriterios || [])
        .map((matchCriterio) => {
          const configCriterio = secretariaMunicipal.configuracoesCriterios
            .flatMap((criterio) => criterio.criteriosConfiguracaoCriterio)
            .find(
              (configCriterio) =>
                configCriterio.criterio.id === matchCriterio.criterio.id,
            );

          return configCriterio
            ? {
                posicao: configCriterio.posicao,
                subPosicao: configCriterio.subPosicao,
                exigirComprovacao: configCriterio.exigirComprovacao,
                criterio: configCriterio.criterio.nome,
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
        crianca: {
          nome: crianca.nome,
          cpf: crianca.cpf,
          data_nascimento: crianca.dataNascimento,
          sexo: crianca.sexo,
          numero_sus: crianca.numeroSUS,
          pais_origem: crianca.paisOrigem,
          registro_nacional_estrangeiro: crianca.registroNacionalEstrangeiro,
          protocolo_refugio: crianca.protocoloRefugio,
          numero_unidade_consumidora: crianca.numeroUnidadeConsumidora,
          numero_unidade_matricula_iptu: crianca.numeroUnidadeMatriculaIPTU,
          endereco: {
            cep: crianca.endereco.cep,
            logradouro: crianca.endereco.logradouro,
            numero: crianca.endereco.numero,
            bairro: crianca.endereco.bairro,
            complemento: crianca.endereco.complemento,
            latitude: crianca.endereco.latitude,
            longitude: crianca.endereco.longitude,
            cidade: {
              nome: crianca.endereco.cidade.nome,
              estado: {
                id: crianca.endereco.cidade.estado.id,
                nome: crianca.endereco.cidade.estado.nome,
                uf: crianca.endereco.cidade.estado.uf,
              },
            },
            distrito:
              crianca.endereco.distrito && crianca.endereco.distrito.nome !== ''
                ? { nome: crianca.endereco.distrito.nome }
                : null,
            subdistrito:
              crianca.endereco.subdistrito &&
              crianca.endereco.subdistrito.nome !== ''
                ? { nome: crianca.endereco.subdistrito.nome }
                : null,
          },
          contato: {
            telefones: crianca.contato.telefones,
          },
        },
        responsavel: {
          nome: crianca.responsavel.nomeRes,
          cpf: crianca.responsavel.cpfRes,
          data_nascimento: crianca.responsavel.dataNascimentoRes,
          sexo: crianca.responsavel.sexoRes,
          nacionalidade: crianca.responsavel.nacionalidadeRes,
          registro_nacional_estrangeiro:
            crianca.responsavel.registroNacionalEstrangeiroRes,
          protocolo_refugio: crianca.responsavel.protocoloRefugioRes,
          estado_civil: crianca.responsavel.estadoCivil,
          profissao: crianca.responsavel.profissao,
          falecido: crianca.responsavel.falecido,
          reside_crianca: crianca.responsavel.resideCrianca,
          exerce_atividade_profissional:
            crianca.responsavel.exerceAtividadeProfissional,
          cep_local_trabalho_responsavel:
            crianca.responsavel.cepLocalTrabalhoResponsavel,
        },
        responsavel2: crianca.responsavel2
          ? {
              nome: crianca.responsavel2.nomeRes,
              cpf: crianca.responsavel2.cpfRes,
              data_nascimento: crianca.responsavel2.dataNascimentoRes,
              sexo: crianca.responsavel2.sexoRes,
              nacionalidade: crianca.responsavel2.nacionalidadeRes,
              registro_nacional_estrangeiro:
                crianca.responsavel2.registroNacionalEstrangeiroRes,
              protocolo_refugio: crianca.responsavel2.protocoloRefugioRes,
              estado_civil: crianca.responsavel2.estadoCivil,
              profissao: crianca.responsavel2.profissao,
              falecido: crianca.responsavel2.falecido,

              reside_crianca: crianca.responsavel2.resideCrianca,
              exerce_atividade_profissional:
                crianca.responsavel2.exerceAtividadeProfissional,
              cep_local_trabalho_responsavel:
                crianca.responsavel2.cepLocalTrabalhoResponsavel,
            }
          : null,
        criterios: criterios.filter((criterio) => criterio !== null),
      });

      return acc;
    }, Promise.resolve({} as Record<string, Record<string, { escolas: Record<string, Record<string, Record<string, any[]>>>; criterios: any[] }>>));

    const data = Object.entries(groupedResult).map(([year, secretarias]) => ({
      year,
      secretarias: Object.entries(secretarias).map(
        ([secretaria, { escolas }]) => ({
          secretaria,
          escolas: Object.entries(escolas).map(([escola, etapas]) => ({
            escola,
            etapas: Object.entries(etapas).map(([etapa, turnos]) => ({
              etapa,
              turnos: Object.entries(turnos).map(([turno, entries]) => ({
                turno,
                entries,
              })),
            })),
          })),
        }),
      ),
    }));

    return data;
  }

  private async getVagas(
    ativa: boolean,
    anoLetivo: string,
    secretariaMunicipalId: string,
    unidadeEscolarId: string,
    etapaId: number,
    turno: string,
  ) {
    const qb = this.vagasRepository.createQueryBuilder('vagas');
    qb.where('vagas.ativa = :ativa', { ativa });
    qb.andWhere('vagas.anoLetivo = :anoLetivo', { anoLetivo });
    qb.andWhere('vagas.escola.id = :unidadeEscolarId', { unidadeEscolarId });

    qb.leftJoin('vagas.escola', 'escola');
    qb.andWhere('escola.secretariaMunicipal.id = :secretariaMunicipalId', {
      secretariaMunicipalId,
    });

    qb.leftJoin('vagas.turma', 'turma');
    qb.andWhere('turma.etapa.id = :etapaId', { etapaId });
    qb.andWhere('turma.turno = :turno', { turno });

    return await qb.getCount();
  }

  private async baseQueryGetFila(
    anoLetivo: string,
    secretariaMunicipalId: string,
    escolaId: string | null,
    etapaId: number | null,
    turno: string | null,
  ) {
    const qb = this.filaGeradaRepository.createQueryBuilder(
      'fila_gerada_posicao',
    );
    qb.groupBy('fila_gerada_posicao.id');
    qb.orderBy();

    qb.leftJoin('fila_gerada_posicao.filaGerada', 'fila');
    qb.addSelect(['fila.id', 'fila.createdAt', 'fila.anoLetivo', 'fila.turno']);
    qb.addGroupBy('fila.id');

    qb.addGroupBy('fila_ano_letivo');
    qb.andWhere('fila.anoLetivo = :anoLetivo', { anoLetivo: anoLetivo });

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
      secretariaMunicipalId: secretariaMunicipalId,
    });

    qb.leftJoin('fila.escola', 'escola');
    qb.addSelect(['escola.id', 'escola.nomeFantasia']);
    qb.addGroupBy('escola.id');
    if (escolaId) {
      qb.andWhere('escola.id = :escolaId ', {
        escolaId: escolaId,
      });
    }

    qb.leftJoin('fila.etapa', 'etapa');
    qb.addSelect(['etapa.id', 'etapa.nome']);
    qb.addGroupBy('etapa.id');
    if (etapaId) {
      qb.andWhere('etapa.id = :etapaId', {
        etapaId: etapaId,
      });
    }

    qb.addGroupBy('fila_turno');
    if (turno) {
      qb.andWhere('fila.turno = :turno', {
        turno: turno,
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

    return qb;
  }
}
