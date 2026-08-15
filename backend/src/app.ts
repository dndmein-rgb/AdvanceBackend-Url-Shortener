import express, { Request, Response } from "express";
import helmet from "helmet";
import { globalErrorHandler } from "./common/middleware/error.middleware";
import { sendResponse } from "./common/utils/send-response";
import cookieParser from "cookie-parser"
import { requestLogger } from "./common/middleware/request-logger";
import { env } from "./config/env";
import cors from "cors"

export const app = express();

app.use(helmet());
app.use(requestLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials:true
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
import authRouter from "@/modules/auth/auth.route.js"

app.use("/api/v1/auth",authRouter)
app.use(globalErrorHandler);

