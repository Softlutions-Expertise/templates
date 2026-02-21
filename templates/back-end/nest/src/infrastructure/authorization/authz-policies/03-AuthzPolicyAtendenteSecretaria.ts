import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { NivelAcesso } from '../../../modules/pessoa/entities/enums/pessoa.enum';
import { BaseAuthzPolicy } from './BaseAuthzPolicy';
import { prepareServidorFilterRelatedSecretaria } from './common/prepareServidorFilterRelated';

const FORCE_RELATED = true;

@Injectable()
export class AuthzPolicyAtendenteSecretaria extends BaseAuthzPolicy {
  name = 'authz-policy::atendente-secretaria';

  constructor() {
    super();

    this.setStatements(
      {
        feriadoRead: true,

        agendamentoCreate: true,

        agendamentoRead: async (context) => {
          const currentFuncionario = context.currentFuncionario;
          const funcionarioSecretariasIds = currentFuncionario.secretarias.map(
            (s) => s.id,
          );

          return (qb) => {
            qb.innerJoin(
              'agendamento.secretariaMunicipal',
              'POL_ATD_SEC__secretaria',
            );
            qb.where(
              'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              {
                funcionarioSecretariasIds,
              },
            );
          };
        },

        agendamentoUpdate: true,
        agendamentoDelete: true,

        secretariaCreate: false,

        secretariaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioSecretariasIds =
                context.currentFuncionario.secretarias.map((s) => s.id);
              qb.where('secretaria.id IN (:...funcionarioSecretariasIds)', {
                funcionarioSecretariasIds,
              });
            } else {
              qb.where('TRUE');
            }
          };
        },

        secretariaUpdate: false,
        secretariaDelete: false,
        //
        escolaCreate: false,

        escolaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioSecretariasIds =
                context.currentFuncionario.secretarias.map((s) => s.id);
              qb.innerJoin(
                'escola.secretariaMunicipal',
                'POL_ATD_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        escolaUpdate: false,
        escolaDelete: false,
        //

        secretariaCriteriosRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioSecretariasIds =
                context.currentFuncionario.secretarias.map((s) => s.id);
              qb.andWhere('secretaria.id IN (:...funcionarioSecretariasIds)', {
                funcionarioSecretariasIds,
              });
            } else {
              qb.where('TRUE');
            }
          };
        },

        secretariaCriteriosChange: false,

        //

        secretariaGerenciaAgendamentoRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioSecretariasIds =
                context.currentFuncionario.secretarias.map((s) => s.id);
              qb.andWhere('secretaria.id IN (:...funcionarioSecretariasIds)', {
                funcionarioSecretariasIds,
              });
            } else {
              qb.where('TRUE');
            }
          };
        },

        secretariaGerenciaAgendamentoUpdate: false,

        //

        servidorCreate: false,

        servidorRead: async (context) => {
          const funcionarioSecretariasIds =
            context.currentFuncionario.secretarias.map((s) => s.id);
          return prepareServidorFilterRelatedSecretaria(
            funcionarioSecretariasIds,
          );
        },

        servidorUpdate: async (context) => {
          const funcionario = context.currentFuncionario;
          const idFuncionario = funcionario.id;
          const dto = context.dto;
          const mesmoNivel =
            !dto?.nivelAcesso ||
            dto?.nivelAcesso === NivelAcesso.AtendenteSecretaria;
          const funcionarioSecretariasIds = funcionario.secretarias.map(
            (s) => s.id,
          );
          // Se o DTO não informar instituição ou se o id informado constar entre os vínculos:
          const mesmaInstuicao =
            !dto?.secretarias ||
            dto.secretarias.some((secretaria) =>
              funcionarioSecretariasIds.includes(secretaria.id),
            );

          if (mesmoNivel && mesmaInstuicao) {
            return (qb) => {
              qb.where('funcionario.id = :idFuncionario', { idFuncionario });
            };
          }

          return (qb) => {
            qb.where('FALSE');
          };
        },

        servidorDelete: false,

        //

        turmaCreate: false,

        turmaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              const funcionarioSecretariasIds =
                context.currentFuncionario.secretarias.map((s) => s.id);
              qb.innerJoin('turma.escola', 'POL_ATD_SEC__escola');
              qb.innerJoin(
                'POL_ATD_SEC__escola.secretariaMunicipal',
                'POL_ATD_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        turmaUpdate: false,
        turmaDelete: false,

        criterioCreate: false,

        criterioRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              const funcionarioSecretariasIds =
                context.currentFuncionario.secretarias.map((s) => s.id);
              qb.innerJoin(
                'criterio.secretariaMunicipal',
                'POL_ATD_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        criterioUpdate: false,
        criterioDelete: false,
        //
        registroVagaCreate: false,
        registroVagaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              const funcionarioSecretariasIds =
                context.currentFuncionario.secretarias.map((s) => s.id);
              qb.innerJoin('registro_vaga.escola', 'POL_ATD_SEC__escola');
              qb.innerJoin(
                'POL_ATD_SEC__escola.secretariaMunicipal',
                'POL_ATD_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        vagaCreate: false,

        vagaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              const funcionarioSecretariasIds =
                context.currentFuncionario.secretarias.map((s) => s.id);
              qb.innerJoin('vaga.escola', 'POL_ATD_SEC__escola');
              qb.innerJoin(
                'POL_ATD_SEC__escola.secretariaMunicipal',
                'POL_ATD_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        vagaUpdate: false,
        vagaDelete: false,
        //
        criancaCreate: true,
        criancaRead: true,
        criancaUpdate: true,
        criancaDelete: true,
        //
        entrevistaCreate: true,

        entrevistaRead: async (context) => {
          return (qb) => {
            qb.where('FALSE');
            const currentFuncionario = context.currentFuncionario;
            const funcionarioSecretariasIds =
              currentFuncionario.secretarias.map((s) => s.id);
            qb.innerJoin(
              'entrevista.secretariaMunicipal',
              'POL_ATD_SEC__secretariaMunicipal',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ATD_SEC__preferenciaUnidade1',
            );
            qb.leftJoin(
              'POL_ATD_SEC__preferenciaUnidade1.secretariaMunicipal',
              'POL_ATD_SEC__secretariaMunicipal1',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ATD_SEC__preferenciaUnidade2',
            );
            qb.leftJoin(
              'POL_ATD_SEC__preferenciaUnidade2.secretariaMunicipal',
              'POL_ATD_SEC__secretariaMunicipal2',
            );
            qb.where(
              new Brackets((qb) => {
                qb.where(
                  'POL_ATD_SEC__secretariaMunicipal.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ATD_SEC__secretariaMunicipal1.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ATD_SEC__secretariaMunicipal2.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              }),
            );
          };
        },

        entrevistaUpdate: async (context) => {
          return (qb) => {
            qb.where('FALSE');
            const currentFuncionario = context.currentFuncionario;
            const funcionarioSecretariasIds =
              currentFuncionario.secretarias.map((s) => s.id);
            qb.innerJoin(
              'entrevista.secretariaMunicipal',
              'POL_ATD_SEC__secretariaMunicipal',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ATD_SEC__preferenciaUnidade1',
            );
            qb.leftJoin(
              'POL_ATD_SEC__preferenciaUnidade1.secretariaMunicipal',
              'POL_ATD_SEC__secretariaMunicipal1',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ATD_SEC__preferenciaUnidade2',
            );
            qb.leftJoin(
              'POL_ATD_SEC__preferenciaUnidade2.secretariaMunicipal',
              'POL_ATD_SEC__secretariaMunicipal2',
            );
            qb.where(
              new Brackets((qb) => {
                qb.where(
                  'POL_ATD_SEC__secretariaMunicipal.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ATD_SEC__secretariaMunicipal1.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ATD_SEC__secretariaMunicipal2.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              }),
            );
          };
        },

        entrevistaDelete: async (context) => {
          return (qb) => {
            qb.where('FALSE');
            const currentFuncionario = context.currentFuncionario;
            const funcionarioSecretariasIds =
              currentFuncionario.secretarias.map((s) => s.id);
            qb.innerJoin(
              'entrevista.secretariaMunicipal',
              'POL_ATD_SEC__secretariaMunicipal',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ATD_SEC__preferenciaUnidade1',
            );
            qb.leftJoin(
              'POL_ATD_SEC__preferenciaUnidade1.secretariaMunicipal',
              'POL_ATD_SEC__secretariaMunicipal1',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ATD_SEC__preferenciaUnidade2',
            );
            qb.leftJoin(
              'POL_ATD_SEC__preferenciaUnidade2.secretariaMunicipal',
              'POL_ATD_SEC__secretariaMunicipal2',
            );
            qb.where(
              new Brackets((qb) => {
                qb.where(
                  'POL_ATD_SEC__secretariaMunicipal.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ATD_SEC__secretariaMunicipal1.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ATD_SEC__secretariaMunicipal2.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              }),
            );
          };
        },

        //
        registroContatoCreate: true,
        registroContatoRead: true,
        registroContatoUpdate: true,
        registroContatoDelete: true,
        //
        reservaVagaRead: async (context) => {
          return (qb) => {
            const currentFuncionario = context.currentFuncionario;
            const funcionarioSecretariasIds =
              currentFuncionario.secretarias.map((s) => s.id);
            qb.innerJoin('reserva_vaga.vaga', 'POL_ATD_SEC__vaga');
            qb.innerJoin('POL_ATD_SEC__vaga.escola', 'POL_ATD_SEC__escola');
            qb.innerJoin(
              'POL_ATD_SEC__escola.secretariaMunicipal',
              'POL_ATD_SEC__secretaria',
            );
            qb.where(
              'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        reservaVagaCreate: async (context) => {
          const currentFuncionario = context.currentFuncionario;
          const funcionarioSecretariasIds = currentFuncionario.secretarias.map(
            (s) => s.id,
          );
          const qb =
            context.databaseContextService.vagaRepository.createQueryBuilder(
              'vaga',
            );
          qb.innerJoin('vaga.escola', 'POL_ATD_SEC__escola');
          qb.innerJoin(
            'POL_ATD_SEC__escola.secretariaMunicipal',
            'POL_ATD_SEC__secretaria',
          );
          qb.where(
            'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
            { funcionarioSecretariasIds },
          );
          qb.andWhere('vaga.id = :vagaId', { vagaId: context.dto.vaga.id });
          const exists = await qb.getExists();
          return exists;
        },

        reservaVagaUpdate: async (context) => {
          return (qb) => {
            const currentFuncionario = context.currentFuncionario;
            const funcionarioSecretariasIds =
              currentFuncionario.secretarias.map((s) => s.id);
            qb.innerJoin('reserva_vaga.vaga', 'POL_ATD_SEC__vaga');
            qb.innerJoin('POL_ATD_SEC__vaga.escola', 'POL_ATD_SEC__escola');
            qb.innerJoin(
              'POL_ATD_SEC__escola.secretariaMunicipal',
              'POL_ATD_SEC__secretaria',
            );
            qb.where(
              'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        reservaVagaUpdateStatus: false,

        reservaVagaDelete: async (context) => {
          return (qb) => {
            const currentFuncionario = context.currentFuncionario;
            const funcionarioSecretariasIds =
              currentFuncionario.secretarias.map((s) => s.id);
            qb.innerJoin('reserva_vaga.vaga', 'POL_ATD_SEC__vaga');
            qb.innerJoin('POL_ATD_SEC__vaga.escola', 'POL_ATD_SEC__escola');
            qb.innerJoin(
              'POL_ATD_SEC__escola.secretariaMunicipal',
              'POL_ATD_SEC__secretaria',
            );
            qb.where(
              'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },
        arquivoRead: true,
        //
        filaRead: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds =
              context.currentFuncionario.secretarias.map((s) => s.id);
            qb.leftJoin('fila.escola', 'POL_ATD_SEC__escola');
            qb.leftJoin(
              'POL_ATD_SEC__escola.secretariaMunicipal',
              'POL_ATD_SEC__secretaria',
            );
            qb.where(
              'POL_ATD_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        etapaRead: true,

        reportContext: async (context) => {
          const dto = context.dto;
          if (!dto.secretariaMunicipal) {
            return false;
          }
          const funcionarioSecretariasIds =
            context.currentFuncionario.secretarias.map((s) => s.id);
          return funcionarioSecretariasIds.includes(dto.secretariaMunicipal);
        },

        enderecoContext: true,
      },
      {
        agendamento: {
          calendario: true,
          gerenciar: false,
          consultar: true,
        },

        entrevista: {
          entrevistar: true,
          consultar: true,
        },

        criterios: {
          gerenciar: false,
          consultar: true,
        },

        consulta: {
          secretaria: false,
          escola: true,
          turma: true,
          vaga: true,
          reservaVaga: true,
          crianca: true,
          servidor: true,
        },

        cadastro: {
          secretaria: false,
          escola: false,
          turma: false,
          vaga: false,
          crianca: true,
          servidor: false,
        },

        reservaVaga: {
          updateStatus: false,
        },

        fila: {
          itemReservarVaga: true,
          itemFazerContato: true,
        },

        report: true,
      },
    );
  }
}
