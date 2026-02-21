import { DataAdapter } from "../../../../../utils/data-adapter";
import { ReportFilasInputValidate } from "./input/validate";
import type { IReportFilasAdapterInput } from "./report-filas-typings";

export class ReportFilasDataAdapter extends DataAdapter<IReportFilasAdapterInput> {
  async validateInput(input: unknown) {
    return ReportFilasInputValidate(input);
  }
}
