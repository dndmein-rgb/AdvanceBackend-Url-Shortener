import { Worker } from "bullmq";
import { redisConnection } from "@/infrastructure/database/redis";
import { analyticsService } from "@/modules/analytics/analytics.container";
import { logger } from "@/config/logger";
import type { AnalyticsJobData } from "@/infrastructure/queue/analytics.queue";

export const analyticsWorker = new Worker<AnalyticsJobData>(
  "analytics",
  async (job) => {
    if (job.name !== "record-click") return;

    logger.info({
      event: "ANALYTICS_JOB_STARTED",
      jobId: job.id,
      shortUrlId: job.data.shortUrlId,
    });

    await analyticsService.recordClick({
      shortUrlId: job.data.shortUrlId,
      ipAddress: job.data.ipAddress ?? null,
      userAgent: job.data.userAgent ?? null,
      referrer: job.data.referrer ?? null,
      clickedAt: job.data.clickedAt ? new Date(job.data.clickedAt) : new Date(),
    });

    logger.info({
      event: "ANALYTICS_JOB_COMPLETED",
      jobId: job.id,
    });
  },
  {
    connection: redisConnection,
    concurrency: 10,
    limiter: {
      max: 20,        // max 20 jobs
      duration: 1000, // per second
    },
  },
);

// Optional: move to DLQ on final failure
analyticsWorker.on("failed", async (job, err) => {
  if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
    logger.error({
      event: "ANALYTICS_JOB_PERMANENTLY_FAILED",
      jobId: job.id,
      err,
    });
    // You can still push to a deadLetterQueue here if you want
  }
});