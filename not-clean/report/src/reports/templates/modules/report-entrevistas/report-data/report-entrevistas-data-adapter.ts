import { DataAdapter } from "../../../../../utils/data-adapter";
import { ReportAgendamentosValidateInput } from "./report-entrevistas-input-schema";
import type { ReportEntrevistasAdapterInput } from "./report-entrevistas-typings";

export class ReportEntrevistasDataAdapter extends DataAdapter<ReportEntrevistasAdapterInput> {
  async validateInput(input: unknown) {
    return ReportAgendamentosValidateInput(input);
  }
}
