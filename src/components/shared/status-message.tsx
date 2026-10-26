import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface StatusMessageProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Default buttons, shown when no children are passed (notFound.homeButton / notFound.contactButton). */
  homeLabel?: string;
  contactLabel?: string;
  children?: React.ReactNode;
}

/** Full-height centered message for 404 / error states on the public site. */
export function StatusMessage({ eyebrow, title, description, homeLabel, contactLabel, children }: StatusMessageProps) {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-40 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
      <h1 className="max-w-2xl text-balance font-heading text-4xl font-medium text-primary sm:text-5xl">{title}</h1>
      <p className="max-w-md text-muted">{description}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {children ?? (
          <>
            {homeLabel && (
              <Button asChild>
                <Link href="/">{homeLabel}</Link>
              </Button>
            )}
            {contactLabel && (
              <Button asChild variant="secondary">
                <Link href="/contact">{contactLabel}</Link>
              </Button>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
