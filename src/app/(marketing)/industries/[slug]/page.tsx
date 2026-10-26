import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/cms/metadata";
import { getSiteTexts } from "@/lib/cms/site-data";
import { fill } from "@/lib/cms/site-texts";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/shared/project-card";
import { CtaBanner, ctaProps } from "@/components/shared/cta-banner";
import { toProjectCard } from "@/lib/cms/adapters";

export async function generateStaticParams() {
  const industries = await prisma.industry.findMany({ where: { visible: true }, select: { slug: true } });
  return industries.map((industry) => ({ slug: industry.slug }));
}

/** Hidden industries are treated exactly like missing ones; hidden projects are left out. */
const getIndustry = cache((slug: string) =>
  prisma.industry.findFirst({
    where: { slug, visible: true },
    include: { relatedProjects: { where: { visible: true }, orderBy: { order: "asc" } } },
  })
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry) return {};
  return pageMetadata({
    title: industry.seoTitle || industry.name,
    description: industry.seoDescription || industry.summary,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry) notFound();

  const painPoints = industry.painPoints as string[];
  const solutions = industry.solutions as string[];
  const relatedWork = industry.relatedProjects.map(toProjectCard);
  const texts = await getSiteTexts();
  const t = texts.industryPage;

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={industry.name}
        description={industry.summary}
        image={industry.heroImageUrl}
        breadcrumbs={{
          home: texts.breadcrumbs.home,
          trail: [{ label: texts.breadcrumbs.industries, href: "/industries" }, { label: industry.name }],
        }}
        imagePriority
      />

      <Section>
        <Container className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal className="rounded-[1.75rem] border border-border bg-surface p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/8 text-primary">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h2 className="mt-6 font-heading text-2xl font-medium text-primary">{t.painPointsHeading}</h2>
            <ul className="mt-6 space-y-4">
              {painPoints.map((point) => (
                <li key={point} className="border-l-2 border-border pl-4 text-sm leading-relaxed text-muted">
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="rounded-[1.75rem] border border-border bg-primary p-10 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="mt-6 font-heading text-2xl font-medium text-white">{t.solutionsHeading}</h2>
            <ul className="mt-6 space-y-4">
              {solutions.map((solution) => (
                <li key={solution} className="border-l-2 border-white/25 pl-4 text-sm leading-relaxed text-white/75">
                  {solution}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {relatedWork.length > 0 && (
        <Section className="bg-surface">
          <Container>
            <SectionHeading eyebrow={t.workEyebrow} title={fill(t.workHeading, { industry: industry.name })} className="max-w-2xl" />
            <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedWork.map((project) => (
                <RevealItem key={project.slug}>
                  <ProjectCard project={project} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      )}

      <CtaBanner
        {...ctaProps(texts.cta)}
        title={fill(t.ctaHeading, { industry: industry.name })}
        description={t.ctaText}
      />
    </>
  );
}
