import * as yup from "yup";

export type IReportFilasSchemaDataDataYearSecretariaGruposPreferenciais =
  yup.InferType<
    typeof ReportFilasSchemaDataDataYearSecretariaGruposPreferenciais
  >;

export const ReportFilasSchemaDataDataYearSecretariaGruposPreferenciais = yup
  .object({
    posicao: yup.number().required(),
    subPosicao: yup.number().nullable().optional(),
    exigirComprovacao: yup.bool().required(),
    criterio: yup.string().required(),
  })
  .required();
