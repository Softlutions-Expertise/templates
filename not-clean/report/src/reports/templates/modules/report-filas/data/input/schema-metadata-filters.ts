import * as yup from "yup";
import { yupAutoBoolean } from "../../../../../../utils/integrations/yup/yup-auto-boolean";
import { ReportSchemaBaseDate } from "../../../../base/schema-base-date";
import { ReportSchemaBaseMetadataFiltersFila } from "../../../../base/schema-base-metadata-filters";

export const ReportFilasInputSchemaMetadataFilters =
  ReportSchemaBaseMetadataFiltersFila.shape({
    startPosition: yup.string().optional(),
    endPosition: yup.string().optional(),

    startEntryDate: ReportSchemaBaseDate().optional(),
    endEntryDate: ReportSchemaBaseDate().optional(),
    startDayStay: ReportSchemaBaseDate().optional(),
    endDayStay: ReportSchemaBaseDate().optional(),

    lastContactResult: yup.mixed().optional(),

    linePerVacancy: yupAutoBoolean.optional(),
    oneLinePerPage: yupAutoBoolean.optional(),
    viewPreferredGroups: yupAutoBoolean.optional(),
    anonymizeData: yupAutoBoolean.optional(),
  });
