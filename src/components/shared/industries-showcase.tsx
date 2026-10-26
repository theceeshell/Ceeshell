import Link from "next/link";
import { StillMedia } from "@/components/shared/still-media";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

export interface IndustryCardData {
  slug: string;
  name: string;
  heroImageUrl: string;
}

export function IndustriesShowcase({
  eyebrow,
  heading,
  description,
  industries,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  industries: IndustryCardData[];
}) {
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading} description={description} className="max-w-2xl" />
        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <RevealItem key={industry.slug}>
              <Link
                href={`/industries/${industry.slug}`}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[1.5rem]"
              >
                <StillMedia
                  src={industry.heroImageUrl}
                  alt={industry.name}
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative flex items-center justify-between gap-2 p-6">
                  <h3 className="font-heading text-xl font-medium text-white sm:text-2xl">{industry.name}</h3>
                  <ArrowUpRight className="h-5 w-5 shrink-0 -translate-x-1 translate-y-1 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
