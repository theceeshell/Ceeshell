import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPageWithSections } from "@/lib/cms/resolve-section";
import { pageMetadata } from "@/lib/cms/metadata";
import { isSystemPage, SYSTEM_PAGE_SLUGS } from "@/lib/cms/pages";
import { SectionRenderer } from "@/components/cms/section-renderer";
import { redirectIfMoved } from "@/lib/cms/redirects";

/** Custom pages created in Admin -> Pages (privacy policy, terms, landing pages...). */
export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { slug: { notIn: [...SYSTEM_PAGE_SLUGS] } },
    select: { slug: true },
  });
  return pages.map((page) => ({ slug: page.slug }));
}

async function getCustomPage(slug: string) {
  return isSystemPage(slug) ? null : getPageWithSections(slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) return {};
  return pageMetadata({ title: page.title, description: page.description, path: `/${page.slug}` });
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) {
    await redirectIfMoved(`/${slug}`);
    notFound();
  }

  return (
    <>
      {page.resolvedSections.map((section) => (
        <SectionRenderer key={section.id} section={section} breadcrumbLabel={page.title} />
      ))}
    </>
  );
}
