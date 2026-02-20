import { tz } from "@date-fns/tz";
import { format as formatDate } from "date-fns";
import winston from "winston";
import { appConfig } from "../config";
import { TIMEZONE_LOCAL } from "./format";

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  const formattedTimestamp = formatDate(
    new Date(timestamp as string),
    "yyyy-MM-dd HH:mm.SSS XXX",
    { in: tz(TIMEZONE_LOCAL) },
  );

  return `[${formattedTimestamp}] [${level.toUpperCase()}] ${message}`;
});

const logger = winston.createLogger({
  level: "debug",

  format: winston.format.json(),

  defaultMeta: {},

  transports: [],
});

if (appConfig.logger.enabled) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        myFormat,
        winston.format.colorize({ all: true }),
      ),
    }),
  );
}

export { logger };
