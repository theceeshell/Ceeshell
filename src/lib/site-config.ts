/**
 * Absolute origin of the public site, without a trailing slash. Used for
 * metadataBase, canonical URLs, the sitemap and robots.txt.
 *
 * NEXT_PUBLIC_SITE_URL wins when set (set it once a custom domain is live).
 * Otherwise Vercel's VERCEL_PROJECT_PRODUCTION_URL (available at build and
 * runtime) points at the production domain, so preview deployments still
 * canonicalize to production instead of to themselves.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;
  return "http://localhost:3000";
}

/**
 * Static fallbacks for when SiteSettings can't be read. Real contact details,
 * social links etc. live in the database (Admin -> Site Settings).
 */
export const siteConfig = {
  name: "Cee-Shell",
  tagline: "Creative Branding, Photography & Packaging Studio",
  description:
    "Cee-Shell is a full-service creative agency helping ambitious brands communicate better through strategic branding, graphic design, commercial photography, packaging and print.",
  url: resolveSiteUrl(),
};

/** Initial navigation, used only by the seed script. */
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Industries", href: "/industries" },
  { label: "Process", href: "/process" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
