export type CreateAnalyticsType = {
  shortUrlId: string;
  clickedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  country: string | null;
};
