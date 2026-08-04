import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SiteSettingsForm } from "@/components/admin/settings/site-settings-form";

export const metadata = { title: "Website Settings" };

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div>
      <PageHeader title="Website Settings" description="Core business information shown across the site." />
      <SiteSettingsForm
        initialValues={{
          websiteName: settings?.websiteName ?? "",
          companyName: settings?.companyName ?? "",
          tagline: settings?.tagline ?? "",
          email: settings?.email ?? "",
          phone: settings?.phone ?? "",
          whatsapp: settings?.whatsapp ?? "",
          address: settings?.address ?? "",
          businessHours: settings?.businessHours ?? "",
          googleMapsUrl: settings?.googleMapsUrl ?? "",
          socialLinks: (settings?.socialLinks as Record<string, string>) ?? {},
          logoUrl: settings?.logoUrl ?? "",
          footerLogoUrl: settings?.footerLogoUrl ?? "",
          faviconUrl: settings?.faviconUrl ?? "",
        }}
      />
    </div>
  );
}
