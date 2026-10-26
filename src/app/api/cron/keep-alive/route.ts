import { prisma } from "@/lib/db";

/**
 * Called once a day by Vercel Cron (vercel.json). Supabase pauses free
 * projects after a week without database activity, and public pages are
 * served from cache, so a quiet week could otherwise take the site's
 * database offline. Also sweeps expired rate-limit rows.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  await prisma.rateLimit.deleteMany({ where: { resetAt: { lt: new Date() } } });
  return Response.json({ ok: true, at: new Date().toISOString() });
}
