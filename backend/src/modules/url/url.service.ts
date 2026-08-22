import { AppError } from "@/common/errors/app-error";
import { generateShortCode, generateShortUrlCacheKey } from "./url.helper";
import { IUrlRepository } from "./url.interface";
import { UrlInputType } from "./url.schema";
import { Prisma } from "@/generated/prisma/client";
import { ShortUrlType, UpdateShortUrlType } from "./url.types";
import { cacheService } from "./cache/cache.service";
import { logger } from "@/config/logger";

export class UrlService {
  constructor(private readonly urlRepo: IUrlRepository) {}

  private isShortCodeCollision(error: unknown): boolean {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== "P2002"
    ) {
      return false;
    }

    const target = error.meta?.target;

    if (Array.isArray(target)) {
      return target.includes("shortCode");
    }

    return target === "shortCode";
  }

  async createShortUrl(data: UrlInputType, userId: string) {
    const MAX_RETRIES = 5;
    for (let i = 0; i < MAX_RETRIES; i++) {
      const shortCode = generateShortCode();
      try {
        return await this.urlRepo.createShortUrl({
          originalUrl: data.originalUrl,
          shortCode,
          userId,
        });
      } catch (error) {
        if (this.isShortCodeCollision(error)) {
          continue;
        }

        throw error;
      }
    }
    throw new AppError(
      "Failed to generate a unique short code. Please try again.",
      500,
      { code: "SHORT_CODE_GENERATION_FAILED" },
    );
  }
  async getShortUrlFromShortCode(shortCode: string) {
    const key = generateShortUrlCacheKey(shortCode);
    const cachedShortUrl = await cacheService.get<ShortUrlType>(key);
    if (cachedShortUrl) {
      logger.info({
        event: "CACHE_HIT",
        shortCode,
      });
      return cachedShortUrl;
    }

    logger.info({
      event: "CACHE_MISS",
      shortCode,
    });
    const shortUrl = await this.urlRepo.findShortUrlByShortCode(shortCode);
    if (!shortUrl) {
      throw new AppError("Short url not found", 404, {
        code: "SHORT_URL_NOT_FOUND",
      });
    }
    await cacheService.set(key, shortUrl, 300);
    return shortUrl;
  }

  async updateOriginalUrl(
    userId: string,
    shortCode: string,
    data: UpdateShortUrlType,
  ) {
    const shortUrl = await this.urlRepo.findShortUrlByShortCode(shortCode);
    if (!shortUrl) {
      throw new AppError("Short url not found", 404, {
        code: "SHORT_URL_NOT_FOUND",
      });
    }
    if (shortUrl.userId !== userId) {
      throw new AppError("You are not allowed to perform this action", 403, {
        code: "FORBIDDEN",
      });
    }
    const updatedShortUrl = await this.urlRepo.updateShortUrl(shortCode, data);
    if (!updatedShortUrl) {
      throw new AppError("Could not update short Url", 500, {
        code: "SHORT_URL_NOT_UPDATED",
      });
    }
    const key = generateShortUrlCacheKey(updatedShortUrl.shortCode);
    await cacheService.set(key, updatedShortUrl, 300);

    return updatedShortUrl;
  }
}
