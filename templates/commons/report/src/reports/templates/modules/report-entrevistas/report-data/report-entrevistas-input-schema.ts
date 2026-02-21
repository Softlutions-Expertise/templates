import * as yup from "yup";
import { yupAutoBoolean } from "../../../../../utils/integrations/yup/yup-auto-boolean";
import { yupSafeValidate } from "../../../../../utils/integrations/yup/yup-safe-validate";
import {
  ReportSchemaBaseData,
  ReportSchemaBaseDataMetadata,
} from "../../../base/schema-base";
import { ReportSchemaGenericGruposPreferenciais } from "../../../base/schema-generic-grupos-preferenciais";
import { SchemaGenericMetadataEscola } from "../../../base/schema-generic-metadata-escola";

const filterSchema = yup.object().shape({
  // required string UUID
  secretariaMunicipalId: yup
    .string()
    .uuid("Deve ser um UUID válido")
    .required("secretariaMunicipalId é obrigatório"),

  // optional string UUID
  entrevistadorId: yup
    .string()
    .uuid("Deve ser um UUID válido")
    .optional()
    .nullable(),

  // optional ISO date strings (YYYY‑MM‑DD)
  startDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido, use YYYY-MM-DD")
    .optional()
    .nullable(),
  endDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido, use YYYY-MM-DD")
    .optional()
    .nullable(),

  // optional time strings (HH:MM)
  startTime: yup
    .string()
    .matches(/^\d{2}:\d{2}$/, "Formato de hora inválido, use HH:MM")
    .optional()
    .nullable(),
  endTime: yup
    .string()
    .matches(/^\d{2}:\d{2}$/, "Formato de hora inválido, use HH:MM")
    .optional()
    .nullable(),

  // optional enum strings
  responsibleType: yup
    .string()
    .oneOf(["Pai", "Mãe", "Outro"], "Deve ser Pai, Mãe ou Outro")
    .optional()
    .nullable(),

  // required string
  year: yup.string().required("year é obrigatório"),

  // optional string UUID
  unidadeEscolarId: yup
    .string()
    .uuid("Deve ser um UUID válido")
    .optional()
    .nullable(),

  // optional string
  etapaId: yup.string().optional().nullable(),

  // optional enum
  turn: yup
    .string()
    .oneOf(["Matutino", "Vespertino", "Integral"], "Turno inválido")
    .optional()
    .nullable(),

  // optional boolean
  brotherSchool: yupAutoBoolean.optional().nullable().default(null),

  // optional numbers
  startMembersAddress: yup.string().optional().nullable(),
  endMembersAddress: yup.string().optional().nullable(),
  startMembersFamilyIncome: yup.string().optional().nullable(),
  endMembersFamilyIncome: yup.string().optional().nullable(),
  startFamilyIncome: yup.string().optional().nullable(),
  endFamilyIncome: yup.string().optional().nullable(),

  // optional enum
  vacancy: yup
    .string()
    .oneOf(
      ["Todos", "Aguardando Vaga", "Vaga Concedida"],
      "Valor de vacancy inválido"
    )
    .optional()
    .nullable(),

  situation: yup
    .string()
    .oneOf(
      ["Todos", "Elegível Para Fila", "Fora da Fila de Espera", "Transferida", "Aguardando Transferência"],
      "Valor de situation inválido"
    )
    .optional()
    .nullable(),

  // optional array of arrays
  preferredGroups: yup.string().optional().nullable(),

  entrevistador: yup
    .object()
    .shape({
      nome: yup.string(),
    })
    .nullable()
    .optional(),

  criterios: yup
    .array()
    .of(
      yup
        .object({
          id: yup.string().required(),
          nome: yup.string().required(),
        })
        .required()
        .nonNullable()
    )
    .nullable()
    .optional(),

  // optional enum
  filterPreferredGroups: yup
    .string()
    .oneOf(
      ["Possui ao menos 1 da seleção", "Possui todos da seleção"],
      "Valor de filterPreferredGroups inválido"
    )
    .optional()
    .nullable(),

  // optional boolean
  anonymizeData: yupAutoBoolean.optional().nullable(),
});

export const ReportEntrevistasInputSchema = ReportSchemaBaseData.shape({
  metadata: ReportSchemaBaseDataMetadata.shape({
    filters: filterSchema.required(),

    etapa: yup
      .object()
      .shape({
        id: yup.number(),
        nome: yup.string(),
      })
      .nullable()
      .optional(),

    escola: SchemaGenericMetadataEscola.optional().nullable(),
  }),

  data: yup.object().shape({
    data: yup
      .array()
      .of(
        yup.object().shape({
          year: yup.string().required(),

          secretarias: yup
            .array()
            .of(
              yup
                .object()
                .shape({
                  secretaria: yup.string().required(),
                  grupos_preferenciais:
                    ReportSchemaGenericGruposPreferenciais.required(),
                  entrevistas: yup
                    .array()
                    .of(
                      yup
                        .object()
                        .shape({
                          crianca: yup
                            .object()
                            .shape({
                              id: yup.string().required(),
                              nome: yup.string().required(),
                              cpf: yup.string().required(),
                            })
                            .required(),

                          responsavel: yup
                            .object()
                            .shape({
                              tipo: yup.string().required(),
                              nome: yup.string().required(),
                              cpf: yup.string().required(),
                            })
                            .required(),

                          entrevistador: yup
                            .object()
                            .shape({
                              id: yup.string().required(),
                              nome: yup.string().required(),
                            })
                            .required(),

                          ano_letivo: yup.string().required(),
                          data_entrevista: yup.string().required(),
                          horario_entrevista: yup.string().required(),

                          preferencia_unidade: yup
                            .object()
                            .shape({
                              id: yup.string().required(),
                              nome_fantasia: yup.string().required(),
                              irmao_unidade: yupAutoBoolean.required(),
                              elegivel_para_fila: yupAutoBoolean.required(),
                            })
                            .required(),

                          preferencia_unidade2: yup
                            .object()
                            .shape({
                              id: yup.string().optional().nullable(),
                              nome_fantasia: yup.string().optional().nullable(),
                              irmao_unidade: yupAutoBoolean.required(),
                              elegivel_para_fila: yupAutoBoolean.required(),
                            })
                            .optional()
                            .nullable(),

                          etapa: yup.string().required(),
                          apelido: yup.string().optional(),

                          preferencia_turno: yup.string().required(),
                          preferencia_turno2: yup
                            .string()
                            .optional()
                            .nullable(),

                          membros_endereco: yup.number().optional().nullable(),
                          membros_contribuintes_renda: yup
                            .number()
                            .optional()
                            .nullable(),

                          valor_renda_familiar: yup.string().nullable(),

                          /** Vaga Concedida */
                          situacao: yup.string().required(),

                          /** Elegível Para Fila */
                          elegivelParaFila: yup.string().required(),

                          criterios: yup
                            .array()
                            .of(
                              yup.object().shape({
                                posicao: yup.number().required(),
                                subPosicao: yup.number().nullable(),
                              })
                            )
                            .required(),
                        })
                        .required()
                    )
                    .required(),
                })
                .required()
            )
            .required(),
        })
      )
      .required(),

    count: yup.number(),
  }),
});

export const ReportAgendamentosValidateInput = (input: unknown) => {
  return yupSafeValidate(ReportEntrevistasInputSchema, input);
};
