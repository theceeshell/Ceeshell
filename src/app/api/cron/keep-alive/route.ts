import { prisma } from "@/lib/db";
import { revalidateSite } from "@/lib/actions/helpers";

/**
 * Called once a day by Vercel Cron (vercel.json):
 * - touches the database, because Supabase pauses free projects after a week
 *   without activity and public pages are served from cache;
 * - publishes scheduled blog posts whose date has arrived (refreshes the site);
 * - sweeps expired rate-limit rows.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const since = new Date(now.getTime() - 25 * 60 * 60 * 1000); // a little over a day, so no post slips between runs
  const [duePosts] = await Promise.all([
    prisma.blogPost.count({ where: { status: "published", publishDate: { gt: since, lte: now } } }),
    prisma.rateLimit.deleteMany({ where: { resetAt: { lt: now } } }),
  ]);
  if (duePosts > 0) revalidateSite();

  return Response.json({ ok: true, publishedScheduledPosts: duePosts, at: now.toISOString() });
}
