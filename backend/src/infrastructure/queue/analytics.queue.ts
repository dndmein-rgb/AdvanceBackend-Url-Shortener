import { Queue } from "bullmq";
import { redisConnection } from "../database";

export type AnalyticsJobData = {
  shortUrlId: string;
  ipAddress: string | null;
  referrer: string | null;
  userAgent: string | null;
  clickedAt: string;
};

export const analyticsQueue = new Queue<AnalyticsJobData>("analytics", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 1000,

    removeOnFail:5000
  },
});
