import { JsxReportHeaderToggles } from "../../../components/jsx/report-header/toggles/jsx-report-header-toggles";
import type { IJsxReportVagasProps } from "./jsx-report-vagas";

type Props = Pick<IJsxReportVagasProps, "payload">;

const TOGGLE_LABELS = {
  ANONYMIZE_DATA: "Informações pessoais anonimizadas.",
};

export const JsxReportVagasToggles = (props: Props) => {
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
