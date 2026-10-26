import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/cms/resolve-section";
import { pageMetadata } from "@/lib/cms/metadata";
import { SectionRenderer } from "@/components/cms/section-renderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithSections("about");
  if (!page) return {};
  return pageMetadata({ title: page.title, description: page.description, path: "/about" });
}

export default async function AboutPage() {
  const page = await getPageWithSections("about");
  if (!page) notFound();

  return (
    <>
      {page.resolvedSections.map((section) => (
        <SectionRenderer key={section.id} section={section} breadcrumbLabel={page.title} />
      ))}
    </>
  );
}
