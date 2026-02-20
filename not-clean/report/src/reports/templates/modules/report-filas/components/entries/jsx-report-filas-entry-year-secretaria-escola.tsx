import type { IJsxReportFilasProps } from "../jsx-report-filas";
import { JsxReportFilasEntryYearSecretariaEscolaEtapa } from "./jsx-report-filas-entry-year-secretaria-escola-etapa";
import type {
  IYearEntry,
  IYearSecretariaEntry,
  IYearSecretariaEscolaEntry,
} from "./typings/typings";

type IJsxReportFilasEntryYearSecretariaEscolaProps = Pick<
  IJsxReportFilasProps,
  "payload"
> & {
  yearEntry: IYearEntry;
  secretariaEntry: IYearSecretariaEntry;
  escolaEntry: IYearSecretariaEscolaEntry;
};

export const JsxReportFilasEntryYearSecretariaEscola = (
  props: IJsxReportFilasEntryYearSecretariaEscolaProps,
) => {
  const { escolaEntry } = props;

  return (
    <>
      {escolaEntry.etapas?.map((etapaEntry) => (
        <JsxReportFilasEntryYearSecretariaEscolaEtapa
          key={etapaEntry.etapa}
          {...props}
          etapaEntry={etapaEntry}
        />
      ))}
    </>
  );
};
