import { logger } from "./logger";

export const handleError = (message: string, error: unknown) => {
  console.debug(error);
  logger.error(message, error);
};
