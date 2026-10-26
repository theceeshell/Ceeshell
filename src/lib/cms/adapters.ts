/**
 * Prisma rows are named for the database (coverImageUrl, heroImageUrl,
 * review/clientName/position, publishDate, etc). The existing visual
 * components were built against the old static-data shapes (coverImage,
 * heroImage, quote/author/role, date). Rather than touch every visual
 * component's prop names -- and risk the frontend drifting from the
 * approved design -- these adapters translate DB rows into the exact shape
 * each component already expects.
 */
import type { ProjectCardData } from "@/components/shared/project-card";
import type { TestimonialCardData } from "@/components/shared/testimonial-slider";
import type { ServiceCardData } from "@/components/shared/service-card";
import { fill } from "@/lib/cms/site-texts";

type JsonArray = unknown[];

export function toProjectCard(row: {
  slug: string;
  title: string;
  categories: unknown;
  coverImageUrl: string;
  coverAspect: string;
}): ProjectCardData {
  return {
    slug: row.slug,
    title: row.title,
    categories: row.categories as string[],
    coverImage: row.coverImageUrl,
    coverAspect: (row.coverAspect as ProjectCardData["coverAspect"]) ?? "landscape",
  };
}

export function toTestimonialCard(row: {
  review: string;
  clientName: string;
  position: string;
  company: string;
}): TestimonialCardData {
  return { quote: row.review, author: row.clientName, role: row.position, company: row.company };
}

export function toServiceCard(row: { slug: string; shortName: string; tagline: string; icon: string }): ServiceCardData {
  return { slug: row.slug, shortName: row.shortName, tagline: row.tagline, icon: row.icon };
}

export function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as JsonArray as string[]) : [];
}

/** `template` is the blog.readTime text, e.g. "{minutes} min read". */
export function estimateReadTime(html: string, template: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return fill(template, { minutes });
}

export interface BlogCardData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  readTime: string;
}

export function toBlogCard(
  row: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    featuredImageUrl: string;
    contentHtml: string;
  },
  readTimeTemplate: string
): BlogCardData {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    coverImage: row.featuredImageUrl,
    readTime: estimateReadTime(row.contentHtml, readTimeTemplate),
  };
}
