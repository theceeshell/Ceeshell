import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { initialsFromName } from "@/lib/cms/adapters";

export interface TeamMemberData {
  name: string;
  position: string;
  bio: string;
}

export function TeamShowcase({ eyebrow, heading, members }: { eyebrow?: string; heading: string; members: TeamMemberData[] }) {
  return (
    <Section className="bg-surface">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading} className="max-w-2xl" />
        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <RevealItem key={member.name}>
              <div className="rounded-[1.5rem] border border-border bg-background p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/8 font-heading text-xl font-medium text-primary">
                  {initialsFromName(member.name)}
                </div>
                <h3 className="mt-6 font-heading text-xl font-medium text-primary">{member.name}</h3>
                <p className="text-sm font-semibold text-secondary">{member.position}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
