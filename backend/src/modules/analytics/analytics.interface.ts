import { ClickAnalytics } from "@/generated/prisma/client";
import { CreateAnalyticsType } from "./analytics.types";

export interface IAnalyticsRepository{
  createAnalytics(data:CreateAnalyticsType):Promise<ClickAnalytics>
}