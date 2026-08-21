import { logger } from "@/config/logger";
import { analyticsWorker } from "./analytics.worker";

logger.info("Analytics worker started");
const shutdown = async () => {
  logger.info("Shutting down worker...");
  await analyticsWorker.close();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
