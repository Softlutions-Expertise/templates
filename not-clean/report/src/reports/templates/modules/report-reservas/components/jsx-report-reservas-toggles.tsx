import { JsxReportHeaderToggles } from "../../../components/jsx/report-header/toggles/jsx-report-header-toggles";
import { IJsxReportReservasProps } from "./jsx-report-reservas";

type Props = Pick<IJsxReportReservasProps, "payload">;

const TOGGLE_LABELS = {
  ANONYMIZE_DATA: "Informações pessoais anonimizadas.",
};

export const JsxReportReservasToggles = (props: Props) => {
  const { payload } = props;

  return (
    <>
      <JsxReportHeaderToggles
        toggles={[
          {
            activeLabel: TOGGLE_LABELS.ANONYMIZE_DATA,
            value: payload.metadata.filters.anonymizeData,
          },
        ]}
      />
    </>
  );
};
