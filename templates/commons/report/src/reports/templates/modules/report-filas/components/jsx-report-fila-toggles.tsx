import { JsxReportHeaderToggles } from "../../../components/jsx/report-header/toggles/jsx-report-header-toggles";
import type { IJsxReportFilasProps } from "./jsx-report-filas";

type Props = Pick<IJsxReportFilasProps, "payload">;

const TOGGLE_LABELS = {
  ONE_LINE_PER_PAGE: "Mostrando apenas uma fila por página.",

  LINE_PER_VACANCY: "Busca rápida cadastros em fila com vagas livres..",

  VIEW_PREFERRED_GROUPS:
    "Incluindo informações sobre os grupos preferenciais das secretarias municipais.",

  ANONYMIZE_DATA: "Informações pessoais anonimizadas.",
};

export const JsxReportFilaToggles = (props: Props) => {
  const { payload } = props;

  return (
    <>
      <JsxReportHeaderToggles
        toggles={[
          {
            activeLabel: TOGGLE_LABELS.ONE_LINE_PER_PAGE,
            value: payload.metadata.filters.oneLinePerPage,
          },
          {
            activeLabel: TOGGLE_LABELS.LINE_PER_VACANCY,
            value: payload.metadata.filters.linePerVacancy,
          },
          {
            activeLabel: TOGGLE_LABELS.VIEW_PREFERRED_GROUPS,
            value: payload.metadata.filters.viewPreferredGroups,
          },
          {
            activeLabel: TOGGLE_LABELS.ANONYMIZE_DATA,
            value: payload.metadata.filters.anonymizeData,
          },
        ]}
      />
    </>
  );
};
