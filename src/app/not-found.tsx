import type { Metadata } from "next";
import { StatusMessage } from "@/components/shared/status-message";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Unmatched URLs render outside the marketing layout, so this one has no navbar/footer. */
export default function NotFound() {
  return (
    <main className="flex flex-1 items-center">
      <StatusMessage
        eyebrow="404"
        title="We couldn't find that page"
        description="It may have moved, or the link may be out of date."
      />
    </main>
  );
}
