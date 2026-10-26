import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { PortfolioForm } from "@/components/admin/portfolio/portfolio-form";
import { getSiteTexts } from "@/lib/cms/site-data";

export const metadata = { title: "New Portfolio Project" };

export default async function NewPortfolioProjectPage() {
  const [industries, testimonials, texts] = await Promise.all([
    prisma.industry.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    getSiteTexts(),
  ]);

  return (
    <div>
      <PageHeader title="New Portfolio Project" description="Add a new case study to the portfolio." />
      <PortfolioForm
        industries={industries.map((industry) => ({ id: industry.id, name: industry.name }))}
        testimonials={testimonials.map((t) => ({ id: t.id, label: `${t.clientName} — ${t.company}` }))}
        categories={texts.projectPage.categories}
      />
    </div>
  );
}
