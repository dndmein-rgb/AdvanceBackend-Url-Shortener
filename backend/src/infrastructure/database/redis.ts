import { env } from "@/config/env"
import { logger } from "@/config/logger";
import Redis from "ioredis"

export const redisConnection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null as null, // required by BullMQ
};

const redis = new Redis(redisConnection);
redis.on("connect", () => {
  logger.info("Redis connected successfully")
})
redis.on("error", (err) => {
  logger.error(`Redis failed to connect: ${err}`)
})

export default redis;
