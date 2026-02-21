import type { IJsxReportFilasProps } from "../jsx-report-filas";
import { JsxReportFilasEntryYearSecretaria } from "./jsx-report-filas-entry-year-secretaria";
import type { IYearEntry } from "./typings/typings";

type JsxReportFilasEntryYearProps = Pick<IJsxReportFilasProps, "payload"> & {
  yearEntry: IYearEntry;
};

export const JsxReportFilasEntryYear = (
  props: JsxReportFilasEntryYearProps,
) => {
  const { payload, yearEntry } = props;

  return (
    <>
      {yearEntry.secretarias?.map((secretariaEntry) => (
        <JsxReportFilasEntryYearSecretaria
          key={secretariaEntry.secretaria}
          payload={payload}
          secretariaEntry={secretariaEntry}
          yearEntry={yearEntry}
        />
      ))}
    </>
  );
};
