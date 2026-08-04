import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/cms/site-data";
import { estimateReadTime, toBlogCard } from "@/lib/cms/adapters";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { NewsletterForm } from "@/components/shared/newsletter-form";

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({ where: { status: "published" }, select: { slug: true } });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "published") notFound();

  const settings = await getSiteSettings();

  const relatedRows = await prisma.blogPost.findMany({
    where: { status: "published", category: post.category, slug: { not: post.slug } },
    take: 3,
    orderBy: { publishDate: "desc" },
  });
  const related = relatedRows.length > 0 ? relatedRows : await prisma.blogPost.findMany({
    where: { status: "published", slug: { not: post.slug } },
    take: 3,
    orderBy: { publishDate: "desc" },
  });

  const readTime = estimateReadTime(post.contentHtml);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImageUrl,
    datePublished: post.publishDate.toISOString(),
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: settings.companyName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Section size="compact" className="bg-surface pt-40">
        <Container className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-muted">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
          </nav>
          <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
            <span>{post.category}</span>
            <span className="text-muted">&middot;</span>
            <span className="text-muted normal-case tracking-normal">{readTime}</span>
            <span className="text-muted">&middot;</span>
            <span className="text-muted normal-case tracking-normal">
              {post.publishDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className="mt-6 text-balance font-heading text-4xl font-medium leading-[1.1] text-primary sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 text-sm font-medium text-muted">By {post.author}</p>
        </Container>
      </Section>

      <Container className="mx-auto -mt-4 max-w-4xl sm:-mt-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] shadow-lift">
          <Image src={post.featuredImageUrl} alt={post.title} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        </div>
      </Container>

      <Section>
        <Container className="mx-auto max-w-3xl">
          <Reveal>
            <div
              className="prose-cee-shell space-y-6 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-primary sm:[&_h2]:text-3xl [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-muted"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </Reveal>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section className="bg-surface">
          <Container>
            <h2 className="font-heading text-3xl font-medium text-primary sm:text-4xl">Related Articles</h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {related.map((p) => {
                const card = toBlogCard(p);
                return (
                  <Link key={card.slug} href={`/blog/${card.slug}`} className="group flex flex-col gap-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image src={card.coverImage} alt={card.title} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="font-heading text-lg font-medium leading-snug text-primary group-hover:text-secondary">{card.title}</h3>
                  </Link>
                );
              })}
            </div>
          </Container>
        </Section>
      )}

      <Section size="compact" className="bg-primary text-white">
        <Container className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="font-heading text-3xl font-medium text-white sm:text-4xl">Enjoyed this article?</h2>
          <p className="text-white/70">Subscribe for occasional notes on branding, packaging and photography.</p>
          <div className="w-full max-w-sm">
            <NewsletterForm dark />
          </div>
        </Container>
      </Section>
    </>
  );
}
