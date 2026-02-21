import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { generateReportRouter } from "./modules/generate-report/generate-report.router";

// ----------------------------------------------------------------------

export const createApp = (): Application => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/generate", generateReportRouter);

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "report-service" });
  });

  // Error handling
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err.message);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
};
