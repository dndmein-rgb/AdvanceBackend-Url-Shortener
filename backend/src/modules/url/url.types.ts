export type CreateShortUrlData = {
  originalUrl: string;
  shortCode: string;
  userId: string;
};

export type UpdateShortUrlType = {
  updatedOriginalUrl:string
}


export type ShortUrlType = {
  id: string;
  originalUrl: string;
  userId: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
};
