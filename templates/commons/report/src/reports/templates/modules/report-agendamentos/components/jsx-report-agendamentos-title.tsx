import { has } from "lodash-es";
import { JsxReportSectionTitle } from "../../../components/jsx/section/jsx-report-section-title";
import { ReportAgendamentoType } from "../report-data/report-agendamentos-typings";

const getTitleFromCode = (code: string) => {
  const codeMappings = {
    [ReportAgendamentoType.AGENDAMENTO_POR_PERIODO]: "AGENDAMENTOS POR PERÍODO",
    [ReportAgendamentoType.AGENDAMENTO_ATENDIDO]: "COM ATENDIMENTO",
    [ReportAgendamentoType.AGENDAMENTO_NAO_ATENDIDO]: "SEM ATENDIMENTO",
  };

  if (has(codeMappings, code)) {
    return codeMappings[code];
  }

  return code;
};

export const JsxReportAgendamentosTitle = (props: { type: string }) => {
  const asTitle = getTitleFromCode(props.type);

  return (
    <>
      <JsxReportSectionTitle title={`RELATÓRIO DE AGENDAMENTOS — ${asTitle}`} />
    </>
  );
};
