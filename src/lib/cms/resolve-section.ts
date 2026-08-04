import "server-only";
import { prisma } from "@/lib/db";
import type { SectionType } from "@/lib/cms/section-types";

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
        rows = await prisma.portfolioProject.findMany({ orderBy: { order: "asc" } });
      } else {
        rows = byIdOrder(await prisma.portfolioProject.findMany({ where: { id: { in: ids } } }), ids);
      }
      return { ...content, projects: limit ? rows.slice(0, limit) : rows };
    }

    case "servicesShowcase": {
      const ids = (content.serviceIds as string[]) ?? [];
      const rows =
        ids.length > 0
          ? byIdOrder(await prisma.service.findMany({ where: { id: { in: ids } } }), ids)
          : await prisma.service.findMany({ where: { featured: true }, orderBy: { order: "asc" } });
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
      const [rows, settings] = await Promise.all([
        ids.length > 0
          ? byIdOrder(await prisma.faq.findMany({ where: { id: { in: ids } } }), ids)
          : prisma.faq.findMany({ orderBy: { order: "asc" }, take: 5 }),
        prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
      ]);
      return {
        ...content,
        faqs: rows,
        siteSettings: settings
          ? {
              email: settings.email,
              phone: settings.phone,
              address: settings.address,
              businessHours: settings.businessHours,
              googleMapsUrl: settings.googleMapsUrl,
              socialLinks: settings.socialLinks as Record<string, string>,
            }
          : null,
      };
    }

    case "industriesShowcase": {
      const ids = (content.industryIds as string[]) ?? [];
      const rows =
        ids.length > 0
          ? byIdOrder(await prisma.industry.findMany({ where: { id: { in: ids } } }), ids)
          : await prisma.industry.findMany({ orderBy: { order: "asc" } });
      return { ...content, industries: rows };
    }

    case "blogShowcase": {
      const ids = (content.postIds as string[]) ?? [];
      const rows =
        ids.length > 0
          ? byIdOrder(await prisma.blogPost.findMany({ where: { id: { in: ids } } }), ids)
          : await prisma.blogPost.findMany({ where: { status: "published" }, orderBy: { publishDate: "desc" } });
      return { ...content, posts: rows };
    }

    default:
      return content;
  }
}

export async function getPageWithSections(slug: string) {
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
}
