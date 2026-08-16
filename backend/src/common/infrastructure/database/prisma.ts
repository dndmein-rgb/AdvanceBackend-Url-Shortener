import { env } from "@/config/env";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma=globalThis as unknown  as {prisma:PrismaClient}

const adapter = new PrismaPg(env.DATABASE_URL)
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
