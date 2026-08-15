import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "@/config/env";
import { JwtPayloadType } from "./auth.type";

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
