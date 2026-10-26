import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface StatusMessageProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

/** Full-height centered message for 404 / error states on the public site. */
export function StatusMessage({ eyebrow, title, description, children }: StatusMessageProps) {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-40 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
      <h1 className="max-w-2xl text-balance font-heading text-4xl font-medium text-primary sm:text-5xl">{title}</h1>
      <p className="max-w-md text-muted">{description}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {children ?? (
          <>
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contact">Contact us</Link>
            </Button>
          </>
        )}
      </div>
    </Container>
  );
}
