import { validate } from "@/common/middleware/validate.middleware";
import express from "express";
import { createUrlSchema, updateUrlSchema } from "./url.schema";
import { authenticate } from "@/common/middleware/auth.middleware";
import { urlController } from "./url.controller";
import {
  createShortUrlLimiter,
  redirectLimiter,
  userLimiter,
} from "@/common/middleware/rate-limit/rate-limiter";

const router = express.Router();

router
  .route("/create-short-url")
  .post(
    authenticate,
    createShortUrlLimiter,
    validate(createUrlSchema),
    urlController.createShortUrl,
  );

router
  .route("/:shortCode")
  .get(redirectLimiter, urlController.redirectToOriginalUrl);

router
  .route("/:shortCode")
  .patch(
    authenticate,
    userLimiter,
    validate(updateUrlSchema),
    urlController.updateOriginalUrl,
  );

export default router;
