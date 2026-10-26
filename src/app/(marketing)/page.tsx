import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/cms/resolve-section";
import { pageMetadata } from "@/lib/cms/metadata";
import { getSiteSettings } from "@/lib/cms/site-data";
import { SectionRenderer } from "@/components/cms/section-renderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithSections("home");
  if (!page) return {};
  const settings = await getSiteSettings().catch(() => null);
  return pageMetadata({
    title: settings?.defaultSeoTitle || page.title,
    description: page.description,
    path: "/",
    absoluteTitle: true,
  });
}

export default async function Home() {
  const page = await getPageWithSections("home");
  if (!page) notFound();

  return (
    <>
      {page.resolvedSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}
