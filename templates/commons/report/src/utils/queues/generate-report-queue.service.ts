import PQueue from "p-queue";
import { messageStandards } from "../../messages";
import { logger } from "../logger";

const generateReportQueue = new PQueue({ concurrency: 2 });

generateReportQueue.on("idle", () => {
  logger.debug(messageStandards.queues.generateReport.empty());
});

generateReportQueue.on("active", () => {
  logger.debug(
    messageStandards.queues.generateReport.pending(generateReportQueue),
  );
});

export function addToQueue<T>(task: () => Promise<T>): Promise<T | undefined> {
  logger.debug(messageStandards.queues.generateReport.add());
  return generateReportQueue.add(task) as Promise<T | undefined>;
}

export default generateReportQueue;
