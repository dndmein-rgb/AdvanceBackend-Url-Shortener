import { AppError } from "@/common/errors/app-error";
import { generateShortCode } from "./url.helper";
import { IUrlInterface } from "./url.interface";
import { UrlInputType } from "./url.schema";

export class UrlService {
  constructor(private readonly urlRepo: IUrlInterface) {}

  async createShortUrl(data: UrlInputType, userId: string) {
    const MAX_RETRIES = 5;
    for (let i = 0; i < MAX_RETRIES; i++) {
      const shortCode = generateShortCode();
      const existingShortUrl =
        await this.urlRepo.findShortUrlByShortCode(shortCode);
      if (!existingShortUrl) {
        const shortUrl = await this.urlRepo.createShortUrl({
          originalUrl: data.originalUrl,
          shortCode,
          userId,
        });
        return shortUrl;
      }
      throw new AppError(
        "Failed to generate a unique short code. Please try again.",
        500,
      );
    }
  }
  async getOriginalUrlFromShortCode(shortCode: string) {
    const shortUrl = await this.urlRepo.findShortUrlByShortCode(shortCode);
    if (!shortUrl) {
      throw new AppError("Short url not found", 404);
    }
    return shortUrl.originalUrl;
  }
}
