import type { InferType } from "yup";
import type { ReportAgendamentosInputSchema } from "./report-agendamentos-input-schema";

// ==========================================
export enum ReportAgendamentoType {
  AGENDAMENTO_POR_PERIODO = "agendamento-por-periodo",
  AGENDAMENTO_ATENDIDO = "agendamento-atendido",
  AGENDAMENTO_NAO_ATENDIDO = "agendamento-nao-atendido",
}
// ==========================================

export type ReportAgendamentosAdapterInput = InferType<
  typeof ReportAgendamentosInputSchema
>;

export type ReportAgendamentosAdapterOutput = ReportAgendamentosAdapterInput;

export type IReportAgendamentosTableRow =
  ReportAgendamentosAdapterOutput["data"]["data"][number];
