"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { revalidateSite, withSlugCheck, type ActionResult } from "@/lib/actions/helpers";
import { sanitizeBlogHtml } from "@/lib/cms/html";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/validators/blog";

/** contentJson/contentHtml are Tiptap editor output, not simple form fields, so they're typed loosely here rather than folded into blogPostSchema. */
export interface BlogPostActionInput extends BlogPostFormValues {
  contentJson: object;
  contentHtml: string;
}

/** Validates the form fields and sanitizes the client-supplied HTML (never trust it as-is). */
function parseInput(values: BlogPostActionInput) {
  const { contentJson, contentHtml, ...rest } = values;
  const data = blogPostSchema.parse(rest);
  if (typeof contentJson !== "object" || contentJson === null) throw new Error("Invalid content");

  const html = sanitizeBlogHtml(contentHtml);
  if (!html.replace(/<[^>]+>/g, "").trim()) throw new Error("Content can't be empty");

  return { ...data, contentJson, contentHtml: html, publishDate: new Date(data.publishDate) };
}

async function uniqueSlug(base: string) {
  let candidate = base;
  let n = 2;
  while (await prisma.blogPost.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function createBlogPostAction(values: BlogPostActionInput): Promise<ActionResult> {
  await requireSession();
  const data = parseInput(values);
  const result = await withSlugCheck(() => prisma.blogPost.create({ data }));
  if (!result) revalidateSite();
  return result;
}

export async function updateBlogPostAction(id: string, values: BlogPostActionInput): Promise<ActionResult> {
  await requireSession();
  const data = parseInput(values);
  const result = await withSlugCheck(() => prisma.blogPost.update({ where: { id }, data }));
  if (!result) revalidateSite();
  return result;
}

export async function deleteBlogPostAction(id: string) {
  await requireSession();
  await prisma.blogPost.delete({ where: { id } });
  revalidateSite();
}

export async function duplicateBlogPostAction(id: string) {
  await requireSession();
  const original = await prisma.blogPost.findUnique({ where: { id } });
  if (!original) throw new Error("Blog post not found");

  const slug = await uniqueSlug(`${original.slug}-copy`);
  await prisma.blogPost.create({
    data: {
      title: `${original.title} (Copy)`,
      slug,
      featuredImageUrl: original.featuredImageUrl,
      author: original.author,
      category: original.category,
      tags: original.tags as string[],
      excerpt: original.excerpt,
      contentJson: original.contentJson as object,
      contentHtml: sanitizeBlogHtml(original.contentHtml),
      publishDate: original.publishDate,
      status: "draft",
      featured: false,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
    },
  });
  revalidateSite();
}
