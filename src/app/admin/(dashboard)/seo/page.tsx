import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SeoSettingsForm } from "@/components/admin/seo/seo-settings-form";

export const metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div>
      <PageHeader title="SEO" description="Default search engine and social sharing settings." />
      <SeoSettingsForm
        initialValues={{
          defaultSeoTitle: settings?.defaultSeoTitle ?? "",
          defaultSeoDescription: settings?.defaultSeoDescription ?? "",
          defaultOgImageUrl: settings?.defaultOgImageUrl ?? "",
          twitterCardType: (settings?.twitterCardType as "summary" | "summary_large_image") ?? "summary_large_image",
          robotsIndex: settings?.robotsIndex ?? true,
          robotsFollow: settings?.robotsFollow ?? true,
          googleVerification: settings?.googleVerification ?? "",
        }}
      />
    </div>
  );
}
