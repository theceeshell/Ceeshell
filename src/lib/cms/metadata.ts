import "server-only";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms/site-data";

/**
 * Per-page metadata with a self-referencing canonical URL. (Next resolves
 * relative URLs against metadataBase, not the current route, so each page
 * must state its own path.) openGraph is replaced wholesale by child
 * segments, so the site-wide fields are repeated here.
 */
export async function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  absoluteTitle = false,
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  /** Skip the "%s — Site Name" title template (used by the home page). */
  absoluteTitle?: boolean;
}): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: description ?? undefined,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: settings?.websiteName,
      title,
      description: description ?? undefined,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}
