import { ShortUrl } from "@/generated/prisma/client";
import { CreateShortUrlData } from "./url.types";

export interface IUrlRepository{
  findShortUrlByShortCode(shortCode: string): Promise<ShortUrl | null>
  createShortUrl(data:CreateShortUrlData):Promise<ShortUrl>
}