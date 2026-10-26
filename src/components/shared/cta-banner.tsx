import Link from "next/link";
import { ShellMotif } from "@/components/shared/shell-motif";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { SiteTexts } from "@/lib/cms/site-texts";

interface CtaBannerProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

/** The editable "Closing banner" texts (cta.*) as CtaBanner props. */
export function ctaProps(cta: SiteTexts["cta"]): CtaBannerProps {
  return {
    title: cta.heading,
    description: cta.text,
    primaryLabel: cta.primaryLabel,
    primaryHref: cta.primaryHref,
    secondaryLabel: cta.secondaryLabel,
    secondaryHref: cta.secondaryHref,
  };
}

export function CtaBanner({ title, description, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: CtaBannerProps) {
  return (
    <Section size="compact" className="bg-primary text-white">
      <ShellMotif size={620} className="absolute -bottom-40 -left-32 text-white/[0.06]" />
      <ShellMotif size={420} className="absolute -right-20 -top-20 rotate-180 text-white/[0.05]" />
      <Container className="relative flex flex-col items-center gap-8 text-center">
        <Reveal>
          <h2 className="text-balance max-w-3xl font-heading text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xl text-balance text-lg text-white/75">{description}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Button asChild variant="light" size="lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
