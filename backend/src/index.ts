import { app } from "./app.js";
import { prisma } from "./common/infrastructure/database";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const shutDown = async (signal: string) => {
  logger.info(`${signal} received: closing HTTP server and DB pool...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Shutdown completed");
    process.exit(0);
  });
};
process.on("SIGTERM", () => shutDown("SIGTERM"));
process.on("SIGINT", () => shutDown("SIGINT"));
