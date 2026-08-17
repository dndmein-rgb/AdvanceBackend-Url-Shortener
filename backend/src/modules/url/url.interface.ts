import { ShortUrl } from "@/generated/prisma/client";

export interface IUrlInterface{
  findShortUrlByShortCode(shortCode: string): Promise<ShortUrl | null>
  createShortUrl(data:createShortUrlType):Promise<ShortUrl>
}