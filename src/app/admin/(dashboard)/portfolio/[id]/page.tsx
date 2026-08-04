import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { PortfolioForm } from "@/components/admin/portfolio/portfolio-form";
import type { PortfolioProjectRow } from "@/components/admin/portfolio/portfolio-manager";

export const metadata = { title: "Edit Portfolio Project" };

export default async function EditPortfolioProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, industries, testimonials] = await Promise.all([
    prisma.portfolioProject.findUnique({ where: { id }, include: { industries: true } }),
    prisma.industry.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!project) notFound();

  const row: PortfolioProjectRow = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    client: project.client,
    industry: project.industry,
    year: project.year,
    categories: project.categories as string[],
    servicesUsed: project.servicesUsed as string[],
    excerpt: project.excerpt,
    coverImageUrl: project.coverImageUrl,
    coverAspect: project.coverAspect,
    gallery: project.gallery as string[],
    challenge: project.challenge,
    research: project.research,
    strategy: project.strategy,
    concept: project.concept,
    designProcess: project.designProcess,
    photography: project.photography,
    printing: project.printing,
    deliverables: project.deliverables as string[],
    testimonialId: project.testimonialId,
    industryIds: project.industries.map((industry) => industry.id),
    featured: project.featured,
    order: project.order,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
  };

  return (
    <div>
      <PageHeader title="Edit Portfolio Project" description={`Editing "${project.title}"`} />
      <PortfolioForm
        initialValues={row}
        industries={industries.map((industry) => ({ id: industry.id, name: industry.name }))}
        testimonials={testimonials.map((t) => ({ id: t.id, label: `${t.clientName} — ${t.company}` }))}
      />
    </div>
  );
}
