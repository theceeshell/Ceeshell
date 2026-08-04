import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; pgPool?: Pool };

function createClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add your Postgres connection string (e.g. from Supabase) to .env locally, or to your hosting provider's environment variables in production."
    );
  }
  const pool = globalForPrisma.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
