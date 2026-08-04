import type { ResolvedSection } from "@/lib/cms/resolve-section";
import { toProjectCard, toTestimonialCard, toServiceCard, toBlogCard } from "@/lib/cms/adapters";

import { Hero } from "@/components/sections/home/hero";
import { PageHero } from "@/components/shared/page-hero";
import { TrustedBy } from "@/components/sections/home/trusted-by";
import { ServicesOverview } from "@/components/sections/home/services-overview";
import { FeaturedProjects } from "@/components/sections/home/featured-projects";
import { Statistics } from "@/components/sections/home/statistics";
import { TestimonialsSection } from "@/components/sections/home/testimonials-section";
import { CardsSection } from "@/components/shared/cards-section";
import { RichTextSection } from "@/components/shared/rich-text-section";
import { TimelineSection } from "@/components/shared/timeline-section";
import { TeamShowcase } from "@/components/shared/team-showcase";
import { FaqSection } from "@/components/shared/faq-section";
import { ContactBlock } from "@/components/shared/contact-block";
import { IndustriesShowcase } from "@/components/shared/industries-showcase";
import { BlogShowcase } from "@/components/shared/blog-showcase";
import { ImageGallerySection } from "@/components/shared/image-gallery-section";
import { PortfolioGrid } from "@/components/shared/portfolio-grid";
import { CtaBanner } from "@/components/shared/cta-banner";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

interface SectionRendererProps {
  section: ResolvedSection;
  /** Only used when this section is a "hero" with variant "page". */
  breadcrumbLabel?: string;
}

export function SectionRenderer({ section, breadcrumbLabel }: SectionRendererProps) {
  const c = section.content as Record<string, any>;

  switch (section.type) {
    case "hero": {
      if (c.variant === "home") {
        return <Hero badge={c.badge} heading={c.heading} description={c.description} backgroundImageUrl={c.backgroundImageUrl} primaryButton={c.primaryButton} secondaryButton={c.secondaryButton} />;
      }
      return (
        <PageHero
          eyebrow={c.badge}
          title={c.heading}
          description={c.description}
          image={c.backgroundImageUrl}
          breadcrumbs={breadcrumbLabel ? [{ label: breadcrumbLabel }] : undefined}
          imagePriority
        />
      );
    }

    case "logoSlider":
      return <TrustedBy heading={c.heading} logos={c.logos} />;

    case "servicesShowcase":
      return (
        <ServicesOverview
          eyebrow={c.eyebrow}
          heading={c.heading}
          description={c.description}
          services={(c.services ?? []).map(toServiceCard)}
          viewAllLink={c.viewAllLink}
        />
      );

    case "cards":
      return (
        <CardsSection
          eyebrow={c.eyebrow}
          heading={c.heading}
          description={c.description}
          style={c.style}
          cards={c.cards}
          sideImageUrl={c.sideImageUrl}
          sideImageSecondaryUrl={c.sideImageSecondaryUrl}
          viewAllLink={c.viewAllLink}
        />
      );

    case "portfolioShowcase": {
      const projects = (c.projects ?? []).map(toProjectCard);
      if (c.displayStyle === "filterable") {
        return (
          <Section>
            <Container>
              {c.heading && <SectionHeading title={c.heading} description={c.description} className="mb-12 max-w-2xl" />}
              <PortfolioGrid projects={projects} />
            </Container>
          </Section>
        );
      }
      return <FeaturedProjects eyebrow={c.eyebrow} heading={c.heading} projects={projects} viewAllLink={c.viewAllLink} />;
    }

    case "stats":
      return <Statistics counters={c.counters} />;

    case "testimonials":
      return <TestimonialsSection eyebrow={c.eyebrow} heading={c.heading} testimonials={(c.testimonials ?? []).map(toTestimonialCard)} />;

    case "cta":
      return (
        <CtaBanner
          title={c.heading}
          description={c.description}
          primaryLabel={c.primaryButton?.label}
          primaryHref={c.primaryButton?.href}
          secondaryLabel={c.secondaryButton?.label}
          secondaryHref={c.secondaryButton?.href}
        />
      );

    case "richText":
      return <RichTextSection {...(c as any)} />;

    case "timeline":
      return <TimelineSection eyebrow={c.eyebrow} heading={c.heading} layout={c.layout} items={c.items} />;

    case "teamShowcase":
      return (
        <TeamShowcase
          eyebrow={c.eyebrow}
          heading={c.heading}
          members={(c.members ?? []).map((m: any) => ({ name: m.name, position: m.position, bio: m.bio }))}
        />
      );

    case "faq":
      return (
        <FaqSection
          eyebrow={c.eyebrow}
          heading={c.heading}
          faqs={(c.faqs ?? []).map((f: any) => ({ id: f.id, question: f.question, answer: f.answer }))}
          layout={c.layout}
        />
      );

    case "contactBlock":
      if (!c.siteSettings) return null;
      return (
        <ContactBlock
          heading={c.heading}
          description={c.description}
          showMap={c.showMap}
          faqs={(c.faqs ?? []).map((f: any) => ({ id: f.id, question: f.question, answer: f.answer }))}
          siteSettings={c.siteSettings}
        />
      );

    case "industriesShowcase":
      return (
        <IndustriesShowcase
          eyebrow={c.eyebrow}
          heading={c.heading}
          description={c.description}
          industries={(c.industries ?? []).map((i: any) => ({ slug: i.slug, name: i.name, heroImageUrl: i.heroImageUrl }))}
        />
      );

    case "blogShowcase":
      return <BlogShowcase heading={c.heading} posts={(c.posts ?? []).map(toBlogCard)} />;

    case "imageGallery":
      return <ImageGallerySection heading={c.heading} description={c.description} images={c.images} />;

    default:
      return null;
  }
}
