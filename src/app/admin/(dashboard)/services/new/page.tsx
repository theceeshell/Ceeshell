import { PageHeader } from "@/components/admin/ui/page-header";
import { ServiceForm } from "@/components/admin/services/service-form";

export const metadata = { title: "New Service" };

export default function NewServicePage() {
  return (
    <div>
      <PageHeader title="New Service" description="Create a new service to showcase across the site." />
      <ServiceForm />
    </div>
  );
}
