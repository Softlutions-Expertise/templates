import { yupSafeValidate } from "../../../../../../utils/integrations/yup/yup-safe-validate";
import { ReportSchemaBaseData } from "../../../../base/schema-base";
import { ReportReservasInputSchemaData } from "./schema-data";
import { ReportReservasInputSchemaMetadata } from "./schema-metadata";

export const ReportReservasInputSchema = ReportSchemaBaseData.shape({
  metadata: ReportReservasInputSchemaMetadata,
  data: ReportReservasInputSchemaData,
});

export const ReportReservasValidateInput = (input: unknown) => {
  return yupSafeValidate(ReportReservasInputSchema, input);
};
