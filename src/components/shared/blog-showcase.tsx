import Link from "next/link";
import Image from "@/components/ui/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { BlogGrid } from "@/components/shared/blog-grid";
import type { BlogCardData } from "@/lib/cms/adapters";

export function BlogShowcase({ heading, posts }: { heading: string; posts: BlogCardData[] }) {
  const [featured, ...rest] = posts;
  if (!featured) return null;

  return (
    <>
      <Section size="compact" className="border-b border-border">
        <Container>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Featured Article</span>
          <Reveal delay={0.05}>
            <Link href={`/blog/${featured.slug}`} className="group mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
                  <span>{featured.category}</span>
                  <span className="text-muted">&middot;</span>
                  <span className="text-muted normal-case tracking-normal">{featured.readTime}</span>
                </div>
                <h2 className="mt-4 text-balance font-heading text-3xl font-medium leading-snug text-primary transition-colors group-hover:text-secondary sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read Article
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Latest Posts" title={heading} className="max-w-2xl" />
          <div className="mt-12">
            <BlogGrid posts={rest} />
          </div>
        </Container>
      </Section>
    </>
  );
}
