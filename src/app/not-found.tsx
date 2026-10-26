import type { Metadata } from "next";
import { StatusMessage } from "@/components/shared/status-message";
import { getSiteTexts } from "@/lib/cms/site-data";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Unmatched URLs render outside the marketing layout, so this one has no navbar/footer. */
export default async function NotFound() {
  const { notFound: t } = await getSiteTexts();
  return (
    <main className="flex flex-1 items-center">
      <StatusMessage
        eyebrow={t.eyebrow}
        title={t.heading}
        description={t.text}
        homeLabel={t.homeButton}
        contactLabel={t.contactButton}
      />
    </main>
  );
}
