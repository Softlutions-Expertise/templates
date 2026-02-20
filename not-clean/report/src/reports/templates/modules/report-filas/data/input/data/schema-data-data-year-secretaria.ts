import * as yup from "yup";
import { ReportSchemaGenericGruposPreferenciais } from "../../../../../base/schema-generic-grupos-preferenciais";
import { ReportFilasSchemaDataDataYearSecretariaEscola } from "./schema-data-data-year-secretaria-escola";

export const ReportFilasSchemaDataDataYearSecretaria = yup
  .object({
    secretaria: yup.string(),

    escolas: yup
      .array()
      .of(ReportFilasSchemaDataDataYearSecretariaEscola)
      .required(),

    grupos_preferenciais:
      ReportSchemaGenericGruposPreferenciais.optional().nullable(),
  })
  .required();
