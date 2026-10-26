import { prisma } from "@/lib/db";
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

  const items = await prisma.navigationItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Navigation" description="Manage the main site menu." />
      <NavigationManager items={items} />
    </div>
  );
}
