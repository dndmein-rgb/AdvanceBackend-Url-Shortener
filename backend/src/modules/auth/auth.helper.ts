import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "@/config/env";
import { JwtPayloadType } from "./auth.type";
import { Response } from "express";
import ms from "ms";
import { AppError } from "@/common/errors/app-error";

const refreshTokenMaxAge = ms(env.REFRESH_TOKEN_EXPIRES_IN);

if (typeof refreshTokenMaxAge !== "number") {
  throw new AppError("Invalid refresh token expiry configuration", 500);
}
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, env.SALT_ROUNDS);
};
export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const signAccessToken = (payload: JwtPayloadType) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const signRefreshToken = (payload: JwtPayloadType) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

export const refreshAccessToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};

export const setAuthCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshTokenMaxAge
    
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  })
}
