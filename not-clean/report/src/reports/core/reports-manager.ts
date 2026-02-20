import type { ReportModuleId } from "../templates/tokens/report-module-id";
import type { BaseReportModule } from "./base-report-module";

export class ReportsManager {
  #reports = new Set<BaseReportModule>();

  register(reporterModule: BaseReportModule) {
    if (this.findById(reporterModule.id)) {
      throw new Error(
        `reporter with the same id already exists (${reporterModule.id}}`,
      );
    }

    this.#reports.add(reporterModule);

    return this;
  }

  findById(id: string | ReportModuleId) {
    for (const report of this.#reports) {
      if (report.id === id) {
        return report;
      }
    }

    return null;
  }

  getAvailableReports() {
    return Array.from(this.#reports).map((report) => report.id);
  }
}
