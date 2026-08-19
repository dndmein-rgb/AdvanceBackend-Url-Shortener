import { validate } from "@/common/middleware/validate.middleware"
import express from "express"
import { createUrlSchema, updateUrlSchema } from "./url.schema";
import { authenticate } from "@/common/middleware/auth.middleware";
import { urlController } from "./url.controller";

const router = express.Router()

router.route("/create-short-url").post(authenticate, validate(createUrlSchema), urlController.createShortUrl)

router.route("/:shortCode").get(urlController.redirectToOriginalUrl)

router.route("/:shortCode").patch(authenticate,validate(updateUrlSchema),urlController.updateOriginalUrl)

export default router