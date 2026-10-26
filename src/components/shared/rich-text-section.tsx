import Image from "@/components/ui/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { ShellMotif } from "@/components/shared/shell-motif";
import { cn } from "@/lib/utils";

type RichTextContent =
  | { variant: "default"; eyebrow?: string; heading: string; content: string; imageUrl?: string; alignment: "left" | "center" | "right" }
  | { variant: "founderQuote"; eyebrow?: string; quote: string; authorName: string; authorRole: string; initials: string }
  | { variant: "philosophyQuote"; eyebrow?: string; statement: string }
  | { variant: "splitStory"; eyebrow?: string; heading: string; paragraphs: string[]; imageUrl: string; imageSide: "left" | "right" };

export function RichTextSection(props: RichTextContent) {
  if (props.variant === "splitStory") {
    const { eyebrow, heading, paragraphs, imageUrl, imageSide } = props;
    const imageFirst = imageSide === "left";
    return (
      <Section>
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal direction={imageFirst ? "right" : "left"} className={cn("relative", imageFirst ? "order-2 lg:order-1" : "order-2")}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
              <Image src={imageUrl} alt={heading} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
            </div>
          </Reveal>
          <div className={cn(imageFirst ? "order-1 lg:order-2" : "order-1")}>
            {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{eyebrow}</span>}
            <h2 className="mt-3 text-balance font-heading text-3xl font-medium leading-snug text-primary sm:text-4xl">{heading}</h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (props.variant === "founderQuote") {
    const { eyebrow, quote, authorName, authorRole, initials } = props;
    return (
      <Section className="relative bg-primary text-white">
        <ShellMotif size={600} className="absolute -right-32 -top-24 text-white/[0.05]" />
        <Container className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="flex h-64 w-64 items-center justify-center rounded-full border border-white/15 bg-white/5 font-heading text-6xl font-medium sm:h-80 sm:w-80">
            {initials}
          </Reveal>
          <div>
            {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">{eyebrow}</span>}
            <p className="mt-6 text-balance font-heading text-3xl font-medium leading-snug sm:text-4xl">&ldquo;{quote}&rdquo;</p>
            <div className="mt-8">
              <p className="font-semibold">{authorName}</p>
              <p className="text-sm text-white/60">{authorRole}</p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (props.variant === "philosophyQuote") {
    const { eyebrow, statement } = props;
    return (
      <Section size="compact">
        <Container>
          <Reveal className="mx-auto max-w-4xl text-center">
            {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{eyebrow}</span>}
            <p className="mt-6 text-balance font-heading text-3xl font-medium leading-snug text-primary sm:text-4xl lg:text-5xl">
              {statement}
            </p>
          </Reveal>
        </Container>
      </Section>
    );
  }

  const { eyebrow, heading, content, imageUrl, alignment } = props;
  return (
    <Section>
      <Container className={cn("mx-auto max-w-3xl", alignment === "center" && "text-center", alignment === "right" && "text-right")}>
        <Reveal>
          {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{eyebrow}</span>}
          <h2 className="mt-3 text-balance font-heading text-3xl font-medium leading-snug text-primary sm:text-4xl">{heading}</h2>
          {imageUrl && (
            <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-[1.75rem]">
              <Image src={imageUrl} alt={heading} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
          )}
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted">{content}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
