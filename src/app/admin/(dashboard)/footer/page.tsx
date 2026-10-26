import { prisma } from "@/lib/db";
import { getLinkOptions } from "@/lib/cms/link-options";
import { getSession } from "@/lib/auth/session";
import { AccessDenied } from "@/components/admin/ui/access-denied";
import { PageHeader } from "@/components/admin/ui/page-header";
import { FooterConfigForm } from "@/components/admin/footer/footer-config-form";
import type { FooterLink } from "@/lib/validators/footer";

export const metadata = { title: "Footer" };

export default async function AdminFooterPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return <AccessDenied title="Footer" description="Manage the footer content shown on every page." />;
  }

  const [footer, linkOptions] = await Promise.all([prisma.footerConfig.findUnique({ where: { id: "singleton" } }), getLinkOptions()]);

  return (
    <div>
      <PageHeader title="Footer" description="Manage the footer content shown on every page." />
      <FooterConfigForm
        linkOptions={linkOptions}
        initialValues={{
          description: footer?.description ?? "",
          copyrightText: footer?.copyrightText ?? "",
          privacyPolicyHref: footer?.privacyPolicyHref ?? "/privacy-policy",
          termsHref: footer?.termsHref ?? "/terms",
          quickLinks: (footer?.quickLinks as FooterLink[] | undefined) ?? [],
          serviceLinks: (footer?.serviceLinks as FooterLink[] | undefined) ?? [],
        }}
      />
    </div>
  );
}
