import express from "express"
import { authController } from "./auth.controller";
import { validate } from "@/common/middleware/validate.middleware";
import { registerUserSchema } from "./auth.schema";

const router = express.Router()

router.route("/register").post(validate(registerUserSchema),authController.registerUser)

export default router;