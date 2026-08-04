import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialSlider, type TestimonialCardData } from "@/components/shared/testimonial-slider";

interface TestimonialsSectionProps {
  eyebrow?: string;
  heading: string;
  testimonials: TestimonialCardData[];
}

export function TestimonialsSection({ eyebrow, heading, testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;
  return (
    <Section className="bg-surface">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading} align="center" className="mx-auto mb-16" />
        <TestimonialSlider testimonials={testimonials} />
      </Container>
    </Section>
  );
}
