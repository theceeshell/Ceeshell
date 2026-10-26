import type { Metadata } from "next";
import { cache } from "react";
import Image from "@/components/ui/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/cms/metadata";
import { getSiteTexts } from "@/lib/cms/site-data";
import type { SiteTexts } from "@/lib/cms/site-texts";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/shared/project-card";
import { CtaBanner, ctaProps } from "@/components/shared/cta-banner";
import { toProjectCard } from "@/lib/cms/adapters";

export async function generateStaticParams() {
  const projects = await prisma.portfolioProject.findMany({ where: { visible: true }, select: { slug: true } });
  return projects.map((project) => ({ slug: project.slug }));
}

/** Hidden projects are treated exactly like missing ones. */
const getProject = cache((slug: string) =>
  prisma.portfolioProject.findFirst({ where: { slug, visible: true }, include: { testimonial: true } })
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.seoTitle || `${project.title} — Case Study`,
    description: project.seoDescription || project.excerpt,
    path: `/portfolio/${project.slug}`,
    image: project.coverImageUrl,
  });
}

function storyBlocks(
  project: { challenge: string; research: string; strategy: string; concept: string; designProcess: string; photography: string; printing: string },
  t: SiteTexts["projectPage"]
) {
  return [
    { label: t.challengeLabel, body: project.challenge },
    { label: t.researchLabel, body: project.research },
    { label: t.strategyLabel, body: project.strategy },
    { label: t.conceptLabel, body: project.concept },
    { label: t.designProcessLabel, body: project.designProcess },
    { label: t.photographyLabel, body: project.photography },
    { label: t.printingLabel, body: project.printing },
  ];
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const categories = project.categories as string[];
  const servicesUsed = project.servicesUsed as string[];
  const gallery = project.gallery as string[];
  const deliverables = project.deliverables as string[];

  const [allProjects, texts] = await Promise.all([
    prisma.portfolioProject.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true, categories: true, coverImageUrl: true, coverAspect: true },
    }),
    getSiteTexts(),
  ]);
  const t = texts.projectPage;
  const relatedRaw = allProjects.filter(
    (p) => p.slug !== slug && (p.categories as string[]).some((c) => categories.includes(c))
  ).slice(0, 3);
  const related = relatedRaw.map(toProjectCard);

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-primary text-white">
        <Image src={project.coverImageUrl} alt={project.title} fill priority sizes="100vw" className="absolute inset-0 -z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary via-primary/65 to-primary/25" />
        <Container className="relative flex flex-col gap-6 pb-20 pt-40">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-white/60">
            <Link href="/" className="hover:text-white">{texts.breadcrumbs.home}</Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-white">{texts.breadcrumbs.portfolio}</Link>
            <span>/</span>
            <span className="text-white/85">{project.title}</span>
          </nav>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge key={c} variant="light">{c}</Badge>
            ))}
          </div>
          <h1 className="max-w-4xl text-balance font-heading text-5xl font-medium leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {project.title}
          </h1>
          <p className="max-w-xl text-lg text-white/75">{project.excerpt}</p>
        </Container>
      </section>

      {/* Meta bar */}
      <Section size="compact" className="border-b border-border bg-surface py-10 sm:py-12">
        <Container className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <Meta label={t.clientLabel} value={project.client} />
          <Meta label={t.industryLabel} value={project.industry} />
          <Meta label={t.yearLabel} value={project.year} />
          <Meta label={t.servicesLabel} value={servicesUsed.join(", ")} />
        </Container>
      </Section>

      {/* Story */}
      <Section>
        <Container className="mx-auto max-w-3xl space-y-16">
          {storyBlocks(project, t).map((block, i) => (
            <Reveal key={block.label} delay={i * 0.02}>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{block.label}</span>
              <p className="mt-4 text-balance font-heading text-2xl font-medium leading-snug text-primary sm:text-3xl">
                {block.body}
              </p>
            </Reveal>
          ))}
        </Container>
      </Section>

      {/* Deliverables */}
      <Section className="bg-surface">
        <Container>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{t.deliverablesHeading}</span>
          <div className="mt-8 flex flex-wrap gap-3">
            {deliverables.map((d) => (
              <span key={d} className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-primary">
                {d}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* Gallery */}
      <Section>
        <Container>
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {gallery.map((src, i) => (
              <RevealItem key={i} className={i === 0 ? "sm:col-span-2" : undefined}>
                <div className={`relative w-full overflow-hidden rounded-[1.5rem] ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  <Image
                    src={src}
                    alt={`${project.title} gallery image ${i + 1}`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Testimonial */}
      {project.testimonial && (
        <Section className="bg-primary text-white">
          <Container>
            <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
              <Quote className="h-10 w-10 text-accent" strokeWidth={1.5} />
              <blockquote className="text-balance font-heading text-3xl font-medium leading-snug sm:text-4xl">
                &ldquo;{project.testimonial.review}&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold">{project.testimonial.clientName}</p>
                <p className="text-sm text-white/60">{project.testimonial.position}</p>
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <Section>
          <Container>
            <div className="flex items-end justify-between">
              <h2 className="font-heading text-3xl font-medium text-primary sm:text-4xl">{t.relatedHeading}</h2>
              <Link href="/portfolio" className="group hidden items-center gap-2 text-sm font-semibold text-primary sm:flex">
                {t.allWorkLink}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Next project */}
      <Link
        href={`/portfolio/${nextProject.slug}`}
        className="group relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-primary text-white"
      >
        <Image
          src={nextProject.coverImageUrl}
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover opacity-30 transition-transform duration-[1200ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-primary/70" />
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">{t.nextLabel}</span>
          <span className="font-heading text-4xl font-medium sm:text-6xl">{nextProject.title}</span>
          <span className="flex items-center gap-2 text-sm font-semibold">
            {t.viewCaseStudy} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      <CtaBanner {...ctaProps(texts.cta)} />
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1.5 font-medium text-primary">{value}</p>
    </div>
  );
}
