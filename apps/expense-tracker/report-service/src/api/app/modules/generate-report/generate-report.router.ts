import { Router, Request, Response } from "express";
import { generateReportService } from "./generate-report.service";

// ----------------------------------------------------------------------

export const generateReportRouter = Router();

// POST /generate/auditoria
generateReportRouter.post("/auditoria", async (req: Request, res: Response) => {
  try {
    const html = await generateReportService.generateAuditoriaReport(req.body);
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao gerar relatório",
      message: error.message,
    });
  }
});
