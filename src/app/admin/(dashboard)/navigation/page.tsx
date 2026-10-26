import { prisma } from "@/lib/db";
import { getLinkOptions } from "@/lib/cms/link-options";
import { getSession } from "@/lib/auth/session";
import { AccessDenied } from "@/components/admin/ui/access-denied";
import { PageHeader } from "@/components/admin/ui/page-header";
import { NavigationManager } from "@/components/admin/navigation/navigation-manager";

export const metadata = { title: "Navigation" };

export default async function AdminNavigationPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return <AccessDenied title="Navigation" description="Manage the main site menu." />;
  }

  const [items, linkOptions] = await Promise.all([prisma.navigationItem.findMany({ orderBy: { order: "asc" } }), getLinkOptions()]);

  return (
    <div>
      <PageHeader title="Navigation" description="Manage the main site menu." />
      <NavigationManager items={items} linkOptions={linkOptions} />
    </div>
  );
}
