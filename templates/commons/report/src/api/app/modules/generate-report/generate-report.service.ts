import type { Request, Response } from "express";
import type JsReport from "jsreport-core";
import { randomUUID } from "node:crypto";
import { ValidationError } from "yup";
import type { BaseReportModule } from "../../../../reports/core/base-report-module";
import {
  findReport,
  loadAndValidateData,
} from "../../../../reports/reports.service";
import { EMPTY_SLOT } from "../../../../reports/templates/components/empty-slot";
import { handleError } from "../../../../utils/critical";
import { getJsReportInstance } from "../../../../utils/integrations/js-report/js-report";
import { jitMinioService } from "../../../../utils/integrations/minio/minio.service";
import { logger } from "../../../../utils/logger";
import { addToQueue } from "../../../../utils/queues/generate-report-queue.service";
import type { IGenerateReportRequestBody } from "./generate-report.typings";

async function renderPdf(
  report: BaseReportModule,
  input: Record<string, unknown>
) {
  logger.info(`Gerando PDF para o template '${report.id}'.`);

  const { main, slots } = await report.renderHtml(input);

  const jsReport = await getJsReportInstance();

  return await jsReport.render({
    template: {
      content: main,

      engine: "none",

      recipe: "chrome-pdf",

      chrome: {
        format: "A4",

        displayHeaderFooter: true,

        margin: {
          bottom: 0,
        },

        preferCSSPageSize: true,
        printBackground: true,

        headerTemplate: slots?.header || EMPTY_SLOT,
        footerTemplate: slots?.footer || EMPTY_SLOT,
      },
    },
    data: {},
  });
}

type PdfHandler = (
  pdfResult: JsReport.Response,
  templateName: string,
  res: Response
) => Promise<void>;

const handleDirectDownload: PdfHandler = async (
  pdfResult,
  templateName,
  res
) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${templateName}.pdf`
  );
  pdfResult.stream.pipe(res);
  logger.debug(`PDF gerado com sucesso para o template '${templateName}'.`);
};

const handleMinioUpload: PdfHandler = async (pdfResult, templateName, res) => {
  const filename = `${templateName}-${Date.now()}-${randomUUID()}.pdf`;

  const minioService = await jitMinioService();

  const url = await minioService.uploadPdf(
    Buffer.from(pdfResult.content),
    filename
  );

  logger.debug(`PDF uploaded to Minio for template '${templateName}'`);

  res.json({ url, filename });
};

async function handlePdfGeneration(
  req: Request,
  res: Response,
  handler: PdfHandler
): Promise<void> {
  const task = async () => {
    const templateName: string = req.params.templateName;

    const report = await findReport(templateName);

    if (!report) {
      res.status(404).send({ error: "Modelo de relatório não encontrado." });
      return;
    }

    const rawData = req.body as IGenerateReportRequestBody;

    const validationResult = await loadAndValidateData(report, rawData || {});

    if (!validationResult.isValid) {
      const error = validationResult.error;

      if (error instanceof ValidationError) {
        res.status(400).json({
          error: "Dados inválidos.",
          details: {
            errors: error.errors,
          },
        });
      } else {
        handleError("Erro ao validar os dados.", error);

        res.status(500).json({
          error: "Erro ao validar os dados.",
        });
      }

      return;
    }

    try {
      const pdfResult = await renderPdf(report, validationResult.data);
      logger.debug(`PDF gerado: ${report.id}`);

      logger.debug(`handler: ${handler.name}`);
      await handler(pdfResult, report.id, res);
    } catch (error) {
      handleError("Erro ao gerar PDF.", error);
      res.status(500).send({ error: "Erro ao gerar PDF." });
    }
  };

  await addToQueue(task);
}

export async function generatePdf(req: Request, res: Response): Promise<void> {
  await handlePdfGeneration(req, res, handleDirectDownload);
}

export async function generatePdfUrl(
  req: Request,
  res: Response
): Promise<void> {
  const templateName = req.params.templateName;
  const body = req.body as IGenerateReportRequestBody;

  logger.debug(`Requisição recebida para o template: ${templateName}`);

  await handlePdfGeneration(req, res, handleMinioUpload);
}
