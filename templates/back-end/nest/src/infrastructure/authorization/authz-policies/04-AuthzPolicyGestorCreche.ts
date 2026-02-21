import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import {
  NivelAcesso,
  TipoVinculoInstituicao,
} from '../../../modules/pessoa/entities/enums/pessoa.enum';
import { BaseAuthzPolicy } from './BaseAuthzPolicy';
import { prepareServidorFilterRelatedUnidadeEscolar } from './common/prepareServidorFilterRelated';

const FORCE_RELATED = true;

@Injectable()
export class AuthzPolicyGestorCreche extends BaseAuthzPolicy {
  name = 'authz-policy::gestor-creche';

  constructor() {
    super();
    this.setStatements(
      {
        feriadoRead: true,

        agendamentoCreate: true,
        agendamentoRead: false,
        agendamentoUpdate: true,
        agendamentoDelete: true,

        secretariaCreate: false,

        secretariaRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
                (escola) => escola.id,
              );
              qb.innerJoin('secretaria.unidadesEscolares', 'POL_GES_CRE__escola');
              qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
                funcionarioEscolasIds,
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
              const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
                (escola) => escola.id,
              );
              qb.where('escola.id IN (:...funcionarioEscolasIds)', {
                funcionarioEscolasIds,
              });
            } else {
              qb.where('TRUE');
            }
          };
        },

        escolaUpdate: async (context) => {
          // Aqui assumimos que o funcionário pode estar vinculado a várias escolas.
          const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
            (escola) => escola.id,
          );
          return (qb) => {
            qb.andWhere('escola.id IN (:...funcionarioEscolasIds)', {
              funcionarioEscolasIds,
            });
          };
        },

        escolaDelete: false,

        //

        secretariaCriteriosRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile) {
              const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
                (escola) => escola.id,
              );
              qb.innerJoin('secretaria.escolas', 'POL_GES_CRE__escola');
              qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
                funcionarioEscolasIds,
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
              const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
                (escola) => escola.id,
              );
              qb.innerJoin('secretaria.escolas', 'POL_GES_CRE__escola');
              qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
                funcionarioEscolasIds,
              });
            } else {
              qb.where('TRUE');
            }
          };
        },

        secretariaGerenciaAgendamentoUpdate: false,

        //
        servidorCreate: async (context) => {
          const dto = context.dto;
          const currentFuncionario = context.currentFuncionario;
          // Para Gestor Creche, com vínculo por escola, compara se o ID da escola informado no DTO
          // está entre as escolas vinculadas ao funcionário.
          const funcionarioEscolasIds = currentFuncionario.unidadesEscolares.map(
            (escola) => escola.id,
          );
          const dtoEscolasIds = dto?.unidadesEscolares?.map((escola) => escola.id);
          if (dto) {
            switch (dto.nivelAcesso) {
              case NivelAcesso.GestorCreche: {
                return dtoEscolasIds.every((escolaId) => funcionarioEscolasIds.includes(escolaId));
              }
              case NivelAcesso.Administrador:
              case NivelAcesso.AdministradorMunicipal:
              case NivelAcesso.Defensoria:
              case NivelAcesso.AtendenteSecretaria:
              default: {
                return false;
              }
            }
          }
          return false;
        },

        servidorRead: async (context) => {
          const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
            (escola) => escola.id,
          );
          return prepareServidorFilterRelatedUnidadeEscolar(funcionarioEscolasIds);
        },

        servidorUpdate: async (context) => {
          const funcionario = context.currentFuncionario;
          const dto = context.dto;
          const funcionarioEscolasIds = funcionario.unidadesEscolares.map(
            (escola) => escola.id,
          );
          if (dto?.nivelAcesso) {
            switch (dto.nivelAcesso) {
              case NivelAcesso.GestorCreche: {
                const escolaQb = context.acessoControl.getQueryBuilderForFilterAction(
                  'escola:read',
                );
                const exists = await escolaQb
                  .andWhere('escola.id IN (:...escolasIds)', 
                    { escolasIds: dto.unidadesEscolares.map((e) => e.id)
                  })
                  .getExists();
                if (!exists || !dto.unidadesEscolares.every(e => funcionarioEscolasIds.includes(e.id))) {
                  return (qb) => {
                    qb.where('FALSE');
                  };
                }
                break;
              }
              case NivelAcesso.Administrador:
              case NivelAcesso.Defensoria:
              case NivelAcesso.AdministradorMunicipal:
              case NivelAcesso.AtendenteSecretaria:
              default: {
                return (qb) => {
                  qb.where('FALSE');
                };
              }
            }
          }
          return prepareServidorFilterRelatedUnidadeEscolar(funcionarioEscolasIds);
        },

        servidorDelete: async (context) => {
          const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
            (escola) => escola.id,
          );
          return prepareServidorFilterRelatedUnidadeEscolar(
            funcionarioEscolasIds,
            context.currentFuncionario.id,
          );
        },

        //

        turmaCreate: async (context) => {
          const currentFuncionario = context.currentFuncionario;
          const dto = context.dto;
          const dtoEscolaId = dto?.escola?.id;
          const funcionarioEscolasIds = currentFuncionario?.unidadesEscolares.map(
            (escola) => escola.id,
          );
          if (
            dtoEscolaId &&
            currentFuncionario &&
            currentFuncionario.tipoVinculo === TipoVinculoInstituicao.UnidadeEscolar
          ) {
            return funcionarioEscolasIds.includes(dtoEscolaId);
          }
          return false;
        },

        turmaRead: async (context) => {
          const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
            (escola) => escola.id,
          );
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              qb.innerJoin('turma.escola', 'POL_02_ADM_SEC__escola');
              qb.andWhere('POL_02_ADM_SEC__escola.id IN (:...funcionarioEscolasIds)', {
                funcionarioEscolasIds,
              });
            } else {
              qb.where('TRUE');
            }
          };
        },

        turmaUpdate: async (context) => {
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
            const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.innerJoin('turma.escola', 'POL_GES_CRE__escola');
            qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
              funcionarioEscolasIds,
            });
          };
        },

        turmaDelete: async (context) => {
          return (qb) => {
            qb.where('FALSE');
            const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.innerJoin('turma.escola', 'POL_GES_CRE__escola');
            qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
              funcionarioEscolasIds,
            });
          };
        },

        //
        criterioCreate: false,

        criterioRead: async (context) => {
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
                (escola) => escola.id,
              );
              qb.innerJoin('criterio.secretariaMunicipal', 'POL_GES_CRE__secretaria');
              qb.innerJoin('POL_GES_CRE__secretaria.escolas', 'POL_GES_CRE__escola');
              qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
                funcionarioEscolasIds,
              });
            } else {
              qb.where('TRUE');
            }
          };
        },

        criterioUpdate: false,
        criterioDelete: false,

        //

        registroVagaCreate: async (context) => {
          const currentFuncionario = context.currentFuncionario;
          const dto = context.dto;
          const dtoEscolaId = dto?.escola?.id;
          const funcionarioEscolasIds = currentFuncionario?.unidadesEscolares.map(
            (escola) => escola.id,
          );
          if (
            dtoEscolaId &&
            currentFuncionario &&
            currentFuncionario.tipoVinculo === TipoVinculoInstituicao.UnidadeEscolar
          ) {
            return funcionarioEscolasIds.includes(dtoEscolaId);
          }
          return false;
        },

        registroVagaRead: async (context) => {
          const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
            (escola) => escola.id,
          );
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              qb.innerJoin('registro_vaga.escola', 'POL_02_ADM_SEC__escola');
              qb.andWhere('POL_02_ADM_SEC__escola.id IN (:...funcionarioEscolasIds)', {
                funcionarioEscolasIds,
              });
            } else {
              qb.where('TRUE');
            }
          };
        },

        vagaCreate: async (context) => {
          const currentFuncionario = context.currentFuncionario;
          const dto = context.dto;
          const dtoEscolaId = dto?.escola?.id;
          const funcionarioEscolasIds = currentFuncionario?.unidadesEscolares.map(
            (escola) => escola.id,
          );
          if (
            dtoEscolaId &&
            currentFuncionario &&
            currentFuncionario.tipoVinculo === TipoVinculoInstituicao.UnidadeEscolar
          ) {
            return funcionarioEscolasIds.includes(dtoEscolaId);
          }
          return false;
        },

        vagaRead: async (context) => {
          const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
            (escola) => escola.id,
          );
          return (qb) => {
            if (context.populateOnlyRelatedWithProfile || FORCE_RELATED) {
              qb.innerJoin('vaga.escola', 'POL_02_ADM_SEC__escola');
              qb.andWhere('POL_02_ADM_SEC__escola.id IN (:...funcionarioEscolasIds)', {
                funcionarioEscolasIds,
              });
            } else {
              qb.where('TRUE');
            }
          };
        },

        vagaUpdate: async (context) => {
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
            qb.where('FALSE');
            const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.innerJoin('vaga.escola', 'POL_GES_CRE__escola');
            qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
              funcionarioEscolasIds,
            });
          };
        },

        vagaDelete: async (context) => {
          return (qb) => {
            qb.where('FALSE');
            const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.innerJoin('vaga.escola', 'POL_GES_CRE__escola');
            qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
              funcionarioEscolasIds,
            });
          };
        },

        //

        criancaCreate: false,
        criancaRead: true,
        criancaUpdate: false,
        criancaDelete: false,

        //
        entrevistaCreate: false,

        entrevistaRead: async (context) => {
          return (qb) => {
            qb.where('FALSE');
            const currentFuncionario = context.currentFuncionario;
            const funcionarioEscolasIds = currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.leftJoin('entrevista.preferenciaUnidade', 'POL_GES_CRE__preferenciaUnidade1');
            qb.leftJoin('entrevista.preferenciaUnidade', 'POL_GES_CRE__preferenciaUnidade2');
            qb.where(
              new Brackets((qb) => {
                qb.where('POL_GES_CRE__preferenciaUnidade1.id IN (:...funcionarioEscolasIds)', {
                  funcionarioEscolasIds,
                });
                qb.orWhere('POL_GES_CRE__preferenciaUnidade2.id IN (:...funcionarioEscolasIds)', {
                  funcionarioEscolasIds,
                });
              }),
            );
          };
        },

        entrevistaUpdate: false,
        entrevistaDelete: false,
        //
        registroContatoCreate: false,
        registroContatoRead: async (context) => {
          return (qb) => {
            const currentFuncionario = context.currentFuncionario;
            const funcionarioEscolasIds = currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.innerJoin('registro_contato.entrevista', 'POL_GES_CRE__entrevista');
            qb.leftJoin('POL_GES_CRE__entrevista.preferenciaUnidade', 'POL_GES_CRE__preferenciaUnidade1');
            qb.leftJoin('POL_GES_CRE__entrevista.preferenciaUnidade', 'POL_GES_CRE__preferenciaUnidade2');
            qb.where(
              new Brackets((qb) => {
                qb.where('POL_GES_CRE__preferenciaUnidade1.id IN (:...funcionarioEscolasIds)', {
                  funcionarioEscolasIds,
                });
                qb.orWhere('POL_GES_CRE__preferenciaUnidade2.id IN (:...funcionarioEscolasIds)', {
                  funcionarioEscolasIds,
                });
              }),
            );
          };
        },
        registroContatoUpdate: false,
        registroContatoDelete: false,
        //
        reservaVagaCreate: false,

        reservaVagaRead: async (context) => {
          return (qb) => {
            const currentFuncionario = context.currentFuncionario;
            const funcionarioEscolasIds = currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.innerJoin('reserva_vaga.vaga', 'POL_GES_CRE__vaga');
            qb.innerJoin('POL_GES_CRE__vaga.escola', 'POL_GES_CRE__escola');
            qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
              funcionarioEscolasIds,
            });
          };
        },

        reservaVagaUpdate: async (context) => {
          return (qb) => {
            const currentFuncionario = context.currentFuncionario;
            const funcionarioEscolasIds = currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.innerJoin('reserva_vaga.vaga', 'POL_GES_CRE__vaga');
            qb.innerJoin('POL_GES_CRE__vaga.escola', 'POL_GES_CRE__escola');
            qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
              funcionarioEscolasIds,
            });
          };
        },

        reservaVagaUpdateStatus: async (context) => {
          return (qb) => {
            const currentFuncionario = context.currentFuncionario;
            const funcionarioEscolasIds = currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.innerJoin('reserva_vaga.vaga', 'POL_GES_CRE__vaga');
            qb.innerJoin('POL_GES_CRE__vaga.escola', 'POL_GES_CRE__escola');
            qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
              funcionarioEscolasIds,
            });
          };
        },

        reservaVagaDelete: false,
        //
        arquivoRead: true,
        //
        filaRead: async (context) => {
          return (qb) => {
            // Se necessário, pode-se remover o "qb.where('FALSE')" se houver outra lógica
            qb.where('FALSE');
            const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
              (escola) => escola.id,
            );
            qb.innerJoin('fila.escola', 'POL_GES_CRE__escola');
            qb.where('POL_GES_CRE__escola.id IN (:...funcionarioEscolasIds)', {
              funcionarioEscolasIds,
            });
          };
        },

        etapaRead: true,

        reportContext: async (context) => {
          const dto = context.dto;
          if (!dto.unidadeEscolar) {
            return false;
          }
          const funcionarioEscolasIds = context.currentFuncionario.unidadesEscolares.map(
            (escola) => escola.id,
          );
          return funcionarioEscolasIds.includes(dto.unidadeEscolar);
        },

        enderecoContext: true,
      },
      {
        agendamento: {
          calendario: false,
          gerenciar: false,
          consultar: false,
        },

        entrevista: {
          entrevistar: false,
          consultar: false,
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
          crianca: false,
          servidor: true,
        },
        cadastro: {
          secretaria: false,
          escola: false,
          turma: true,
          vaga: true,
          crianca: false,
          servidor: true,
        },

        reservaVaga: {
          updateStatus: true,
        },

        fila: {
          itemReservarVaga: false,
          itemFazerContato: false,
        },

        report: true,
      },
    );
  }
}
