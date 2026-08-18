import { env } from "@/config/env"
import { logger } from "@/config/logger";
import Redis from "ioredis"

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableReadyCheck:true
})

redis.on("connect", () => {
  logger.info("Redis connected successfully")
})
redis.on("error", (err) => {
  logger.error(`Redis failed to connect: ${err}`)
})

export default redis;