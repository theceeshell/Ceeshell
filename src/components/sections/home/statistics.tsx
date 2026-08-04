import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Reveal } from "@/components/shared/reveal";
import { ShellMotif } from "@/components/shared/shell-motif";

interface Counter {
  label: string;
  value: number;
  suffix?: string;
}

export function Statistics({ counters }: { counters: Counter[] }) {
  return (
    <Section size="compact" className="bg-primary text-white">
      <ShellMotif size={700} className="absolute -left-40 top-1/2 -translate-y-1/2 text-white/[0.04]" />
      <Container className="relative grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-8">
        {counters.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
            <span className="font-heading text-5xl font-medium sm:text-6xl">
              <AnimatedCounter value={stat.value} suffix={stat.suffix ?? ""} />
            </span>
            <span className="text-sm text-white/65">{stat.label}</span>
          </Reveal>
        ))}
      </Container>
    </Section>
  );
}
