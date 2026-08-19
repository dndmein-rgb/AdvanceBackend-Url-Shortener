import { logger } from "@/config/logger";
import { redis } from "@/infrastructure/database";

export class CacheService{
  async get<T>(key: string): Promise<T | null>{

    try {
      const value = await redis.get(key)
      if (!value) return null;

      return JSON.parse(value) as T
    } catch (error) {
      logger.error({
        error,key
      },"Redis GET failed"
      )
      return null
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void>{
    try {
      await redis.set(key,JSON.stringify(value),"EX",ttl)
    }
    catch (error) {
      logger.error(
        {
          key,
          value
        },
        "Redis SET failed"
      )
    }
  }

  async delete(key: string): Promise<void>{
    try {
      await redis.del(key);
        } catch (error) {
          logger.error(
            {
              error,
              key,
            },
            "Redis DEL failed",
          );
        }
      }
}

export const cacheService=new CacheService()