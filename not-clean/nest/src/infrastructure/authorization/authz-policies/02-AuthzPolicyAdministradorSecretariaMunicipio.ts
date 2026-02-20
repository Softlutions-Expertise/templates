import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import {
  NivelAcesso,
  TipoVinculoInstituicao,
} from '../../../modules/pessoa/entities/enums/pessoa.enum';
import { BaseAuthzPolicy } from './BaseAuthzPolicy';
import { prepareServidorFilterRelatedSecretaria } from './common/prepareServidorFilterRelated';

const TURMA_MANAGE = true;
const FORCE_RELATED = true;

@Injectable()
export class AuthzPolicyAdministradorSecretariaMunicipio extends BaseAuthzPolicy {
  name = 'authz-policy::administrador-secretaria-municipio';

  constructor() {
    super();

    this.setStatements(
      {
        feriadoRead: true,

        agendamentoCreate: true,

        agendamentoRead: async (context) => {
          const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
            (secretaria) => secretaria.id,
          );

          return (qb) => {
            qb.innerJoin(
              'agendamento.secretariaMunicipal',
              'POL_ADM_SEC__secretaria',
            );
            qb.where(
              'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        agendamentoUpdate: true,
        agendamentoDelete: true,

        secretariaCreate: false,

        secretariaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                (secretaria) => secretaria.id,
              );
              qb.where(
                'secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        secretariaUpdate: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            qb.where(
              'secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        secretariaDelete: false,

        escolaCreate: async (context) => {
          const dto = context.dto;
          const currentFuncionario = context.currentFuncionario;
          if (
            dto &&
            currentFuncionario &&
            currentFuncionario.tipoVinculo === TipoVinculoInstituicao.SecretariaMunicipal
          ) {
            // Verifica se o id da secretaria do DTO está entre as secretarias vinculadas
            return currentFuncionario.secretarias.some(
              (secretaria) => secretaria.id === dto.secretariaMunicipal.id,
            );
          }
          return false;
        },

        escolaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                (secretaria) => secretaria.id,
              );
              qb.innerJoin(
                'escola.secretariaMunicipal',
                'POL_ADM_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        escolaUpdate: async (context) => {
          const dto = context.dto;
          const dtoSecretariaMunicipalId = dto?.secretariaMunicipal?.id ?? null;
          const currentFuncionario = context.currentFuncionario;
          const funcionarioSecretariasIds = currentFuncionario.secretarias.map(
            (secretaria) => secretaria.id,
          );
          if (
            dto &&
            dtoSecretariaMunicipalId !== null &&
            !funcionarioSecretariasIds.includes(dtoSecretariaMunicipalId)
          ) {
            return (qb) => {
              qb.where('FALSE');
            };
          }
          return (qb) => {
            qb.innerJoin(
              'escola.secretariaMunicipal',
              'POL_ADM_SEC__secretaria',
            );
            qb.where(
              'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        escolaDelete: async (context) => {
          const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
            (secretaria) => secretaria.id,
          );
          return (qb) => {
            qb.innerJoin(
              'escola.secretariaMunicipal',
              'POL_ADM_SEC__secretaria',
            );
            qb.where(
              'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        secretariaCriteriosRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                (secretaria) => secretaria.id,
              );
              qb.andWhere(
                'secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        secretariaCriteriosChange: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            qb.andWhere(
              'secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        secretariaGerenciaAgendamentoRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                (secretaria) => secretaria.id,
              );
              qb.andWhere(
                'secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        secretariaGerenciaAgendamentoUpdate: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            qb.andWhere(
              'secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        servidorCreate: async (context) => {
          const dto = context.dto;
          const currentFuncionario = context.currentFuncionario;
          const funcionarioSecretariasIds = currentFuncionario.secretarias.map(
            (secretaria) => secretaria.id,
          );
          if (dto) {
            switch (dto.nivelAcesso) {
              case NivelAcesso.AtendenteSecretaria: {
                // Verifica se o id da secretaria do DTO está entre os vínculos do funcionário
                return currentFuncionario.secretarias.some(secretaria =>
                  dto.secretarias.some(dtoSecretaria => dtoSecretaria.id === secretaria.id)
                );
                
              }
              case NivelAcesso.GestorCreche: {
                const escolaQb =
                  context.acessoControl.getQueryBuilderForFilterAction('escola:read');
                const exists = await escolaQb
                  .innerJoin(
                  'escola.secretariaMunicipal',
                  'POL_ADM_SEC__secretaria',
                  )
                  .andWhere(
                  'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                  )
                  .andWhere('escola.id IN (:...escolaIds)', {
                  escolaIds: dto.unidadesEscolares.map(escola => escola.id),
                  })
                  .getExists();
                return exists;
              }
              case NivelAcesso.Administrador:
              case NivelAcesso.AdministradorMunicipal:
              case NivelAcesso.Defensoria:
              default: {
                return false;
              }
            }
          }
          return false;
        },

        servidorRead: async (context) => {
          const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
            (secretaria) => secretaria.id,
          );
          return prepareServidorFilterRelatedSecretaria(funcionarioSecretariasIds);
        },
 
        servidorUpdate: async (context) => {
          const currentFuncionario = context.currentFuncionario;
          const funcionarioSecretariasIds = currentFuncionario.secretarias.map(
            (secretaria) => secretaria.id,
          );
          const dto = context.dto;
          if (dto?.nivelAcesso) {
            switch (dto.nivelAcesso) {
              case NivelAcesso.AtendenteSecretaria: {
                if (
                  !currentFuncionario.secretarias.some(
                    (secretaria) => dto.secretarias.some(dtoSecretaria => dtoSecretaria.id === secretaria.id)
                  )
                ) {
                  return (qb) => {
                    qb.where('FALSE');
                  };
                }
                break;
              }
              case NivelAcesso.GestorCreche: {
                const escolaQb =
                  context.acessoControl.getQueryBuilderForFilterAction('escola:read');
                const exists = await escolaQb
                  .innerJoin(
                    'escola.secretariaMunicipal',
                    'POL_ADM_SEC__secretaria',
                  )
                  .andWhere(
                    'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                    { funcionarioSecretariasIds },
                  )
                  .andWhere('escola.id IN (:...escolaIds)', {
                    escolaIds: dto.unidadesEscolares.map(escola => escola.id),
                  })
                  .getExists();
                if (!exists) {
                  return (qb) => {
                    qb.where('FALSE');
                  };
                }
                break;
              }
              case NivelAcesso.AdministradorMunicipal: {
                return (qb) => {
                  qb.where('funcionario.id = :funcionarioId', {
                    funcionarioId: currentFuncionario.id,
                  });
                };
              }
              case NivelAcesso.Administrador:
              case NivelAcesso.Defensoria:
              default: {
                return (qb) => {
                  qb.where('FALSE');
                };
              }
            }
          }
          return prepareServidorFilterRelatedSecretaria(funcionarioSecretariasIds);
        },

        servidorDelete: async (context) => {
          const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
            (secretaria) => secretaria.id,
          );
          return prepareServidorFilterRelatedSecretaria(
            funcionarioSecretariasIds,
            context.currentFuncionario.id,
          );
        },

        turmaCreate: TURMA_MANAGE
          ? async (context) => {
              const dto = context.dto;
              const currentFuncionario = context.currentFuncionario;
              if (
                dto &&
                currentFuncionario &&
                currentFuncionario.tipoVinculo === TipoVinculoInstituicao.SecretariaMunicipal
              ) {
                return await context.checkCanReachTarget(
                  'escola:update',
                  null,
                  dto.escola.id,
                );
              }
              return false;
            }
          : false,

        turmaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                (secretaria) => secretaria.id,
              );
              qb.innerJoin('turma.escola', 'POL_ADM_SEC__escola');
              qb.innerJoin(
                'POL_ADM_SEC__escola.secretariaMunicipal',
                'POL_ADM_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        turmaUpdate: TURMA_MANAGE
          ? async (context) => {
              const dto = context.dto;
              const dtoEscolaId = dto?.escola?.id ?? null;
              if (dtoEscolaId !== null) {
                const canUpdateEscola = await context.checkCanReachTarget(
                  'escola:update',
                  null,
                  dtoEscolaId,
                );
                if (!canUpdateEscola) {
                  return (qb) => {
                    qb.where('FALSE');
                  };
                }
              }
              return (qb) => {
                const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                  (secretaria) => secretaria.id,
                );
                qb.innerJoin('turma.escola', 'POL_ADM_SEC__escola');
                qb.innerJoin(
                  'POL_ADM_SEC__escola.secretariaMunicipal',
                  'POL_ADM_SEC__secretaria',
                );
                qb.where(
                  'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              };
            }
          : false,

        turmaDelete: TURMA_MANAGE
          ? async (context) => {
              return (qb) => {
                const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                  (secretaria) => secretaria.id,
                );
                qb.innerJoin('turma.escola', 'POL_ADM_SEC__escola');
                qb.innerJoin(
                  'POL_ADM_SEC__escola.secretariaMunicipal',
                  'POL_ADM_SEC__secretaria',
                );
                qb.where(
                  'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              };
            }
          : false,

        criterioCreate: async (context) => {
          const dto = context.dto;
          const currentFuncionario = context.currentFuncionario;
          if (
            dto &&
            currentFuncionario &&
            currentFuncionario.tipoVinculo === TipoVinculoInstituicao.SecretariaMunicipal
          ) {
            return currentFuncionario.secretarias.some(
              (secretaria) => secretaria.id === dto.secretariaMunicipal.id,
            );
          }
          return false;
        },

        criterioRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                (secretaria) => secretaria.id,
              );
              qb.innerJoin(
                'criterio.secretariaMunicipal',
                'POL_ADM_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        criterioUpdate: async (context) => {
          const dto = context.dto;
          const dtoSecretariaMunicipalId = dto?.secretariaMunicipal?.id ?? null;
          const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
            (secretaria) => secretaria.id,
          );
          if (
            dto &&
            dtoSecretariaMunicipalId !== null &&
            !funcionarioSecretariasIds.includes(dtoSecretariaMunicipalId)
          ) {
            return (qb) => {
              qb.where('FALSE');
            };
          }
          return (qb) => {
            qb.innerJoin(
              'criterio.secretariaMunicipal',
              'POL_ADM_SEC__secretaria',
            );
            qb.where(
              'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        criterioDelete: async (context) => {
          const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
            (secretaria) => secretaria.id,
          );
          return (qb) => {
            qb.innerJoin(
              'criterio.secretariaMunicipal',
              'POL_ADM_SEC__secretaria',
            );
            qb.where(
              'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        registroVagaCreate: TURMA_MANAGE
          ? async (context) => {
              const dto = context.dto;
              const currentFuncionario = context.currentFuncionario;
              if (
                dto &&
                currentFuncionario &&
                currentFuncionario.tipoVinculo === TipoVinculoInstituicao.SecretariaMunicipal
              ) {
                return await context.checkCanReachTarget(
                  'turma:update',
                  null,
                  dto.turma.id,
                );
              }
              return false;
            }
          : false,

        registroVagaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                (secretaria) => secretaria.id,
              );
              qb.innerJoin(
                'registro_vaga.escola',
                'POL_ADM_SEC__escola',
              );
              qb.innerJoin(
                'POL_ADM_SEC__escola.secretariaMunicipal',
                'POL_ADM_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        vagaCreate: TURMA_MANAGE
          ? async (context) => {
              const dto = context.dto;
              const currentFuncionario = context.currentFuncionario;
              if (
                dto &&
                currentFuncionario &&
                currentFuncionario.tipoVinculo === TipoVinculoInstituicao.SecretariaMunicipal
              ) {
                return await context.checkCanReachTarget(
                  'turma:update',
                  null,
                  dto.turma.id,
                );
              }
              return false;
            }
          : false,

        vagaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                (secretaria) => secretaria.id,
              );
              qb.innerJoin('vaga.escola', 'POL_ADM_SEC__escola');
              qb.innerJoin(
                'POL_ADM_SEC__escola.secretariaMunicipal',
                'POL_ADM_SEC__secretaria',
              );
              qb.andWhere(
                'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                { funcionarioSecretariasIds },
              );
            } else {
              qb.where('TRUE');
            }
          };
        },

        vagaUpdate: TURMA_MANAGE
          ? async (context) => {
              const dto = context.dto;
              const dtoTurmaId = dto?.turma?.id ?? null;
              if (dtoTurmaId !== null) {
                const canUpdateTurma = await context.checkCanReachTarget(
                  'turma:update',
                  null,
                  dtoTurmaId,
                );
                if (!canUpdateTurma) {
                  return (qb) => {
                    qb.where('FALSE');
                  };
                }
              }
              return (qb) => {
                const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                  (secretaria) => secretaria.id,
                );
                qb.innerJoin('vaga.escola', 'POL_ADM_SEC__escola');
                qb.innerJoin(
                  'POL_ADM_SEC__escola.secretariaMunicipal',
                  'POL_ADM_SEC__secretaria',
                );
                qb.where(
                  'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              };
            }
          : false,

        vagaDelete: TURMA_MANAGE
          ? async (context) => {
              return (qb) => {
                const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
                  (secretaria) => secretaria.id,
                );
                qb.innerJoin('vaga.escola', 'POL_ADM_SEC__escola');
                qb.innerJoin(
                  'POL_ADM_SEC__escola.secretariaMunicipal',
                  'POL_ADM_SEC__secretaria',
                );
                qb.where(
                  'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              };
            }
          : false,

        criancaCreate: true,
        criancaRead: true,
        criancaUpdate: true,
        criancaDelete: true,

        entrevistaCreate: true,

        entrevistaRead: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            // Mesmo que o "qb.where('FALSE')" seja mantido conforme a lógica original,
            // o join a seguir permitirá filtrar pelas secretarias vinculadas.
            qb.where('FALSE');
            qb.innerJoin(
              'entrevista.secretariaMunicipal',
              'POL_ADM_SEC__secretariaMunicipal',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ADM_SEC__preferenciaUnidade1',
            );
            qb.leftJoin(
              'POL_ADM_SEC__preferenciaUnidade1.secretariaMunicipal',
              'POL_ADM_SEC__secretariaMunicipal1',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ADM_SEC__preferenciaUnidade2',
            );
            qb.leftJoin(
              'POL_ADM_SEC__preferenciaUnidade2.secretariaMunicipal',
              'POL_ADM_SEC__secretariaMunicipal2',
            );
            qb.where(
              new Brackets((qb) => {
                qb.where(
                  'POL_ADM_SEC__secretariaMunicipal.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ADM_SEC__secretariaMunicipal1.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ADM_SEC__secretariaMunicipal2.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              }),
            );
          };
        },

        entrevistaUpdate: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            qb.where('FALSE');
            qb.innerJoin(
              'entrevista.secretariaMunicipal',
              'POL_ADM_SEC__secretariaMunicipal',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ADM_SEC__preferenciaUnidade1',
            );
            qb.leftJoin(
              'POL_ADM_SEC__preferenciaUnidade1.secretariaMunicipal',
              'POL_ADM_SEC__secretariaMunicipal1',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ADM_SEC__preferenciaUnidade2',
            );
            qb.leftJoin(
              'POL_ADM_SEC__preferenciaUnidade2.secretariaMunicipal',
              'POL_ADM_SEC__secretariaMunicipal2',
            );
            qb.where(
              new Brackets((qb) => {
                qb.where(
                  'POL_ADM_SEC__secretariaMunicipal.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ADM_SEC__secretariaMunicipal1.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ADM_SEC__secretariaMunicipal2.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              }),
            );
          };
        },

        entrevistaDelete: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            qb.where('FALSE');
            qb.innerJoin(
              'entrevista.secretariaMunicipal',
              'POL_ADM_SEC__secretariaMunicipal',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ADM_SEC__preferenciaUnidade1',
            );
            qb.leftJoin(
              'POL_ADM_SEC__preferenciaUnidade1.secretariaMunicipal',
              'POL_ADM_SEC__secretariaMunicipal1',
            );
            qb.leftJoin(
              'entrevista.preferenciaUnidade',
              'POL_ADM_SEC__preferenciaUnidade2',
            );
            qb.leftJoin(
              'POL_ADM_SEC__preferenciaUnidade2.secretariaMunicipal',
              'POL_ADM_SEC__secretariaMunicipal2',
            );
            qb.where(
              new Brackets((qb) => {
                qb.where(
                  'POL_ADM_SEC__secretariaMunicipal.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ADM_SEC__secretariaMunicipal1.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
                qb.orWhere(
                  'POL_ADM_SEC__secretariaMunicipal2.id IN (:...funcionarioSecretariasIds)',
                  { funcionarioSecretariasIds },
                );
              }),
            );
          };
        },

        registroContatoCreate: true,
        registroContatoRead: true,
        registroContatoUpdate: true,
        registroContatoDelete: true,

        reservaVagaRead: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
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
            (secretaria) => secretaria.id,
          );
          const qb =
            context.databaseContextService.vagaRepository.createQueryBuilder(
              'vaga',
            );
          qb.innerJoin('vaga.escola', 'POL_ADM_SEC__escola');
          qb.innerJoin(
            'POL_ADM_SEC__escola.secretariaMunicipal',
            'POL_ADM_SEC__secretaria',
          );
          qb.where(
            'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
            { funcionarioSecretariasIds },
          );
          qb.andWhere('vaga.id = :vagaId', {
            vagaId: context.dto.vaga.id,
          });
          const exists = await qb.getExists();
          return exists;
        },

        reservaVagaUpdate: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            qb.innerJoin('reserva_vaga.vaga', 'POL_ADM_SEC__vaga');
            qb.innerJoin('POL_ADM_SEC__vaga.escola', 'POL_ADM_SEC__escola');
            qb.innerJoin(
              'POL_ADM_SEC__escola.secretariaMunicipal',
              'POL_ADM_SEC__secretaria',
            );
            qb.where(
              'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        reservaVagaUpdateStatus: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            qb.innerJoin('reserva_vaga.vaga', 'POL_ADM_SEC__vaga');
            qb.innerJoin('POL_ADM_SEC__vaga.escola', 'POL_ADM_SEC__escola');
            qb.innerJoin(
              'POL_ADM_SEC__escola.secretariaMunicipal',
              'POL_ADM_SEC__secretaria',
            );
            qb.where(
              'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        reservaVagaDelete: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            qb.innerJoin('reserva_vaga.vaga', 'POL_ADM_SEC__vaga');
            qb.innerJoin('POL_ADM_SEC__vaga.escola', 'POL_ADM_SEC__escola');
            qb.innerJoin(
              'POL_ADM_SEC__escola.secretariaMunicipal',
              'POL_ADM_SEC__secretaria',
            );
            qb.where(
              'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
              { funcionarioSecretariasIds },
            );
          };
        },

        arquivoRead: true,

        filaRead: async (context) => {
          return (qb) => {
            const funcionarioSecretariasIds = context.currentFuncionario.secretarias.map(
              (secretaria) => secretaria.id,
            );
            qb.leftJoin('fila.escola', 'POL_ADM_SEC__escola');
            qb.leftJoin(
              'POL_ADM_SEC__escola.secretariaMunicipal',
              'POL_ADM_SEC__secretaria',
            );
            qb.where(
              'POL_ADM_SEC__secretaria.id IN (:...funcionarioSecretariasIds)',
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
          return context.currentFuncionario.secretarias.some(
            (secretaria) => secretaria.id === dto.secretariaMunicipal
          );
        },

        enderecoContext: true,
      },
      {
        agendamento: {
          calendario: true,
          gerenciar: true,
          consultar: true,
        },

        entrevista: {
          entrevistar: true,
          consultar: true,
        },

        criterios: {
          gerenciar: true,
          consultar: true,
        },

        consulta: {
          secretaria: true,
          escola: true,
          turma: true,
          vaga: true,
          reservaVaga: true,
          crianca: true,
          servidor: true,
        },

        cadastro: {
          secretaria: false,
          escola: true,
          turma: TURMA_MANAGE,
          vaga: TURMA_MANAGE,
          crianca: true,
          servidor: true,
        },

        reservaVaga: {
          updateStatus: true,
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
