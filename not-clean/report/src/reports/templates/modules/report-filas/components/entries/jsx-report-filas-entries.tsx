import type { IJsxReportFilasProps } from "../jsx-report-filas";
import { JsxReportFilasEntryYear } from "./jsx-report-filas-entry-year";

type JsxReportFilasEntriesProps = Pick<IJsxReportFilasProps, "payload">;

export const JsxReportFilasEntries = (props: JsxReportFilasEntriesProps) => {
  const {
    payload,
    payload: {
      data: { data: entries },
    },
  } = props;

  return (
    <>
      {entries?.map((yearEntry) => (
        <JsxReportFilasEntryYear
          key={yearEntry.year}
          payload={payload}
          yearEntry={yearEntry}
        />
      ))}
    </>
  );
};
