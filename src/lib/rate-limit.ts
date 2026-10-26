import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

/**
 * Fixed-window rate limiter backed by Postgres (the RateLimit table), so it
 * holds across Vercel's many serverless instances without adding Redis.
 * Returns true if the call is allowed.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
    ON CONFLICT ("key") DO UPDATE SET
      "count"   = CASE WHEN "RateLimit"."resetAt" < now() THEN 1 ELSE "RateLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" < now() THEN EXCLUDED."resetAt" ELSE "RateLimit"."resetAt" END
    RETURNING "count"
  `;

  // Opportunistically sweep expired windows so the table stays tiny.
  if (Math.random() < 0.02) {
    await prisma.rateLimit.deleteMany({ where: { resetAt: { lt: new Date() } } });
  }

  return (rows[0]?.count ?? 0) <= limit;
}

/** Client IP as reported by Vercel's edge (which overwrites any client-supplied value). */
export async function getClientIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
