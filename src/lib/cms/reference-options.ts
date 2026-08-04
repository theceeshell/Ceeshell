import "server-only";
import { prisma } from "@/lib/db";

export interface RefOption {
  id: string;
  label: string;
}

/** Fetches every entity that section content can reference by id, formatted for a picker UI. */
export async function getReferenceOptions() {
  const [testimonials, projects, services, members, faqs, industries, posts] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    prisma.portfolioProject.findMany({ orderBy: { order: "asc" } }),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
    prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    prisma.faq.findMany({ orderBy: { order: "asc" } }),
    prisma.industry.findMany({ orderBy: { order: "asc" } }),
    prisma.blogPost.findMany({ orderBy: { publishDate: "desc" } }),
  ]);

  return {
    testimonials: testimonials.map((t): RefOption => ({ id: t.id, label: `${t.clientName} — ${t.company}` })),
    projects: projects.map((p): RefOption => ({ id: p.id, label: p.title })),
    services: services.map((s): RefOption => ({ id: s.id, label: s.shortName })),
    members: members.map((m): RefOption => ({ id: m.id, label: m.name })),
    faqs: faqs.map((f): RefOption => ({ id: f.id, label: f.question })),
    industries: industries.map((i): RefOption => ({ id: i.id, label: i.name })),
    posts: posts.map((p): RefOption => ({ id: p.id, label: p.title })),
  };
}

export type ReferenceOptions = Awaited<ReturnType<typeof getReferenceOptions>>;
