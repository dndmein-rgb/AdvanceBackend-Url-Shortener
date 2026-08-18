import { AppError } from "@/common/errors/app-error";
import { generateShortCode } from "./url.helper";
import { IUrlRepository } from "./url.interface";
import { UrlInputType } from "./url.schema";
import { Prisma } from "@/generated/prisma/client";

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
          throw error;
        }
      }
    }
    throw new AppError(
      "Failed to generate a unique short code. Please try again.",
      500,
      { code: "SHORT_CODE_GENERATTION_FAILED" },
    );
  }
  async getOriginalUrlFromShortCode(shortCode: string) {
    const shortUrl = await this.urlRepo.findShortUrlByShortCode(shortCode);
    if (!shortUrl) {
      throw new AppError("Short url not found", 404, {
        code: "SHORT_URL_NOT_FOUND",
      });
    }
    return shortUrl.originalUrl;
  }
}
