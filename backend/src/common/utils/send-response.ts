import type { Response } from "express";
import type { ApiResponse } from "@/common/types/index.js";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload?: ApiResponse<T>,
) => {
  return res.status(statusCode).json(payload);
};