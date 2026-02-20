import * as yup from "yup";
import { ReportSchemaBaseDataMetadata } from "../../../../base/schema-base";
import { ReportReservasInputSchemaMetadataFilters } from "./schema-metadata-filters";

export const ReportReservasInputSchemaMetadata =
  ReportSchemaBaseDataMetadata.shape({
    filters: ReportReservasInputSchemaMetadataFilters,

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
