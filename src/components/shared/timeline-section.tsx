import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ShellMotif } from "@/components/shared/shell-motif";
import { cn } from "@/lib/utils";

export interface TimelineItemData {
  year: string;
  title: string;
  description: string;
}

interface TimelineSectionProps {
  eyebrow?: string;
  heading: string;
  layout: "vertical" | "alternating";
  items: TimelineItemData[];
}

export function TimelineSection({ eyebrow, heading, layout, items }: TimelineSectionProps) {
  if (layout === "alternating") {
    return (
      <Section className="relative">
        <ShellMotif size={800} className="absolute -right-64 top-0 hidden text-primary/[0.04] lg:block" />
        <Container className="relative">
          <SectionHeading eyebrow={eyebrow} title={heading} className="max-w-2xl" />

          <div className="relative mt-20">
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />
            <div className="space-y-14 lg:space-y-0">
              {items.map((step, i) => (
                <div
                  key={step.title}
                  className={cn(
                    "relative flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-14",
                    i % 2 === 1 && "lg:[&>*:first-child]:order-2"
                  )}
                >
                  <Reveal direction={i % 2 === 0 ? "left" : "right"} className={cn(i % 2 === 0 ? "lg:text-right" : "")}>
                    <span className="font-heading text-6xl font-medium text-accent/70 sm:text-7xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-heading text-3xl font-medium text-primary">{step.title}</h3>
                    <p className={cn("mt-3 max-w-md text-base leading-relaxed text-muted", i % 2 === 0 && "lg:ml-auto")}>
                      {step.description}
                    </p>
                  </Reveal>
                  <span className="absolute left-1/2 top-2 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-secondary bg-background lg:block" />
                  <div className="hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="bg-surface">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading} className="max-w-2xl" />
        <div className="relative mt-16">
          <div className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-border sm:block" />
          <div className="space-y-10 sm:space-y-14">
            {items.map((item, i) => (
              <Reveal key={item.year + item.title} delay={i * 0.05} className="relative flex flex-col gap-2 sm:flex-row sm:gap-10 sm:pl-8">
                <span className="absolute left-0 top-2 hidden h-[15px] w-[15px] rounded-full border-2 border-secondary bg-background sm:block" />
                <span className="font-heading text-2xl font-medium text-secondary sm:w-28 sm:shrink-0">{item.year}</span>
                <div>
                  <h3 className="font-semibold text-primary">{item.title}</h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
