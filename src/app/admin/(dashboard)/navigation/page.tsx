import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { NavigationManager } from "@/components/admin/navigation/navigation-manager";

export const metadata = { title: "Navigation" };

export default async function AdminNavigationPage() {
  const items = await prisma.navigationItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Navigation" description="Manage the main site menu." />
      <NavigationManager items={items} />
    </div>
  );
}
