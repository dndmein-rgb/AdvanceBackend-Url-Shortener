import { Request } from "express";
import { ShortUrlType } from "../url/url.types";
import { IAnalyticsRepository } from "./analytics.interface";

export class AnalyticsService {
  constructor(private readonly analyticsRepo: IAnalyticsRepository) {}

  async recordClick(shortUrl: ShortUrlType, requestMetaData: Request) {
    await this.analyticsRepo.createAnalytics({
      shortUrlId: shortUrl.id,
      clickedAt: new Date(),
      ipAddress: requestMetaData.ip ?? null,
      userAgent:
        typeof requestMetaData.headers["user-agent"] === "string"
          ? requestMetaData.headers["user-agent"]
          : null,
      referrer: requestMetaData.get("Referer") ?? null,
      country: null,
    });
  }
}
