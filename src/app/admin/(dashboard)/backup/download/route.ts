import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

/**
 * Full content export as JSON. Supabase's free plan has no downloadable
 * backups, so this is the owner's safety net. Password hashes are excluded.
 */
export async function GET() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return new Response("Not allowed", { status: 403 });

  const [settings, footer, navigation, pages, services, projects, industries, testimonials, team, posts, faqs, media, inquiries, subscribers, users] =
    await Promise.all([
      prisma.siteSettings.findMany(),
      prisma.footerConfig.findMany(),
      prisma.navigationItem.findMany({ orderBy: { order: "asc" } }),
      prisma.page.findMany({ include: { sections: { orderBy: { order: "asc" } } } }),
      prisma.service.findMany({ orderBy: { order: "asc" } }),
      prisma.portfolioProject.findMany({ orderBy: { order: "asc" }, include: { industries: { select: { id: true } } } }),
      prisma.industry.findMany({ orderBy: { order: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
      prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
      prisma.blogPost.findMany({ orderBy: { publishDate: "desc" } }),
      prisma.faq.findMany({ orderBy: { order: "asc" } }),
      prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true } }),
    ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    exportedBy: session.email,
    note: "Content backup of the Cee-Shell website. Uploaded image files live in Supabase Storage and are referenced by URL.",
    data: { settings, footer, navigation, pages, services, projects, industries, testimonials, team, posts, faqs, media, inquiries, subscribers, users },
  };

  const date = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="ceeshell-backup-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
