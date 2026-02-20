import type { IJsxReportFilasProps } from "../jsx-report-filas";
import { JsxReportFilasEntryYearSecretariaEscolaEtapaTurno } from "./jsx-report-filas-entry-year-secretaria-escola-etapa-turno";
import type {
  IYearEntry,
  IYearSecretariaEntry,
  IYearSecretariaEscolaEntry,
  IYearSecretariaEscolaEtapaEntry,
} from "./typings/typings";

type IJsxReportFilasEntryYearSecretariaEscolaProps = Pick<
  IJsxReportFilasProps,
  "payload"
> & {
  yearEntry: IYearEntry;
  secretariaEntry: IYearSecretariaEntry;
  escolaEntry: IYearSecretariaEscolaEntry;
  etapaEntry: IYearSecretariaEscolaEtapaEntry;
};

export const JsxReportFilasEntryYearSecretariaEscolaEtapa = (
  props: IJsxReportFilasEntryYearSecretariaEscolaProps,
) => {
  const { etapaEntry } = props;

  return (
    <>
      {etapaEntry.turnos?.map((turnoEntry) => (
        <JsxReportFilasEntryYearSecretariaEscolaEtapaTurno
          key={etapaEntry.etapa}
          {...props}
          turnoEntry={turnoEntry}
        />
      ))}
    </>
  );
};
