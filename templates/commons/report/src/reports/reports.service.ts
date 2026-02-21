import type { IGenerateReportRequestBody } from "../api/app/modules/generate-report/generate-report.typings";
import { logger } from "../utils/logger";
import type { BaseReportModule } from "./core/base-report-module";
import reportsManager from "./templates/reports-manager";

export async function getAvailableReports(): Promise<string[]> {
  const availableReports = reportsManager.getAvailableReports();
  logger.info(`Templates disponíveis: ${availableReports.join(", ")}`);
  return availableReports;
}

export async function findReport(id: string) {
  return reportsManager.findById(id);
}

export async function loadAndValidateData(
  report: BaseReportModule,
  body: IGenerateReportRequestBody,
) {
  if (report.dataAdapter) {
    logger.debug(`Validando os dados para o template '${report.id}'.`);
    const result = await report.dataAdapter.validateInput(body);

    if (result.isValid) {
      logger.debug(
        `Dados validados com sucesso para o template '${report.id}'.`,
      );
    } else {
      logger.error("Erro de validação:", result.error);
    }

    return result;
  }

  return {
    isValid: true,
    data: {},
    error: null,
  } as const;
}
