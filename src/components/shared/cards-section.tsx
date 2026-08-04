import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { iconMap } from "@/components/shared/icon-map";

export interface CardItemData {
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export type CardsStyle = "default" | "iconList" | "numbered" | "bordered" | "achievements" | "twoColumn";

interface CardsSectionProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  style: CardsStyle;
  cards: CardItemData[];
  sideImageUrl?: string;
  sideImageSecondaryUrl?: string;
  viewAllLink?: { label: string; href: string };
}

export function CardsSection({
  eyebrow,
  heading,
  description,
  style,
  cards,
  sideImageUrl,
  sideImageSecondaryUrl,
  viewAllLink,
}: CardsSectionProps) {
  if (style === "iconList") {
    return (
      <Section className="bg-surface">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow={eyebrow} title={heading} description={description} />
            <RevealGroup className="mt-12 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
              {cards.map((item) => (
                <RevealItem key={item.title}>
                  <div className="flex gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-primary">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {sideImageUrl && (
            <Reveal direction="right" className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
                <Image src={sideImageUrl} alt={heading} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
              </div>
              {sideImageSecondaryUrl && (
                <div className="absolute -bottom-8 -left-8 hidden aspect-square w-40 overflow-hidden rounded-2xl border-4 border-background shadow-lift sm:block">
                  <Image src={sideImageSecondaryUrl} alt="" fill sizes="160px" className="object-cover" />
                </div>
              )}
            </Reveal>
          )}
        </Container>
      </Section>
    );
  }

  if (style === "numbered") {
    return (
      <Section>
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow={eyebrow} title={heading} description={description} className="max-w-2xl" />
            {viewAllLink && (
              <Link href={viewAllLink.href} className="group flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-primary lg:self-end">
                {viewAllLink.label}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            )}
          </div>

          <RevealGroup className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((step, i) => (
              <RevealItem key={step.title}>
                <div className="flex h-full flex-col gap-6 bg-surface p-8 sm:p-10">
                  <span className="font-heading text-4xl font-medium text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-heading text-2xl font-medium text-primary">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    );
  }

  if (style === "bordered") {
    return (
      <Section>
        <Container>
          <SectionHeading eyebrow={eyebrow} title={heading} description={description} align="center" className="mx-auto" />
          <RevealGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {cards.map((value, i) => (
              <RevealItem key={value.title}>
                <div className="flex gap-6 rounded-[1.5rem] border border-border bg-surface p-8">
                  <span className="font-heading text-3xl font-medium text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-heading text-xl font-medium text-primary">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{value.description}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    );
  }

  if (style === "achievements") {
    return (
      <Section>
        <Container className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} className="border-l-2 border-secondary pl-5">
              <h3 className="font-heading text-2xl font-medium text-primary">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
            </Reveal>
          ))}
        </Container>
      </Section>
    );
  }

  if (style === "twoColumn") {
    return (
      <Section size="compact" className="bg-surface">
        <Container className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.1} className="rounded-[1.75rem] border border-border bg-background p-10 sm:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{card.title}</span>
              <p className="mt-5 text-balance font-heading text-2xl font-medium leading-snug text-primary sm:text-3xl">
                {card.description}
              </p>
            </Reveal>
          ))}
        </Container>
      </Section>
    );
  }

  // default: full cards with icon/image/button, e.g. service sub-services or benefits grids
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading} description={description} className="max-w-2xl" />
        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon ? iconMap[card.icon] : undefined;
            return (
              <RevealItem key={card.title}>
                <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface">
                  {card.imageUrl && (
                    <div className="relative aspect-[4/3] w-full">
                      <Image src={card.imageUrl} alt={card.title} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-7">
                    {Icon && (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                    )}
                    <h3 className="font-heading text-xl font-medium text-primary">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{card.description}</p>
                    {card.buttonLabel && card.buttonHref && (
                      <Link href={card.buttonHref} className="mt-auto flex items-center gap-2 pt-2 text-sm font-semibold text-secondary">
                        {card.buttonLabel}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}
