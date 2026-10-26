import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";

// Wrapped in React cache() so layout, metadata and page share one query per render.

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    throw new Error("SiteSettings singleton row is missing — run `npm run db:seed`.");
  }
  return { ...settings, socialLinks: settings.socialLinks as Record<string, string> };
});

export const getFooterConfig = cache(async () => {
  const footer = await prisma.footerConfig.findUnique({ where: { id: "singleton" } });
  if (!footer) {
    throw new Error("FooterConfig singleton row is missing — run `npm run db:seed`.");
  }
  return {
    ...footer,
    quickLinks: footer.quickLinks as { label: string; href: string }[],
    serviceLinks: footer.serviceLinks as { label: string; href: string }[],
  };
});

export const getNavigationItems = cache(async () =>
  prisma.navigationItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } })
);
