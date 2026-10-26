import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { IndustryForm } from "@/components/admin/industries/industry-form";

export const metadata = { title: "New Industry" };

export default async function NewIndustryPage() {
  const projects = await prisma.portfolioProject.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } });

  return (
    <div>
      <PageHeader title="New Industry" description="Add an industry page to the website." />
      <IndustryForm projects={projects} />
    </div>
  );
}
