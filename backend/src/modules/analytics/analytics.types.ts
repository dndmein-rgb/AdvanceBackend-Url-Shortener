export type CreateAnalyticsType = {
  shortUrlId: string;
  clickedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  country: string | null;
};

export type RecordClickInputType = {
  shortUrlId: string;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  clickedAt:Date
};

export type RequestMetaDataType = {
  ipAddress: string;
  userAgent: string;
  referrer: string;
};
