import { NextFunction, Request, Response } from "express";
import { createRateLimiter } from "./rate-limit";
import crypto from "crypto";
import { redis } from "@/infrastructure/database";
import { AppError } from "@/common/errors/app-error";
import { logger } from "@/config/logger";

export const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  prefix: "global",
  error: {
    code: "GLOBAL_RATE_LIMIT_EXCEEDED",
    message: "Too many requests. Please try again later.",
  },
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  prefix: "auth",
  error: {
    message: "Too many authentication attempts. Try again later.",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
});

//User based
export const createShortUrlLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  prefix: "create-url",
  error: {
    message: "You have created too many short URLs. Try again later.",
    code: "CREATE_URL_RATE_LIMIT_EXCEEDED",
  },
  keyGenerator: (req: Request) => req.user?.userId ?? req.ip ?? "unknown",
});
export const userLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 60,
  prefix: "user",
  error: {
    message: "Too many requests. Please slow down.",
    code: "USER_RATE_LIMIT_EXCEEDED",
  },
  keyGenerator: (req: Request) => {
    // Prefer userId when available, fallback to IP
    return req.user?.userId ?? req.ip ?? "unknown";
  },
});

export const redirectLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 300,
  prefix: "redirect",
  error: {
    code: "TOO_MANY_REDIRECTS",
    message: "Too many redirects from this IP",
  },
});

const WINDOW_IN_SECONDS = 15 * 60;
const MAX_REQUESTS = 5;

// Atomic sliding window log
const SLIDING_WINDOW_SCRIPT = `
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local windowStart = tonumber(ARGV[2])
  local maxRequests = tonumber(ARGV[3])
  local member = ARGV[4]
  local ttl = tonumber(ARGV[5])

  -- Remove old entries
  redis.call("ZREMRANGEBYSCORE", key, 0, windowStart)

  -- Current count
  local count = redis.call("ZCARD", key)

  if count >= maxRequests then
    return {0, count}  -- rejected, current count
  end

  -- Add new request
  redis.call("ZADD", key, now, member)
  redis.call("EXPIRE", key, ttl)

  return {1, count + 1}  -- allowed, new count
`;

export const authSlidingWindowRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.body.email as string;

    const ip = req.ip ?? "unknown";

    // Stronger key: IP + email when available, otherwise just IP
    const identifier = `${ip}:${email}`;
    const key = `auth-rate-limit:${identifier}`;

    const now = Date.now();
    const windowStart = now - WINDOW_IN_SECONDS * 1000;
    const member = `${now}-${crypto.randomUUID()}`;

    const result = (await redis.eval(
      SLIDING_WINDOW_SCRIPT,
      1,
      key,
      now.toString(),
      windowStart.toString(),
      MAX_REQUESTS.toString(),
      member,
      WINDOW_IN_SECONDS.toString(),
    )) as [number, number];

    const [allowed, currentCount] = result;

    if (allowed === 0) {
      logger.warn({
        event: "AUTH_RATE_LIMIT_EXCEEDED",
        ip: req.ip,
        userId: req.user?.userId,
        path: req.originalUrl,
      });
      throw new AppError(
        "Too many authentication attempts. Please try again later.",
        429,
        { code: "AUTH_RATE_LIMIT_EXCEEDED" },
      );
    }

    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, MAX_REQUESTS - currentCount),
    );

    next();
  } catch (error) {
    next(error);
  }
};
