import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { FaqManager } from "@/components/admin/faqs/faq-manager";

export const metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="FAQs" description="Manage the questions and answers shown across the site." />
      <FaqManager faqs={faqs} />
    </div>
  );
}
