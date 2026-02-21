import * as yup from "yup";
import { ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurnoEntryFilaPosicao } from "./schema-data-data-year-secretaria-escola-etapa-turno-entry-fila-posicao";

export const ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurno = yup
  .object({
    turno: yup.string(),
    entries: yup
      .array()
      .of(
        ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurnoEntryFilaPosicao,
      )
      .required(),
  })
  .required();
