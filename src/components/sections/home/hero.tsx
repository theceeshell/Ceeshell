import Image from "@/components/ui/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/shared/reveal";

interface HeroButton {
  label: string;
  href: string;
}

interface HeroProps {
  badge?: string;
  heading: string;
  description?: string;
  backgroundImageUrl: string;
  primaryButton?: HeroButton;
  secondaryButton?: HeroButton;
  /** general.heroScroll text. */
  scrollLabel: string;
  /** accessibility.heroImageAlt / accessibility.heroScroll texts. */
  imageAlt: string;
  scrollAriaLabel: string;
}

export function Hero({ badge, heading, description, backgroundImageUrl, primaryButton, secondaryButton, scrollLabel, imageAlt, scrollAriaLabel }: HeroProps) {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-primary text-white">
      <Image
        src={backgroundImageUrl}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary via-primary/55 to-primary/20" />

      <Container className="relative flex flex-col gap-10 pb-24 pt-48 sm:pb-28">
        {badge && (
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">{badge}</span>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <h1 className="max-w-4xl text-balance font-heading text-5xl font-medium leading-[1.04] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            {heading}
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={0.2}>
            <p className="max-w-xl text-balance text-lg leading-relaxed text-white/80 sm:text-xl">{description}</p>
          </Reveal>
        )}

        {(primaryButton || secondaryButton) && (
          <Reveal delay={0.3}>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              {primaryButton && (
                <Button asChild variant="light" size="lg">
                  <Link href={primaryButton.href}>{primaryButton.label}</Link>
                </Button>
              )}
              {secondaryButton && (
                <Button asChild variant="outlineLight" size="lg">
                  <Link href={secondaryButton.href}>{secondaryButton.label}</Link>
                </Button>
              )}
            </div>
          </Reveal>
        )}
      </Container>

      <Link
        href="#trusted-by"
        aria-label={scrollAriaLabel}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white sm:flex"
      >
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">{scrollLabel}</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </Link>
    </section>
  );
}
