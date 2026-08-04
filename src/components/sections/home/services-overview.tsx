import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ServiceCard, type ServiceCardData } from "@/components/shared/service-card";

interface ServicesOverviewProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  services: ServiceCardData[];
  viewAllLink?: { label: string; href: string };
}

export function ServicesOverview({ eyebrow, heading, description, services, viewAllLink }: ServicesOverviewProps) {
  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={eyebrow} title={heading} description={description} className="max-w-2xl" />
          {viewAllLink && (
            <Link
              href={viewAllLink.href}
              className="group flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-primary lg:self-end"
            >
              {viewAllLink.label}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          )}
        </div>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <RevealItem key={service.slug}>
              <ServiceCard service={service} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
