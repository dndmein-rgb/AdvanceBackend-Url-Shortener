import { ClickAnalytics } from "@/generated/prisma/client";
import { IAnalyticsRepository } from "./analytics.interface";
import { CreateAnalyticsType } from "./analytics.types";
import { prisma } from "@/infrastructure/database";

export class AnalyticsRepository implements IAnalyticsRepository {
  async createAnalytics(data: CreateAnalyticsType): Promise<ClickAnalytics> {
    return prisma.clickAnalytics.create({
      data: {
        shortUrlId: data.shortUrlId,
        clickedAt: data.clickedAt,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        referrer: data.referrer ?? null,
        country: data.country ?? null,
      },
    });
  }
}
