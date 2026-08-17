import { validate } from "@/common/middleware/validate.middleware"
import express from "express"
import { urlSchema } from "./url.schema";
import { authenticate } from "@/common/middleware/auth.middleware";
import { urlController } from "./url.controller";

const router = express.Router()

router.route("/create-short-url").post(authenticate, validate(urlSchema), urlController.createShortUrl)

router.route("/:shortCode").get(urlController.redirectToOriginalUrl)

export default router