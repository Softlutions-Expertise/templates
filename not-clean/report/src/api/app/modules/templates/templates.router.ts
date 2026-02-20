import { type Request, type Response, Router } from "express";
import { getAvailableReports } from "../../../../reports/reports.service";

export const createTemplatesRouter = async () => {
  const router = Router();

  router.get("/", async (_: Request, res: Response) => {
    const reports = await getAvailableReports();

    res.json({
      availableReports: reports,
    });
  });

  return router;
};
