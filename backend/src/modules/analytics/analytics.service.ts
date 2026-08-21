import { IAnalyticsRepository } from "./analytics.interface";
import { RecordClickInputType } from "./analytics.types";

export class AnalyticsService {
  constructor(private readonly analyticsRepo: IAnalyticsRepository) {}

  async recordClick(data:RecordClickInputType) {
    await this.analyticsRepo.createAnalytics({
      shortUrlId: data.shortUrlId,
      clickedAt: data.clickedAt??new Date(),
      ipAddress: data.ipAddress ?? null,
      userAgent:
        typeof data.userAgent === "string"
          ? data.userAgent
          : null,
      referrer: data.referrer ?? null,
      country: null,
    });
  }
}
