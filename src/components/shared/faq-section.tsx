import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export interface FaqItemData {
  id?: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  eyebrow?: string;
  heading: string;
  faqs: FaqItemData[];
  layout?: "simple" | "sidebarCta";
}

export function FaqSection({ eyebrow, heading, faqs, layout = "simple" }: FaqSectionProps) {
  if (layout === "sidebarCta") {
    return (
      <>
        <Section>
          <Container className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_320px]">
            <Reveal>
              <Accordion type="single" collapsible>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id ?? faq.question} value={faq.id ?? faq.question}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>

            <div className="hidden lg:block">
              <div className="sticky top-32 rounded-[1.75rem] border border-border bg-surface p-8 shadow-soft">
                <h3 className="font-heading text-2xl font-medium text-primary">Still have questions?</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Every project is different — the fastest way to get a real answer is to tell us about yours.
                </p>
                <Button asChild className="mt-6 w-full">
                  <Link href="/contact">
                    Start Your Project <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lift"
          >
            Start Your Project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </>
    );
  }

  return (
    <Section>
      <Container className="mx-auto max-w-3xl">
        <SectionHeading eyebrow={eyebrow} title={heading} align="center" className="mx-auto" />
        <Reveal className="mt-12">
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id ?? faq.question} value={faq.id ?? faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </Section>
  );
}
