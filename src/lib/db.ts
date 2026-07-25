import { PrismaClient } from "@prisma/client";

// Prevents exhausting DB connections from Next.js hot-reload in dev,
// and works fine as a per-invocation singleton on Vercel serverless.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
