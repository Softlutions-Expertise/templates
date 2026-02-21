import { DataAdapter } from "../../../../../utils/data-adapter";
import { ReportAgendamentosValidateInput } from "./report-agendamentos-input-schema";
import type { ReportAgendamentosAdapterInput } from "./report-agendamentos-typings";

export class ReportAgendamentosDataAdapter extends DataAdapter<ReportAgendamentosAdapterInput> {
  async validateInput(input: unknown) {
    return ReportAgendamentosValidateInput(input);
  }
}
