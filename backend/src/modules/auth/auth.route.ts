import express from "express"
import { authController } from "./auth.controller";
import { validate } from "@/common/middleware/validate.middleware";
import { loginUserSchema, registerUserSchema } from "./auth.schema";
import { authenticate } from "@/common/middleware/auth.middleware";

const router = express.Router()

router.route("/register").post(validate(registerUserSchema), authController.registerUser)
router.route("/login").post(validate(loginUserSchema), authController.loginUser)
router.route("/me").get(authenticate,authController.getLoggedInUser)

export default router;