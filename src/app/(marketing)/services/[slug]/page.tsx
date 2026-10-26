import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/cms/metadata";
import { getSiteTexts } from "@/lib/cms/site-data";
import { fill } from "@/lib/cms/site-texts";
import { PageHero } from "@/components/shared/page-hero";
import { GalleryMedia } from "@/components/shared/gallery-media";
import { stillImageUrl } from "@/lib/media";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { iconMap } from "@/components/shared/icon-map";
import { CtaBanner, ctaProps } from "@/components/shared/cta-banner";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { redirectIfMoved } from "@/lib/cms/redirects";

export async function generateStaticParams() {
  const services = await prisma.service.findMany({ where: { visible: true }, select: { slug: true } });
  return services.map((service) => ({ slug: service.slug }));
}

/** Hidden services are treated exactly like missing ones. */
const getService = cache((slug: string) => prisma.service.findFirst({ where: { slug, visible: true } }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seoTitle || service.name,
    description: service.seoDescription || service.summary,
    path: `/services/${service.slug}`,
    image: stillImageUrl(service.heroImageUrl),
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) {
    await redirectIfMoved(`/services/${slug}`);
    notFound();
  }

  const [otherServices, texts] = await Promise.all([
    prisma.service.findMany({ where: { slug: { not: service.slug }, visible: true }, orderBy: { order: "asc" } }),
    getSiteTexts(),
  ]);
  const t = texts.servicePage;

  const Icon = iconMap[service.icon];
  const overview = service.overview as string[];
  const benefits = service.benefits as { title: string; description: string }[];
  const subServices = service.subServices as { title: string; description: string }[];
  const process = service.process as { title: string; description: string }[];
  const gallery = service.gallery as string[];
  const faqs = service.faqs as { question: string; answer: string }[];

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={service.name}
        description={service.tagline}
        image={service.heroImageUrl}
        breadcrumbs={{
          home: texts.breadcrumbs.home,
          trail: [{ label: texts.breadcrumbs.services, href: "/services" }, { label: service.shortName }],
        }}
        imagePriority
      />

      {/* Overview */}
      <Section>
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/8 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="mt-8 font-heading text-3xl font-medium text-primary sm:text-4xl">{t.overviewHeading}</h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted">
              {overview.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <RevealItem key={benefit.title}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <h3 className="font-semibold text-primary">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{benefit.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Sub-services */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading eyebrow={t.capabilitiesEyebrow} title={fill(t.capabilitiesHeading, { service: service.shortName })} className="max-w-2xl" />
          <RevealGroup className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border sm:grid-cols-2">
            {subServices.map((sub) => (
              <RevealItem key={sub.title}>
                <div className="h-full bg-surface p-7">
                  <h3 className="font-semibold text-primary">{sub.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{sub.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Process */}
      <Section>
        <Container>
          <SectionHeading eyebrow={t.processEyebrow} title={t.processHeading} className="max-w-2xl" />
          <div className="relative mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08} className="relative">
                <span className="font-heading text-4xl font-medium text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-heading text-xl font-medium text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Gallery */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading eyebrow={t.workEyebrow} title={t.workHeading} className="max-w-2xl" />
          <RevealGroup className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {gallery.map((src, i) => (
              <RevealItem key={i} className={i === 0 ? "col-span-2 row-span-2" : undefined}>
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                  <GalleryMedia
                    src={src}
                    alt={fill(t.galleryAlt, { service: service.name, number: i + 1 })}
                    sizes="(min-width: 1024px) 30vw, 45vw"
                    className="transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container className="mx-auto max-w-3xl">
          <SectionHeading eyebrow={t.faqEyebrow} title={t.faqHeading} align="center" className="mx-auto" />
          <Reveal className="mt-12">
            <Accordion type="single" collapsible className="divide-y-0">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </Container>
      </Section>

      {/* Other services */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading eyebrow={t.moreEyebrow} title={t.moreHeading} className="max-w-2xl" />
          <div className="mt-10 flex flex-wrap gap-4">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                {s.shortName}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBanner
        {...ctaProps(texts.cta)}
        title={fill(t.ctaHeading, { service: service.shortName.toLowerCase() })}
        description={t.ctaText}
      />
    </>
  );
}
