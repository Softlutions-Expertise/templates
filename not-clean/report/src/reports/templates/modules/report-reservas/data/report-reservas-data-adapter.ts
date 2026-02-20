import { DataAdapter } from "../../../../../utils/data-adapter";
import { ReportReservasValidateInput } from "./input/schema";
import type { IReportReservasAdapterInput } from "./report-reservas-typings";

export class ReportReservasDataAdapter extends DataAdapter<IReportReservasAdapterInput> {
  async validateInput(input: unknown) {
    return ReportReservasValidateInput(input);
  }
}
