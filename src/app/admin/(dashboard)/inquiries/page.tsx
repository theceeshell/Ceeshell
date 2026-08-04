import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { InquiryManager } from "@/components/admin/inquiries/inquiry-manager";

export const metadata = { title: "Contact Inquiries" };

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Contact Inquiries" description="Project inquiries submitted through the website." />
      <InquiryManager inquiries={inquiries} />
    </div>
  );
}
