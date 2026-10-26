import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { PortfolioManager, type PortfolioProjectRow } from "@/components/admin/portfolio/portfolio-manager";

export const metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    orderBy: { order: "asc" },
    include: { industries: true },
  });

  const rows: PortfolioProjectRow[] = projects.map((project) => ({
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
    visible: project.visible,
    order: project.order,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
  }));

  return (
    <div>
      <PageHeader title="Portfolio" description="Manage the case studies shown across the portfolio and industry pages." />
      <PortfolioManager projects={rows} />
    </div>
  );
}
