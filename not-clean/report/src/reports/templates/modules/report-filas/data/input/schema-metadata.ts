import { ReportSchemaBaseDataMetadata } from "../../../../base/schema-base";
import { SchemaGenericMetadataEscola } from "../../../../base/schema-generic-metadata-escola";
import { ReportFilasInputSchemaMetadataFilters } from "./schema-metadata-filters";

export const ReportFilasInputSchemaMetadata =
  ReportSchemaBaseDataMetadata.shape({
    escola: SchemaGenericMetadataEscola.optional().nullable(),

    filters: ReportFilasInputSchemaMetadataFilters,
  });
