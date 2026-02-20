import { DataAdapter } from "../../../../../utils/data-adapter";
import { ReportVagasValidateInput } from "./input/schema";
import type { IReportVagasAdapterInput } from "./report-vagas-typings";

export class ReportVagasDataAdapter extends DataAdapter<IReportVagasAdapterInput> {
  async validateInput(input: unknown) {
    return ReportVagasValidateInput(input);
  }
}
