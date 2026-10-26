import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { getLinkOptions } from "@/lib/cms/link-options";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AccessDenied } from "@/components/admin/ui/access-denied";
import { RedirectManager } from "@/components/admin/redirects/redirect-manager";

export const metadata = { title: "Redirects" };

const DESCRIPTION = "Old web addresses that forward visitors (and Google) to the new page.";

export default async function RedirectsPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return <AccessDenied title="Redirects" description={DESCRIPTION} />;

  const [redirects, linkOptions] = await Promise.all([
    prisma.redirect.findMany({ orderBy: { createdAt: "desc" } }),
    getLinkOptions(),
  ]);

  return (
    <div>
      <PageHeader title="Redirects" description={DESCRIPTION} />
      <RedirectManager redirects={redirects} linkOptions={linkOptions} />
    </div>
  );
}
