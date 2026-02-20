import { yupSafeValidate } from "../../../../../../utils/integrations/yup/yup-safe-validate";
import { ReportSchemaBaseData } from "../../../../base/schema-base";
import { ReportVagasInputSchemaData } from "./schema-data";
import { ReportVagasInputSchemaMetadata } from "./schema-metadata";

export const ReportVagasInputSchema = ReportSchemaBaseData.shape({
  metadata: ReportVagasInputSchemaMetadata,
  data: ReportVagasInputSchemaData,
});

export const ReportVagasValidateInput = (input: unknown) => {
  return yupSafeValidate(ReportVagasInputSchema, input);
};
