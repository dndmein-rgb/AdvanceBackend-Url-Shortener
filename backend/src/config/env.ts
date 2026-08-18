import "dotenv/config";
import type { StringValue } from "ms";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string(),
  DATABASE_URL: z.string(),
  SALT_ROUNDS: z.coerce.number(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().min(1) as z.ZodType<StringValue>,
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1) as z.ZodType<StringValue>,
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
});

export const env = envSchema.parse(process.env);
