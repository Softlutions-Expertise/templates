import { ReportSchemaBaseDate } from "@/reports/templates/base/schema-base-date";
import * as yup from "yup";
import { yupAutoBoolean } from "../../../../../../utils/integrations/yup/yup-auto-boolean";
import { ReportSchemaBaseMetadataFiltersFila } from "../../../../base/schema-base-metadata-filters";

export const ReportReservasInputSchemaMetadataFilters =
  ReportSchemaBaseMetadataFiltersFila.shape({
    secretariaMunicipalId: yup.string().required(),
    status: yup.string().nullable(),
    year: yup.string().required(),
    turma: yup.string().nullable(),
    startDateOccupation: ReportSchemaBaseDate().optional(),
    endDateOccupation: ReportSchemaBaseDate().optional(),
    startDateReference: ReportSchemaBaseDate().optional(),
    endDateReference: ReportSchemaBaseDate().optional(),

    anonymizeData: yupAutoBoolean.optional().nullable(),
  }).required();
