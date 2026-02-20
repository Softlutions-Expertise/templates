import { Inject, Injectable } from '@nestjs/common';
import { Brackets, DataSource, SelectQueryBuilder } from 'typeorm';
import { AgendamentoEntity } from '../../modules/agendamento/entities/agendamento.entity';
import { ConsultaFeriadosEntity } from '../../modules/agendamento/entities/consulta-feriados.entity';
import { DiasNaoUteisEntity } from '../../modules/agendamento/entities/dias-nao-uteis.entity';
import { FeriadoEntity } from '../../modules/agendamento/entities/feriado.entity';
import { GerenciaAgendamentoEntity } from '../../modules/agendamento/entities/gerencia-agendamento.entity';
import { CidadeEntity } from '../../modules/base/entities/cidade.entity';
import { CriteriosConfiguracaoCriterioEntity } from '../../modules/configuracao-criterio/entities/criterios-configuracao-criterio.entity';
import { CriteriosConfiguracaoEntity } from '../../modules/configuracao-criterio/entities/criterios-configuracao.entity';
import { CriteriosEntity } from '../../modules/entrevista/entities/criterios.entity';
import { EntrevistaEntity } from '../../modules/entrevista/entities/entrevista.entity';
import { EntrevistaMatchCriterioEntity } from '../../modules/entrevista/entities/etrevista_match_criterio.entity';
import { RegistrarContatoEntity } from '../../modules/entrevista/entities/registrar-contato.entity';
import { EscolaEntity } from '../../modules/escola/entities/escola.entity';
import { RegistroVagasEntity } from '../../modules/escola/entities/registro-vagas.entity';
import { TurmaEntity } from '../../modules/escola/entities/turma.entity';
import { VagaEntity } from '../../modules/escola/entities/vaga.entity';
import { EtapaEntity } from '../../modules/etapa/etapa.entity';
import { FilaGeradaPosicaoHasEntrevistaMatchCriterioEntity } from '../../modules/fila/entities/fila-gerada-posicao-has-entrevista-match-criterio.entity';
import { FilaGeradaPosicaoEntity } from '../../modules/fila/entities/fila-gerada-posicao.entity';
import { FilaGeradaEntity } from '../../modules/fila/entities/fila-gerada.entity';
import { Fila } from '../../modules/fila/entities/fila.entity';
import { IntegrationAccessTokenEntity } from '../../modules/integrations/integration-access-token/entities/integration-access-token.entity';
import { CriancaEntity } from '../../modules/pessoa/entities/crianca.entity';
import { FuncionarioEntity } from '../../modules/pessoa/entities/funcionario.entity';
import { PessoaEntity } from '../../modules/pessoa/entities/pessoa.entity';
import { ReservaVagaEntity } from '../../modules/reserva-vaga/entities/reserva-vaga.entity';
import { SecretariaMunicipalEntity } from '../../modules/secretaria-municipal/entities/secretaria-municipal.entity';
import { ArquivoEntity } from '../arquivo/entities/arquivo.entity';
import { ExternalTceIdentityCpfEntity } from '../authentication/entities/external-tce-identity-cpf.entity';

@Injectable()
export class DatabaseContextService {
  constructor(
    @Inject('DATA_SOURCE')
    readonly dataSource: DataSource,
  ) { }

  async getDbStats() {
    const tz = await this.dataSource
      .query('show timezone')
      .then((out) => out?.[0]?.TimeZone ?? out)
      .catch(() => 'err');

    const dt = await this.dataSource
      .query(
        `SELECT NOW(), CURRENT_TIMESTAMP, LOCALTIME,  LOCALTIMESTAMP, transaction_timestamp(), statement_timestamp(), clock_timestamp(), timeofday()`,
      )
      .then((out) => out?.[0] ?? out)
      .catch(() => 'err');

    return {
      tz,
      dt,
    };
  }

  get cidadeRepository() {
    return this.dataSource.getRepository(CidadeEntity);
  }

  get consultaFeriadosRepository() {
    return this.dataSource.getRepository(ConsultaFeriadosEntity);
  }

  get feriadoRepository() {
    return this.dataSource.getRepository(FeriadoEntity);
  }

  get criancaRepository() {
    return this.dataSource.getRepository(CriancaEntity);
  }

  get criterioRepository() {
    return this.dataSource.getRepository(CriteriosEntity).extend({});
  }

  get criteriosRepository() {
    return this.dataSource.getRepository(CriteriosEntity);
  }

  get criteriosConfiguracaoRepository() {
    return this.dataSource.getRepository(CriteriosConfiguracaoEntity);
  }

  get criteriosConfiguracaoCriterioRepository() {
    return this.dataSource.getRepository(CriteriosConfiguracaoCriterioEntity);
  }

  get arquivoRepository() {
    return this.dataSource.getRepository(ArquivoEntity);
  }

  get entrevistaRepository() {
    return this.dataSource.getRepository(EntrevistaEntity);
  }

  get registrarContatoRepository() {
    return this.dataSource.getRepository(RegistrarContatoEntity);
  }

  get registroVagaRepository() {
    return this.dataSource.getRepository(RegistroVagasEntity);
  }

  get escolaRepository() {
    return this.dataSource.getRepository(EscolaEntity);
  }

  get etapaRepository() {
    return this.dataSource.getRepository(EtapaEntity);
  }

  get agendamentoRepository() {
    return this.dataSource.getRepository(AgendamentoEntity);
  }

  get turmaRepository() {
    return this.dataSource.getRepository(TurmaEntity);
  }

  get pessoaRepository() {
    return this.dataSource.getRepository(PessoaEntity);
  }

  get funcionarioRepository() {
    return this.dataSource.getRepository(FuncionarioEntity);
  }

  get vagaRepository() {
    return this.dataSource.getRepository(VagaEntity);
  }

  get reservaVagaRepository() {
    return this.dataSource.getRepository(ReservaVagaEntity);
  }

  get entrevistaMatchCriterioRepository() {
    return this.dataSource.getRepository(EntrevistaMatchCriterioEntity);
  }

  get secretariaMunicipalRepository() {
    return this.dataSource.getRepository(SecretariaMunicipalEntity);
  }

  get filaRepository() {
    return this.dataSource.getRepository(Fila);
  }

  get diaNaoUtilRepository() {
    return this.dataSource.getRepository(DiasNaoUteisEntity);
  }

  get configuracaoRepository() {
    return this.dataSource.getRepository(CriteriosConfiguracaoEntity).extend({
      createQueryBuilderFilterActive(
        qb: SelectQueryBuilder<any>,
        alias = 'configuracao',
      ) {
        if (!qb) {
          qb = this.createQueryBuilder(alias);
        }

        const agora = new Date();

        qb.andWhere(`${alias}.dataVigenciaInicio <= :agoraVigenciaInicio`, {
          agoraVigenciaInicio: agora,
        });

        qb.andWhere(
          new Brackets((qb) => {
            qb.where(`${alias}.dataVigenciaFim IS NULL`).orWhere(
              `${alias}.dataVigenciaFim > :agoraVigenciaFim`,
              { agoraVigenciaFim: agora },
            );
          }),
        );

        return qb;
      },
    });
  }

  get configuracaoCriterioRepository() {
    return this.dataSource
      .getRepository(CriteriosConfiguracaoCriterioEntity)
      .extend({
        createBaseQb() {
          return this.createQueryBuilder('configuracao_criterio')
            .addSelect([
              'configuracao_criterio.id',
              'configuracao_criterio.notaTecnica',
              'configuracao_criterio.posicao',
              'configuracao_criterio.subPosicao',
              'configuracao_criterio.exigirComprovacao',
            ])
            .addOrderBy('configuracao_criterio.posicao', 'ASC')
            .addOrderBy('configuracao_criterio.subPosicao', 'ASC');
        },

        createQueryBuilderForCriteriosConfiguracaoId(
          criteriosConfiguracaoId: string,
          qb: SelectQueryBuilder<any> = this.createQueryBuilder(
            'configuracao_criterio',
          ),
        ) {
          return qb
            .innerJoin('configuracao_criterio.criterio', 'criterio')
            .select([
              'configuracao_criterio.id',
              'configuracao_criterio.notaTecnica',
              'configuracao_criterio.posicao',
              'configuracao_criterio.subPosicao',
              'configuracao_criterio.exigirComprovacao',
              'criterio.id',
              'criterio.nome',
            ])
            .innerJoin(
              'configuracao_criterio.criteriosConfiguracao',
              'configuracao',
            )
            .where('configuracao.id = :criteriosConfiguracaoId', {
              criteriosConfiguracaoId: criteriosConfiguracaoId,
            })
            .addOrderBy('configuracao_criterio.posicao', 'ASC')
            .addOrderBy('configuracao_criterio.subPosicao', 'ASC');
        },

        //

        createQueryBuilderForCriterioId(
          criterioId: string,
          qb: SelectQueryBuilder<any> = this.createQueryBuilder(
            'configuracao_criterio',
          ),
        ) {
          return qb
            .innerJoin('configuracao_criterio.criterio', 'criterio')
            .addSelect(['criterio.id', 'criterio.nome'])
            .where('criterio.id = :criterioId', {
              criterioId: criterioId,
            });
        },
      });
  }

  get filaGeradaRepository() {
    return this.dataSource.getRepository(FilaGeradaEntity).extend({});
  }

  get filaGeradaPosicaoRepository() {
    return this.dataSource.getRepository(FilaGeradaPosicaoEntity).extend({});
  }

  get filaGeradaPosicaoHasEntrevistaMatchCriterioRepository() {
    return this.dataSource
      .getRepository(FilaGeradaPosicaoHasEntrevistaMatchCriterioEntity)
      .extend({});
  }

  get gerenciaAgendamentoRepository() {
    return this.dataSource.getRepository(GerenciaAgendamentoEntity).extend({});
  }

  get externalTceIdentityCpf() {
    return this.dataSource
      .getRepository(ExternalTceIdentityCpfEntity)
      .extend({});
  }

  get integrationAccessToken() {
    return this.dataSource
      .getRepository(IntegrationAccessTokenEntity)
      .extend({});
  }
}
