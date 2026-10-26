import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { SiteTexts } from "@/lib/cms/site-texts";

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
  /** "Still have questions?" box texts (faq.*), used by the sidebarCta layout. */
  sidebar: SiteTexts["faq"];
}

export function FaqSection({ eyebrow, heading, faqs, layout = "simple", sidebar }: FaqSectionProps) {
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
                <h3 className="font-heading text-2xl font-medium text-primary">{sidebar.sidebarHeading}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {sidebar.sidebarText}
                </p>
                <Button asChild className="mt-6 w-full">
                  <Link href={sidebar.sidebarHref}>
                    {sidebar.sidebarButton} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        <div data-mobile-cta className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
          <Link
            href={sidebar.sidebarHref}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lift"
          >
            {sidebar.sidebarButton} <ArrowRight className="h-4 w-4" />
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
