import { AnalyticsRepository } from "./analytics.repository";
import { AnalyticsService } from "./analytics.service";

const analyticsRepository=new AnalyticsRepository()
const analyticsService = new AnalyticsService(analyticsRepository)

export {analyticsService}
