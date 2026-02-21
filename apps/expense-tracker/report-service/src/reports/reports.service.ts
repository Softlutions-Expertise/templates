import { reportsManager } from "./reports-manager";
import { AuditoriaReportInput } from "./templates/modules/auditoria/auditoria-report.types";

// ----------------------------------------------------------------------

export class ReportsService {
  async generateAuditoriaReport(input: AuditoriaReportInput): Promise<string> {
    const module = reportsManager.get("auditoria");
    
    if (!module) {
      throw new Error("Módulo de relatório de auditoria não encontrado");
    }

    const output = await module.renderHtml(input);
    return output.main;
  }
}

// Singleton
export const reportsService = new ReportsService();
