import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";
import { livePostFilter } from "@/lib/cms/blog";

// Regenerated with the rest of the site whenever content changes (revalidateSite()).
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, services, projects, industries, posts] = await Promise.all([
    prisma.page.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.service.findMany({ where: { visible: true }, select: { slug: true, updatedAt: true } }),
    prisma.portfolioProject.findMany({ where: { visible: true }, select: { slug: true, updatedAt: true } }),
    prisma.industry.findMany({ where: { visible: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: livePostFilter(), select: { slug: true, updatedAt: true } }),
  ]);

  const url = (path: string) => `${siteConfig.url}${path}`;

  return [
    ...pages.map((page) => ({
      url: url(page.slug === "home" ? "" : `/${page.slug}`),
      lastModified: page.updatedAt,
      priority: page.slug === "home" ? 1 : 0.8,
    })),
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), lastModified: s.updatedAt, priority: 0.7 })),
    ...projects.map((p) => ({ url: url(`/portfolio/${p.slug}`), lastModified: p.updatedAt, priority: 0.6 })),
    ...industries.map((i) => ({ url: url(`/industries/${i.slug}`), lastModified: i.updatedAt, priority: 0.6 })),
    ...posts.map((p) => ({ url: url(`/blog/${p.slug}`), lastModified: p.updatedAt, priority: 0.5 })),
    { url: url("/privacy-policy"), priority: 0.2 },
    { url: url("/terms"), priority: 0.2 },
  ];
}
