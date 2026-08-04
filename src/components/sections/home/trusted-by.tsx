import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/shared/reveal";
import { LogoMarquee } from "@/components/shared/logo-marquee";

export function TrustedBy({ heading, logos }: { heading?: string; logos: string[] }) {
  return (
    <section id="trusted-by" className="border-b border-border bg-surface py-16 sm:py-20">
      <Container className="space-y-10">
        {heading && (
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-muted">{heading}</p>
          </Reveal>
        )}
        <LogoMarquee logos={logos} />
      </Container>
    </section>
  );
}
