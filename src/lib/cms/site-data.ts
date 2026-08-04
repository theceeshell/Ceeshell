import "server-only";
import { prisma } from "@/lib/db";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    throw new Error("SiteSettings singleton row is missing — run `npm run db:seed`.");
  }
  return { ...settings, socialLinks: settings.socialLinks as Record<string, string> };
}

export async function getFooterConfig() {
  const footer = await prisma.footerConfig.findUnique({ where: { id: "singleton" } });
  if (!footer) {
    throw new Error("FooterConfig singleton row is missing — run `npm run db:seed`.");
  }
  return {
    ...footer,
    quickLinks: footer.quickLinks as { label: string; href: string }[],
    serviceLinks: footer.serviceLinks as { label: string; href: string }[],
  };
}

export async function getNavigationItems() {
  return prisma.navigationItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
}
