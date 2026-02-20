import type { Request } from "express";
import morgan from "morgan";
import { logger } from "../../utils";

export const createAppLoggerHandler = () => {
  return morgan<Request>(
    ":status - :method :url :status :res[content-length] - :response-time ms",
    {
      stream: {
        write(fullLogMessage) {
          const SEPARATOR = " - ";
          const indexOfSeparator = fullLogMessage.indexOf(SEPARATOR);

          const logStatus = Number.parseInt(
            fullLogMessage.slice(0, indexOfSeparator),
          );
          const logShortMessage = fullLogMessage.slice(
            indexOfSeparator + SEPARATOR.length,
          );

          if (logStatus < 400) {
            logger.debug(`REQUEST: ${logShortMessage}`);
          } else {
            logger.error(`REQUEST: ${logShortMessage}`);
          }
        },
      },
      skip(request) {
        if (request.originalUrl.includes("/health")) return true;
        return false;
      },
    },
  );
};
