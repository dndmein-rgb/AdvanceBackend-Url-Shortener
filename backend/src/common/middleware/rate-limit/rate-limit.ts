import { AppError } from "@/common/errors/app-error";
import { env } from "@/config/env";
import { logger } from "@/config/logger";
import { redis } from "@/infrastructure/database";
import { NextFunction, Request, Response } from "express";
import rateLimit, {
  RateLimitRequestHandler,
  type Options,
} from "express-rate-limit";
import RedisStore, { type RedisReply } from "rate-limit-redis";

interface RateLimiterOptions {
  windowMs: number;
  limit: number;
  prefix: string;
  error: {
    message: string;
    code: string;
  };
  keyGenerator?: Options["keyGenerator"];
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
}

export const createRateLimiter = ({
  windowMs,
  limit,
  prefix,
  error,
  keyGenerator,
  skipFailedRequests = false,
  skipSuccessfulRequests = false,
}: RateLimiterOptions): RateLimitRequestHandler => {
  return rateLimit({
    windowMs,
    limit,
    legacyHeaders: false,
    standardHeaders: "draft-8",
    store: new RedisStore({
      sendCommand: async (...args: string[]) => {
        const [command, ...commandArgs] = args;
        return redis.call(command, ...commandArgs) as Promise<RedisReply>;
      },
      prefix: `rate-limit:${prefix}:`,
    }),
    skipFailedRequests,
    skipSuccessfulRequests,
    skip: () => env.NODE_ENV === "test",
    ...(keyGenerator ? { keyGenerator } : {}),

    handler: (req: Request, _res: Response, next: NextFunction) => {
      logger.warn({
        event: error.code,
        ip: req.ip,
        userId: req.user?.userId,
        path: req.originalUrl,
      });
      next(
        new AppError(error.message, 429, {
          code: error.code,
        }),
      );
    },
  });
};
