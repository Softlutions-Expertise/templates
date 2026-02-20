import * as yup from "yup";
import { yupAutoBoolean } from "../../../../../../utils/integrations/yup/yup-auto-boolean";
import { ReportSchemaBaseDate } from "../../../../base/schema-base-date";
import { ReportSchemaBaseMetadataFiltersFila } from "../../../../base/schema-base-metadata-filters";
import { ReportVagasType } from "../report-vagas-typings";

export const ReportVagasInputSchemaMetadataFilters =
  ReportSchemaBaseMetadataFiltersFila.shape({
    type: yup.string().required().oneOf(Object.values(ReportVagasType)),

    turmaId: yup.string().optional().nullable(),
    

    startDateRegistration: ReportSchemaBaseDate().optional(),
    endDateRegistration: ReportSchemaBaseDate().optional(),
    startDateOccupation: ReportSchemaBaseDate().optional(),
    endDateOccupation: ReportSchemaBaseDate().optional(),

    anonymizeData: yupAutoBoolean.optional(),
  }).required();
