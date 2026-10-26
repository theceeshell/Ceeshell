import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { IndustryManager } from "@/components/admin/industries/industry-manager";

export const metadata = { title: "Industries" };

export default async function AdminIndustriesPage() {
  const industries = await prisma.industry.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { relatedProjects: true } } },
  });

  return (
    <div>
      <PageHeader title="Industries" description="The industries you work in, each with its own page." />
      <IndustryManager
        industries={industries.map(({ _count, ...industry }) => ({ ...industry, projectCount: _count.relatedProjects }))}
      />
    </div>
  );
}
