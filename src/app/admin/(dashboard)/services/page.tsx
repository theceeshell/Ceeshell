import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { ServiceManager } from "@/components/admin/services/service-manager";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Services" description="Manage the services showcased across the site." />
      <ServiceManager services={services} />
    </div>
  );
}
