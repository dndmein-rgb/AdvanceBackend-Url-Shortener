import { pinoHttp } from "pino-http";
import { logger } from "@/config/logger";
import { randomUUID } from "crypto";

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const existing = req.headers["x-request-id"];
    return typeof existing === "string" ? existing : randomUUID();
  },
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  // Quiet health-check noise
  autoLogging: {
    ignore: (req) => req.url === "/health-check",
  },
});