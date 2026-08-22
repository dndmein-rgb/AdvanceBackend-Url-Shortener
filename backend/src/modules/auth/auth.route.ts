import express from "express";
import { authController } from "./auth.controller";
import { validate } from "@/common/middleware/validate.middleware";
import { loginUserSchema, registerUserSchema } from "./auth.schema";
import { authenticate } from "@/common/middleware/auth.middleware";
import {
  authSlidingWindowRateLimit,
  userLimiter,
} from "@/common/middleware/rate-limit/rate-limiter";

const router = express.Router();

router.route("/register").post(
  validate(registerUserSchema),
  authSlidingWindowRateLimit,

  authController.registerUser,
);
router.route("/login").post(
  validate(loginUserSchema),
  authSlidingWindowRateLimit,

  authController.loginUser,
);
router
  .route("/me")
  .get(authenticate, userLimiter, authController.getLoggedInUser);

export default router;
