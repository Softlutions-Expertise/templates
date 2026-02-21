import { useMemo } from "react";
import { JsxReportPageBreak } from "../../../../components/jsx/layout/jsx-report-page-break";
import { JsxReportSectionBlocks } from "../../../../components/jsx/section/jsx-report-section-blocks";
import type { IJsxReportFilasProps } from "../jsx-report-filas";
import { JsxReportFilasEntryYearSecretariaEscolaEtapaTurnoTable } from "./jsx-report-filas-entry-year-secretaria-escola-etapa-turno-table";
import type {
  IYearEntry,
  IYearSecretariaEntry,
  IYearSecretariaEscolaEntry,
  IYearSecretariaEscolaEtapaEntry,
  IYearSecretariaEscolaEtapaTurnoEntry,
} from "./typings/typings";

type Props = Pick<IJsxReportFilasProps, "payload"> & {
  yearEntry: IYearEntry;
  secretariaEntry: IYearSecretariaEntry;
  escolaEntry: IYearSecretariaEscolaEntry;
  etapaEntry: IYearSecretariaEscolaEtapaEntry;
  turnoEntry: IYearSecretariaEscolaEtapaTurnoEntry;
};

export const JsxReportFilasEntryYearSecretariaEscolaEtapaTurno = (
  props: Props,
) => {
  const {
    payload,
    yearEntry,
    secretariaEntry,
    escolaEntry,
    etapaEntry,
    turnoEntry,
  } = props;

  const entries = useMemo(() => {
    return turnoEntry.entries.map((entry) => ({
      entry,
    }));
  }, [turnoEntry.entries]);

  return (
    <div>
      <JsxReportSectionBlocks
        blocks={[
          { value: yearEntry.year },
          { value: secretariaEntry.secretaria, expand: true },
          { value: escolaEntry.escola, expand: true },
          { value: etapaEntry.apelido ?? etapaEntry.etapa },
          { value: turnoEntry.turno },
        ]}
      />

      <JsxReportFilasEntryYearSecretariaEscolaEtapaTurnoTable
        entries={entries}
        context={{
          yearSecretaria: secretariaEntry,
          anonymize: payload.metadata.filters.anonymizeData,
          viewPrefferedGroups: payload.metadata.filters.viewPreferredGroups,
        }}
      />

      {payload.metadata.filters.oneLinePerPage && <JsxReportPageBreak after />}
    </div>
  );
};
