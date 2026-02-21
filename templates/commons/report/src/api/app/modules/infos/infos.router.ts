import express, { type Request, type Response } from "express";
import { getAvailableReports } from "../../../../reports/reports.service";

const templatesRouter = express.Router();

templatesRouter.get("/", async (_: Request, res: Response) => {
  const reports = await getAvailableReports();

  res.json({
    availableReports: reports,
  });
});

export { templatesRouter };
