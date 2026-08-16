import type { NextFunction, Request, Response } from "express";
import { env } from "@/config/env.js";
import { AppError } from "@/common/errors/app-error.js";
import { logger } from "@/config/logger.js";

export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let error: AppError;
  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Error) {
    error = new AppError(err.message, 500);
  } else {
    error = new AppError("Something went wrong", 500);
  }

  if (env.NODE_ENV === "development") {
    logger.error({
      message: error.message,
      stack: error.stack,
      error:err,
    });
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: err instanceof Error ? error.stack : undefined,
      error:err,
    });
  }
  if (error.isOperational) {
    logger.error({
      err,
      status: error.status,
      message: error.message,
    });
    return res.status(error.statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
      code:error.code
    });
  }
  logger.error({
    err,
    message: "Something went wrong",
  });
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    status: "error",
  });
}
