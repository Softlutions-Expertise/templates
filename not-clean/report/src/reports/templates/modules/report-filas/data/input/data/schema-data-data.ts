import * as yup from "yup";
import { ReportFilasSchemaDataDataYearSecretaria } from "./schema-data-data-year-secretaria";

export const ReportFilasSchemaDataData = yup
  .object({
    year: yup.string(),
    secretarias: yup
      .array()
      .of(ReportFilasSchemaDataDataYearSecretaria)
      .required(),
  })
  .required();
