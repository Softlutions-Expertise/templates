import { BaseReportModule } from "./core/base-report-module";
import {
  AuditoriaReportModule,
  REPORT_AUDITORIA_MODULE_ID,
} from "./templates/modules/auditoria/auditoria-report-module";

// ----------------------------------------------------------------------

export class ReportsManager {
  private modules: Map<string, BaseReportModule> = new Map();

  constructor() {
    // Registrar módulos de relatório
    this.register(new AuditoriaReportModule());
  }

  register(module: BaseReportModule): void {
    this.modules.set(module.id, module);
  }

  get(moduleId: string): BaseReportModule | undefined {
    return this.modules.get(moduleId);
  }

  has(moduleId: string): boolean {
    return this.modules.has(moduleId);
  }

  list(): string[] {
    return Array.from(this.modules.keys());
  }
}

// Singleton
export const reportsManager = new ReportsManager();
