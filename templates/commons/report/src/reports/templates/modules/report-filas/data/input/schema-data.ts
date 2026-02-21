import * as yup from "yup";
import { ReportFilasSchemaDataData } from "./data/schema-data-data";

export const ReportFilasInputSchemaData = yup.object({
  data: yup.array().of(ReportFilasSchemaDataData).required(),
  count: yup.number(),
});
