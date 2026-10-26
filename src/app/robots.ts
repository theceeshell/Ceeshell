import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms/site-data";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 86400;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings().catch(() => null);
  const indexable = settings?.robotsIndex ?? true;

  return {
    rules: indexable ? { userAgent: "*", allow: "/", disallow: "/admin" } : { userAgent: "*", disallow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
