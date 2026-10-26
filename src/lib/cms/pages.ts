/**
 * Pages with their own route file (fixed web address, can't be deleted).
 * Every other Page row is a custom page served by app/(marketing)/[slug].
 */
export const SYSTEM_PAGE_SLUGS = ["home", "about", "services", "portfolio", "industries", "process", "blog", "contact", "faq"] as const;

/** Web addresses a custom page can't take (existing routes and files). */
const RESERVED_SLUGS = new Set<string>([...SYSTEM_PAGE_SLUGS, "admin", "api", "sitemap", "robots", "opengraph-image", "favicon", "uploads"]);

export function isSystemPage(slug: string) {
  return (SYSTEM_PAGE_SLUGS as readonly string[]).includes(slug);
}

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.has(slug);
}

export function pagePath(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}
