import type { ShortUrl } from "@/generated/prisma/client";
import  type{ IUrlRepository } from "./url.interface";
import { prisma } from "@/infrastructure/database";
import type{ CreateShortUrlData, UpdateShortUrlType } from "./url.types";

export class UrlRepository implements IUrlRepository{
  async createShortUrl(data: CreateShortUrlData): Promise<ShortUrl> {
    return prisma.shortUrl.create({
      data
    })
  }
  async findShortUrlByShortCode(shortCode: string): Promise<ShortUrl | null> {
    return prisma.shortUrl.findUnique({
      where:{shortCode}
    })
  }
  async updateShortUrl(shortCode: string, data: UpdateShortUrlType): Promise<ShortUrl | null> {
    return prisma.shortUrl.update({
      where: { shortCode },
        data:{originalUrl:data.updatedOriginalUrl}
    })
  }
}