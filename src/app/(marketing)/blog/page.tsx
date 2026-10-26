import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/cms/resolve-section";
import { pageMetadata } from "@/lib/cms/metadata";
import { getSiteTexts } from "@/lib/cms/site-data";
import { SectionRenderer } from "@/components/cms/section-renderer";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { NewsletterForm } from "@/components/shared/newsletter-form";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithSections("blog");
  if (!page) return {};
  return pageMetadata({ title: page.title, description: page.description, path: "/blog" });
}

export default async function BlogPage() {
  const page = await getPageWithSections("blog");
  if (!page) notFound();
  const { newsletter } = await getSiteTexts();

  return (
    <>
      {page.resolvedSections.map((section) => (
        <SectionRenderer key={section.id} section={section} breadcrumbLabel={page.title} />
      ))}

      <Section className="bg-primary text-white" size="compact">
        <Container className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="font-heading text-3xl font-medium text-white sm:text-4xl">{newsletter.blogHeading}</h2>
          <p className="text-white/70">{newsletter.blogText}</p>
          <div className="w-full max-w-sm">
            <NewsletterForm dark texts={newsletter} />
          </div>
        </Container>
      </Section>
    </>
  );
}
