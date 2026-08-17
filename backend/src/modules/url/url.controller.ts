import { asyncHandler } from "@/common/middleware/async-handler";
import { Request, Response } from "express";
import { urlService } from "./url.container";
import { sendResponse } from "@/common/utils/send-response";

export class UrlController {
  createShortUrl = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const { originalUrl } = req.body;
    const result =await urlService.createShortUrl({ originalUrl }, userId);
    sendResponse(res, 201, {
      success: true,
      message: "Short Code Created Successfully",
      data: result,
    });
  });

  redirectToOriginalUrl = asyncHandler(async(req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string
    const originalUrl = await urlService.getOriginalUrlFromShortCode(shortCode)
    res.redirect(302,originalUrl)
  })
}

export const urlController=new UrlController()
