import { Router, static as expressStatic } from "express";
import { APP_PATH_REPO_SRC_STATIC } from "../../utils/app-paths";
import { createGenerateReportRouter } from "./modules/generate-report/generate-report.router";
import { createHealthRouter } from "./modules/health/health.router";
import { createTemplatesRouter } from "./modules/templates/templates.router";

export const createAppRouter = async () => {
  const router = Router();

  router.use("/generate-pdf", await createGenerateReportRouter());
  router.use("/templates", await createTemplatesRouter());
  router.use("/health", await createHealthRouter());

  router.use(
    "/static",
    expressStatic(APP_PATH_REPO_SRC_STATIC, {
      maxAge: "1y",
      etag: true,
      cacheControl: true,
      immutable: true,
    }),
  );

  return router;
};
