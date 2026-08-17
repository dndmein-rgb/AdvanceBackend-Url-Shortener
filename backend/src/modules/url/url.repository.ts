import { ShortUrl } from "@/generated/prisma/client";
import { IUrlInterface } from "./url.interface";
import { prisma } from "@/infrastructure/database";

export class UrlRepository implements IUrlInterface{
  async createShortUrl(data: createShortUrlType): Promise<ShortUrl> {
    return prisma.shortUrl.create({
      data
    })
  }
  async findShortUrlByShortCode(shortCode: string): Promise<ShortUrl | null> {
    return prisma.shortUrl.findUnique({
      where:{shortCode}
    })
  }
}