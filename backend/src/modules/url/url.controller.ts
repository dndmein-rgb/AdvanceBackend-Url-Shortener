import { asyncHandler } from "@/common/middleware/async-handler";
import { Request, Response } from "express";
import { urlService } from "./url.container";
import { sendResponse } from "@/common/utils/send-response";
import { analyticsService } from "../analytics/analytics.container";

export class UrlController {
  createShortUrl = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { originalUrl } = req.body;
    const result = await urlService.createShortUrl({ originalUrl }, userId);
    sendResponse(res, 201, {
      success: true,
      message: "Short Code Created Successfully",
      data: result,
    });
  });

  redirectToOriginalUrl = asyncHandler(async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;
    const shortUrl = await urlService.getShortUrlFromShortCode(shortCode);
    await analyticsService.recordClick(shortUrl, req)

    res.redirect(302, shortUrl.originalUrl)
    
  });

  updateOriginalUrl = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const updatedOriginalUrl = req.body.updatedOriginalUrl;
    const shortCode = req.params.shortCode as string;

    const result = await urlService.updateOriginalUrl(userId, shortCode, {
      updatedOriginalUrl,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Original URL updated successfully",
      data: result,
    });
  });
}

export const urlController = new UrlController();
