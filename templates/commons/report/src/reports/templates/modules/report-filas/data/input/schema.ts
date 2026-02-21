import { ReportSchemaBaseData } from "../../../../base/schema-base";
import { ReportFilasInputSchemaData } from "./schema-data";
import { ReportFilasInputSchemaMetadata } from "./schema-metadata";

export const ReportFilasInputSchema = ReportSchemaBaseData.shape({
  metadata: ReportFilasInputSchemaMetadata,
  data: ReportFilasInputSchemaData,
});
