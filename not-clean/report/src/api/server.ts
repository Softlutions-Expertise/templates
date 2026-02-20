import { appConfig } from "../config";
import { messageStandards } from "../messages";
import { logger } from "../utils/logger";
import { createApp } from "./app/app";

export const createServer = async () => {
  logger.debug(messageStandards.app.debugConfig(appConfig));

  const app = await createApp();

  const start = () => {
    app.listen(appConfig.port, () => {
      logger.info(messageStandards.server.running(appConfig.port));
    });
  };

  return {
    app,
    start,
  };
};
