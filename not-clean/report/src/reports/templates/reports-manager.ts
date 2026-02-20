import { ReportsManager } from "../core/reports-manager";
import { ReportAgendamentosModule } from "./modules/report-agendamentos/report-agendamentos-module";
import { ReportEntrevistasModule } from "./modules/report-entrevistas/report-entrevistas-module";
import { ReportFilasModule } from "./modules/report-filas/report-filas-module";
import { ReportReservasModule } from "./modules/report-reservas/report-reservas-module";
import { ReportVagasModule } from "./modules/report-vagas/report-vagas-module";

const reportsManager = new ReportsManager();

reportsManager.register(new ReportAgendamentosModule());
reportsManager.register(new ReportFilasModule());
reportsManager.register(new ReportVagasModule());
reportsManager.register(new ReportReservasModule());
reportsManager.register(new ReportEntrevistasModule());

export default reportsManager;
