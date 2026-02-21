import * as yup from "yup";
import { ReportSchemaBaseDataMetadata } from "../../../../base/schema-base";
import { ReportVagasInputSchemaMetadataFilters } from "./schema-metadata-filters";

export const ReportVagasInputSchemaMetadata =
  ReportSchemaBaseDataMetadata.shape({
    filters: ReportVagasInputSchemaMetadataFilters,

    escola: yup
      .object({
        nomeFantasia: yup.string(),
      })
      .optional()
      .nullable(),

    turma: yup
      .object({
        nome: yup.string(),
      })
      .optional()
      .nullable(),
  });
