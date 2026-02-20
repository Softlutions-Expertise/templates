import { type Request, type Response, Router } from "express";
import { generatePdf, generatePdfUrl } from "./generate-report.service";

export const createGenerateReportRouter = async () => {
  const router = Router();

  router.post("/:templateName", async (req: Request, res: Response) => {
    await generatePdf(req, res);
  });

  router.post("/:templateName/url", async (req: Request, res: Response) => {
    await generatePdfUrl(req, res);
  });

  return router;
};
