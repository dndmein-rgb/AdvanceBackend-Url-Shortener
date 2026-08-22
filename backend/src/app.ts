import express, { Request, Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";

import { globalErrorHandler } from "./common/middleware/error.middleware";
import { httpLogger } from "./common/middleware/pino-logger";
import { sendResponse } from "./common/utils/send-response";
import { env } from "./config/env";

import authRouter from "@/modules/auth/auth.route.js";
import urlRouter from "@/modules/url/url.route.js";
import { globalRateLimiter } from "./common/middleware/rate-limit/rate-limiter";

export const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(globalRateLimiter)

app.get("/health-check", (_req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Api is working fine",
    data: {
      status: "healthy",
    },
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/url", urlRouter);
app.use(globalErrorHandler);
