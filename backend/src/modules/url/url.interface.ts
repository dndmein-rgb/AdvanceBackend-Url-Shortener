import { ShortUrl } from "@/generated/prisma/client";
import { CreateShortUrlData, UpdateShortUrlType } from "./url.types";

export interface IUrlRepository{
  findShortUrlByShortCode(shortCode: string): Promise<ShortUrl | null>
  createShortUrl(data: CreateShortUrlData): Promise<ShortUrl>
  updateShortUrl(shortCode:string,data:UpdateShortUrlType):Promise<ShortUrl|null>
}