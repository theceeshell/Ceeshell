import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/cms/site-data";
import type { SectionType } from "@/lib/cms/section-types";
import { livePostFilter } from "@/lib/cms/blog";

function byIdOrder<T extends { id: string }>(rows: T[], ids: string[]): T[] {
  const map = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => map.get(id)).filter((r): r is T => Boolean(r));
}

export interface ResolvedSection {
  id: string;
  type: SectionType;
  name: string;
  content: Record<string, unknown>;
}

/**
 * Given a raw Section row, resolves any referenced entities (by id) against
 * the live tables and returns a single flattened content object ready to
 * spread into the matching section component's props. Sections with no
 * references (hero, richText, cards, stats, imageGallery, logoSlider,
 * timeline, cta) are returned unchanged.
 *
 * Services, projects and industries switched off in the admin (visible: false)
 * are never returned, even when a section references them by id.
 */
export async function resolveSectionContent(section: {
  type: string;
  content: unknown;
}): Promise<Record<string, unknown>> {
  const content = section.content as Record<string, unknown>;

  switch (section.type as SectionType) {
    case "testimonials": {
      const ids = (content.testimonialIds as string[]) ?? [];
      const rows =
        ids.length > 0
          ? byIdOrder(await prisma.testimonial.findMany({ where: { id: { in: ids } } }), ids)
          : await prisma.testimonial.findMany({ where: { featured: true }, orderBy: { order: "asc" } });
      return { ...content, testimonials: rows };
    }

    case "portfolioShowcase": {
      const ids = (content.projectIds as string[]) ?? [];
      const limit = content.limit as number | undefined;
      let rows;
      if (content.displayStyle === "filterable" || ids.length === 0) {
        rows = await prisma.portfolioProject.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
      } else {
        rows = byIdOrder(await prisma.portfolioProject.findMany({ where: { id: { in: ids }, visible: true } }), ids);
      }
      return { ...content, projects: limit ? rows.slice(0, limit) : rows };
    }

    case "servicesShowcase": {
      const ids = (content.serviceIds as string[]) ?? [];
      const rows =
        ids.length > 0
          ? byIdOrder(await prisma.service.findMany({ where: { id: { in: ids }, visible: true } }), ids)
          : await prisma.service.findMany({ where: { featured: true, visible: true }, orderBy: { order: "asc" } });
      return { ...content, services: rows };
    }

    case "teamShowcase": {
      const ids = (content.memberIds as string[]) ?? [];
      const rows =
        ids.length > 0
          ? byIdOrder(await prisma.teamMember.findMany({ where: { id: { in: ids } } }), ids)
          : await prisma.teamMember.findMany({ where: { active: true }, orderBy: { order: "asc" } });
      return { ...content, members: rows };
    }

    case "faq": {
      const ids = (content.faqIds as string[]) ?? [];
      const category = content.category as string | undefined;
      const rows =
        ids.length > 0
          ? byIdOrder(await prisma.faq.findMany({ where: { id: { in: ids } } }), ids)
          : await prisma.faq.findMany({
              where: category ? { category } : undefined,
              orderBy: { order: "asc" },
            });
      return { ...content, faqs: rows };
    }

    case "contactBlock": {
      const ids = (content.faqIds as string[]) ?? [];
      const [rows, settings, industries, services] = await Promise.all([
        ids.length > 0
          ? byIdOrder(await prisma.faq.findMany({ where: { id: { in: ids } } }), ids)
          : prisma.faq.findMany({ orderBy: { order: "asc" }, take: 5 }),
        getSiteSettings().catch(() => null),
        prisma.industry.findMany({ where: { visible: true }, orderBy: { order: "asc" }, select: { slug: true, name: true } }),
        prisma.service.findMany({ where: { visible: true }, orderBy: { order: "asc" }, select: { slug: true, shortName: true } }),
      ]);
      return {
        ...content,
        faqs: rows,
        industryOptions: industries.map((i) => ({ slug: i.slug, label: i.name })),
        serviceOptions: services.map((s) => ({ slug: s.slug, label: s.shortName })),
        siteSettings: settings
          ? {
              email: settings.email,
              phone: settings.phone,
              address: settings.address,
              businessHours: settings.businessHours,
              googleMapsUrl: settings.googleMapsUrl,
              socialLinks: settings.socialLinks,
            }
          : null,
      };
    }

    case "industriesShowcase": {
      const ids = (content.industryIds as string[]) ?? [];
      const rows =
        ids.length > 0
          ? byIdOrder(await prisma.industry.findMany({ where: { id: { in: ids }, visible: true } }), ids)
          : await prisma.industry.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
      return { ...content, industries: rows };
    }

    case "blogShowcase": {
      const ids = (content.postIds as string[]) ?? [];
      const rows =
        ids.length > 0
          ? byIdOrder(await prisma.blogPost.findMany({ where: { id: { in: ids }, ...livePostFilter() } }), ids)
          : await prisma.blogPost.findMany({ where: livePostFilter(), orderBy: { publishDate: "desc" } });
      return { ...content, posts: rows };
    }

    default:
      return content;
  }
}

/** Memoized per render: generateMetadata and the page both call this. */
export const getPageWithSections = cache(async (slug: string) => {
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { sections: { where: { enabled: true }, orderBy: { order: "asc" } } },
  });
  if (!page) return null;

  const resolvedSections: ResolvedSection[] = await Promise.all(
    page.sections.map(async (s) => ({
      id: s.id,
      type: s.type as SectionType,
      name: s.name,
      content: await resolveSectionContent(s),
    }))
  );

  return { ...page, resolvedSections };
});
