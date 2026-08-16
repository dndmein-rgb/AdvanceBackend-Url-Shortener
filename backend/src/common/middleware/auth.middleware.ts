import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { verifyAccessToken } from "@/modules/auth/auth.helper";
import { JwtPayloadType } from "@/modules/auth/auth.type";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new AppError("Authentication required", 401));
    }
    if (!authHeader.startsWith("Bearer ")) {
      return next(new AppError("Invalid authentication header format", 401));
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return next(new AppError("Access token missing", 401));
    }

    const payload = verifyAccessToken(accessToken) as JwtPayloadType;
    req.user = {
      userId: payload.userId,
    };
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Access token expired", 401));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid access token", 401));
    }
    return next(error);
  }
};
