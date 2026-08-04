import Link from "next/link";
import { Briefcase, Layers, Newspaper, Quote, Users, HelpCircle, Inbox, ImageIcon, FileStack } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatCard } from "@/components/admin/ui/stat-card";

export const metadata = { title: "Dashboard" };

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
                  <span className="shrink-0 text-xs text-muted">{inquiry.createdAt.toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <h3 className="mb-5 flex items-center gap-2 font-heading text-lg font-medium text-primary">
            <FileStack className="h-4 w-4" /> Quick Links
          </h3>
          <ul className="space-y-1">
            {[
              { label: "Edit Home Page", href: "/admin/content/home" },
              { label: "Add Portfolio Project", href: "/admin/portfolio/new" },
              { label: "Write a Blog Post", href: "/admin/blog/new" },
              { label: "Update Website Settings", href: "/admin/settings" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-background">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
