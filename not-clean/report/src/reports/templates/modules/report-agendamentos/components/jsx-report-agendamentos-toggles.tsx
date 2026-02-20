import { JsxReportHeaderToggles } from "../../../components/jsx/report-header/toggles/jsx-report-header-toggles";
import { IJsxReportAgendamentosProps } from "./jsx-report-agendamentos";

type Props = Pick<IJsxReportAgendamentosProps, "payload">;

const TOGGLE_LABELS = {
  ANONYMIZE_DATA: "Informações pessoais anonimizadas.",
};

export const JsxReportAgendamentosToggles = (props: Props) => {
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
