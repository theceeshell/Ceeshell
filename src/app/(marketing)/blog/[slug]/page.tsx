import type { Metadata } from "next";
import { cache } from "react";
import Image from "@/components/ui/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSiteSettings, getSiteTexts } from "@/lib/cms/site-data";
import { fill } from "@/lib/cms/site-texts";
import { estimateReadTime, toBlogCard } from "@/lib/cms/adapters";
import { jsonLd, sanitizeBlogHtml } from "@/lib/cms/html";
import { pageMetadata } from "@/lib/cms/metadata";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { formatDate } from "@/lib/format-date";
import { livePostFilter } from "@/lib/cms/blog";
import { redirectIfMoved } from "@/lib/cms/redirects";

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({ where: livePostFilter(), select: { slug: true } });
  return posts.map((post) => ({ slug: post.slug }));
}

/** Drafts are treated exactly like missing posts. */
const getPublishedPost = cache((slug: string) => prisma.blogPost.findFirst({ where: { slug, ...livePostFilter() } }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImageUrl,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) {
    await redirectIfMoved(`/blog/${slug}`);
    notFound();
  }

  const [settings, texts] = await Promise.all([getSiteSettings(), getSiteTexts()]);

  const relatedRows = await prisma.blogPost.findMany({
    where: { ...livePostFilter(), category: post.category, slug: { not: post.slug } },
    take: 3,
    orderBy: { publishDate: "desc" },
  });
  const related = relatedRows.length > 0 ? relatedRows : await prisma.blogPost.findMany({
    where: { ...livePostFilter(), slug: { not: post.slug } },
    take: 3,
    orderBy: { publishDate: "desc" },
  });

  const readTime = estimateReadTime(post.contentHtml, texts.blog.readTime);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImageUrl,
    datePublished: post.publishDate.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: settings.companyName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }}
      />
      <Section size="compact" className="bg-surface pt-40">
        <Container className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-muted">
            <Link href="/" className="hover:text-primary">{texts.breadcrumbs.home}</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary">{texts.breadcrumbs.blog}</Link>
          </nav>
          <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
            <span>{post.category}</span>
            <span className="text-muted">&middot;</span>
            <span className="text-muted normal-case tracking-normal">{readTime}</span>
            <span className="text-muted">&middot;</span>
            <span className="text-muted normal-case tracking-normal">
              {formatDate(post.publishDate, "long")}
            </span>
          </div>
          <h1 className="mt-6 text-balance font-heading text-4xl font-medium leading-[1.1] text-primary sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 text-sm font-medium text-muted">{fill(texts.blog.byAuthor, { author: post.author })}</p>
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
              className="prose-cee-shell space-y-6 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-secondary [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-primary sm:[&_h2]:text-3xl [&_img]:my-10 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-muted"
              dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.contentHtml) }}
            />
          </Reveal>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section className="bg-surface">
          <Container>
            <h2 className="font-heading text-3xl font-medium text-primary sm:text-4xl">{texts.blog.relatedHeading}</h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {related.map((p) => {
                const card = toBlogCard(p, texts.blog.readTime);
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
          <h2 className="font-heading text-3xl font-medium text-white sm:text-4xl">{texts.newsletter.articleHeading}</h2>
          <p className="text-white/70">{texts.newsletter.articleText}</p>
          <div className="w-full max-w-sm">
            <NewsletterForm dark texts={texts.newsletter} />
          </div>
        </Container>
      </Section>
    </>
  );
}
