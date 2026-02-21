import express from "express";
import { messageStandards } from "../../messages";
import { logger } from "../../utils/logger";
import { createAppLoggerHandler } from "./app.logger";
import { createAppRouter } from "./app.router";

export const createApp = async () => {
  const app = express();

  // Aceita o envio de JSON no corpo de requests
  app.use(express.json({ limit: "10mb" }));

  app.use(createAppLoggerHandler());

  // Rotas
  const router = await createAppRouter();
  app.use(router);

  logger.debug(messageStandards.app.routesSetup());

  return app;
};
