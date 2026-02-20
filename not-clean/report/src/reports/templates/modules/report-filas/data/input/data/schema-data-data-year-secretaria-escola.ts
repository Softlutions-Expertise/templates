import * as yup from "yup";
import { ReportFilasSchemaDataDataYearSecretariaEscolaEtapa } from "./schema-data-data-year-secretaria-escola-etapa";

export const ReportFilasSchemaDataDataYearSecretariaEscola = yup
  .object({
    escola: yup.string(),
    etapas: yup
      .array()
      .of(ReportFilasSchemaDataDataYearSecretariaEscolaEtapa)
      .required(),
  })
  .required();
