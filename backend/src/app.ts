import express, { Request, Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";

import { globalErrorHandler } from "./common/middleware/error.middleware";
import { httpLogger } from "./common/middleware/pino-logger";
import { sendResponse } from "./common/utils/send-response";
import { env } from "./config/env";


import authRouter from "@/modules/auth/auth.route.js";

export const app = express();

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
app.use(globalErrorHandler);
