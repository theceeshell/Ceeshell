import Link from "next/link";
import { Briefcase, Layers, Newspaper, Quote, Users, HelpCircle, Inbox, ImageIcon, FileStack } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatCard } from "@/components/admin/ui/stat-card";
import { formatDate } from "@/lib/format-date";

export const metadata = { title: "Dashboard" };

/** Plain-language answers to "where do I change…?" for non-technical editors. */
const HELP_LINKS = [
  { label: "Change text or images on a page", where: "Pages → open the page → edit a section", href: "/admin/content" },
  { label: "Add a new page", where: "Pages → New Page", href: "/admin/content", adminOnly: true },
  { label: "Add a project to the portfolio", where: "Portfolio → Add Project", href: "/admin/portfolio/new" },
  { label: "Write a blog post", where: "Blog → New Post", href: "/admin/blog/new" },
  { label: "Change phone, email, address or logo", where: "Website Settings", href: "/admin/settings", adminOnly: true },
  { label: "Change a button or label (e.g. \"Start Project\")", where: "Website Texts — use the search box", href: "/admin/texts", adminOnly: true },
  { label: "Change the menu at the top", where: "Navigation", href: "/admin/navigation", adminOnly: true },
  { label: "Upload images", where: "Media Library — or the \"Choose image\" button on any form", href: "/admin/media" },
];

export default async function AdminDashboardPage() {
  const session = await getSession();

  const [portfolioCount, serviceCount, blogCount, testimonialCount, teamCount, faqCount, newInquiries, mediaCount, recentInquiries] =
    await Promise.all([
      prisma.portfolioProject.count(),
      prisma.service.count(),
      prisma.blogPost.count(),
      prisma.testimonial.count(),
      prisma.teamMember.count(),
      prisma.faq.count(),
      prisma.contactInquiry.count({ where: { status: "new" } }),
      prisma.media.count(),
      prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  return (
    <div>
      <PageHeader title={`Welcome back, ${session?.name.split(" ")[0]}`} description="Here's what's happening across the website." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Portfolio Projects" value={portfolioCount} icon={Briefcase} href="/admin/portfolio" />
        <StatCard label="Services" value={serviceCount} icon={Layers} href="/admin/services" />
        <StatCard label="Blog Posts" value={blogCount} icon={Newspaper} href="/admin/blog" />
        <StatCard label="Testimonials" value={testimonialCount} icon={Quote} href="/admin/testimonials" />
        <StatCard label="Team Members" value={teamCount} icon={Users} href="/admin/team" />
        <StatCard label="FAQs" value={faqCount} icon={HelpCircle} href="/admin/faqs" />
        <StatCard label="Media Files" value={mediaCount} icon={ImageIcon} href="/admin/media" />
        <StatCard label="New Inquiries" value={newInquiries} icon={Inbox} href="/admin/inquiries" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-heading text-lg font-medium text-primary">Recent Inquiries</h3>
            <Link href="/admin/inquiries" className="text-sm font-semibold text-secondary hover:underline">
              View all
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No inquiries yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">{inquiry.name} &middot; {inquiry.company}</p>
                    <p className="truncate text-sm text-muted">{inquiry.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{formatDate(inquiry.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <h3 className="mb-5 flex items-center gap-2 font-heading text-lg font-medium text-primary">
            <FileStack className="h-4 w-4" /> How do I…?
          </h3>
          <ul className="space-y-1">
            {HELP_LINKS.filter((link) => !link.adminOnly || session?.role === "ADMIN").map((link) => (
              <li key={link.href + link.label}>
                <Link href={link.href} className="block rounded-lg px-3 py-2.5 hover:bg-background">
                  <span className="block text-sm font-medium text-text">{link.label}</span>
                  <span className="block text-xs text-muted">{link.where}</span>
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block rounded-lg bg-background px-3 py-2.5 text-center text-sm font-semibold text-primary hover:bg-primary/8"
          >
            Open the website ↗
          </a>
        </div>
      </div>
    </div>
  );
}
