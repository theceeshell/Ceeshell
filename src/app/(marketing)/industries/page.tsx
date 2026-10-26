import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/cms/resolve-section";
import { pageMetadata } from "@/lib/cms/metadata";
import { SectionRenderer } from "@/components/cms/section-renderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithSections("industries");
  if (!page) return {};
  return pageMetadata({ title: page.title, description: page.description, path: "/industries" });
}

export default async function IndustriesPage() {
  const page = await getPageWithSections("industries");
  if (!page) notFound();

  return (
    <>
      {page.resolvedSections.map((section) => (
        <SectionRenderer key={section.id} section={section} breadcrumbLabel={page.title} />
      ))}
    </>
  );
}
