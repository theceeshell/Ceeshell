import "server-only";
import { prisma } from "@/lib/db";
import { pagePath } from "@/lib/cms/pages";

export interface LinkOption {
  group: string;
  label: string;
  href: string;
}

/** Every page on the site an editor might want to link to, for the link picker. */
export async function getLinkOptions(): Promise<LinkOption[]> {
  const [pages, services, industries] = await Promise.all([
    prisma.page.findMany({ orderBy: { createdAt: "asc" }, select: { slug: true, title: true } }),
    prisma.service.findMany({ where: { visible: true }, orderBy: { order: "asc" }, select: { slug: true, name: true } }),
    prisma.industry.findMany({ where: { visible: true }, orderBy: { order: "asc" }, select: { slug: true, name: true } }),
  ]);
  return [
    ...pages.map((p) => ({ group: "Pages", label: p.title, href: pagePath(p.slug) })),
    ...services.map((s) => ({ group: "Services", label: s.name, href: `/services/${s.slug}` })),
    ...industries.map((i) => ({ group: "Industries", label: i.name, href: `/industries/${i.slug}` })),
  ];
}
