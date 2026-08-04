import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { ServiceForm } from "@/components/admin/services/service-form";

export const metadata = { title: "Edit Service" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <PageHeader title="Edit Service" description={`Editing "${service.name}"`} />
      <ServiceForm service={service} />
    </div>
  );
}
