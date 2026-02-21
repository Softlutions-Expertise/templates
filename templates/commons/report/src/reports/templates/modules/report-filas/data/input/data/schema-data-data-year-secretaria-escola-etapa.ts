import * as yup from "yup";
import { ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurno } from "./schema-data-data-year-secretaria-escola-etapa-turno";

export const ReportFilasSchemaDataDataYearSecretariaEscolaEtapa = yup
  .object({
    etapa: yup.string(),
    apelido: yup.string(),
    turnos: yup
      .array()
      .of(ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurno)
      .required(),
  })
  .required();
