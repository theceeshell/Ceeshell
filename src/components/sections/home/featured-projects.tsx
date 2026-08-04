import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ProjectCard, type ProjectCardData } from "@/components/shared/project-card";

interface FeaturedProjectsProps {
  eyebrow?: string;
  heading: string;
  projects: ProjectCardData[];
  viewAllLink?: { label: string; href: string };
}

export function FeaturedProjects({ eyebrow, heading, projects, viewAllLink }: FeaturedProjectsProps) {
  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={eyebrow} title={heading} className="max-w-2xl" />
          {viewAllLink && (
            <Link href={viewAllLink.href} className="group flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-primary lg:self-end">
              {viewAllLink.label}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          )}
        </div>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[280px]">
          {projects.map((project, i) => (
            <RevealItem
              key={project.slug}
              className={
                i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : i === 4 ? "lg:col-span-2" : undefined
              }
            >
              <ProjectCard project={project} className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
