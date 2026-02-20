import * as yup from "yup";

export const ReportSchemaBaseMetadataFiltersFila = yup.object({
  secretariaMunicipalId: yup.string().required(),
  year: yup.string().required(),

  unidadeEscolarId: yup.string().optional(),
  etapaId: yup.string().optional(),
  turn: yup.string().optional(),
});
