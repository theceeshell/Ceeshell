import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { IndustryForm } from "@/components/admin/industries/industry-form";
import { asStringArray } from "@/lib/cms/adapters";

export const metadata = { title: "Edit Industry" };

export default async function EditIndustryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [industry, projects] = await Promise.all([
    prisma.industry.findUnique({ where: { id }, include: { relatedProjects: { select: { id: true } } } }),
    prisma.portfolioProject.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
  ]);
  if (!industry) notFound();

  return (
    <div>
      <PageHeader title="Edit Industry" description={`Editing "${industry.name}"`} />
      <IndustryForm
        projects={projects}
        industry={{
          id: industry.id,
          name: industry.name,
          slug: industry.slug,
          summary: industry.summary,
          heroImageUrl: industry.heroImageUrl,
          painPoints: asStringArray(industry.painPoints),
          solutions: asStringArray(industry.solutions),
          projectIds: industry.relatedProjects.map((p) => p.id),
          visible: industry.visible,
          seoTitle: industry.seoTitle ?? "",
          seoDescription: industry.seoDescription ?? "",
        }}
      />
    </div>
  );
}
