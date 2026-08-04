"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/validators/blog";

/** contentJson/contentHtml are Tiptap editor output, not simple form fields, so they're typed loosely here rather than folded into blogPostSchema. */
export interface BlogPostActionInput extends BlogPostFormValues {
  contentJson: object;
  contentHtml: string;
}

function revalidateBlogSurfaces(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

function assertContentNotEmpty(contentHtml: string) {
  const text = contentHtml.replace(/<[^>]+>/g, "").trim();
  if (!text) throw new Error("Content can't be empty");
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

export async function createBlogPostAction(values: BlogPostActionInput) {
  await requireSession();
  const { contentJson, contentHtml, ...rest } = values;
  const data = blogPostSchema.parse(rest);
  assertContentNotEmpty(contentHtml);

  const created = await prisma.blogPost.create({
    data: {
      ...data,
      tags: data.tags,
      contentJson,
      contentHtml,
      publishDate: new Date(data.publishDate),
    },
  });
  revalidateBlogSurfaces(created.slug);
  return created;
}

export async function updateBlogPostAction(id: string, values: BlogPostActionInput) {
  await requireSession();
  const { contentJson, contentHtml, ...rest } = values;
  const data = blogPostSchema.parse(rest);
  assertContentNotEmpty(contentHtml);

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      tags: data.tags,
      contentJson,
      contentHtml,
      publishDate: new Date(data.publishDate),
    },
  });
  revalidateBlogSurfaces(updated.slug);
  return updated;
}

export async function deleteBlogPostAction(id: string) {
  await requireSession();
  const deleted = await prisma.blogPost.delete({ where: { id } });
  revalidateBlogSurfaces(deleted.slug);
}

export async function duplicateBlogPostAction(id: string) {
  await requireSession();
  const original = await prisma.blogPost.findUnique({ where: { id } });
  if (!original) throw new Error("Blog post not found");

  const slug = await uniqueSlug(`${original.slug}-copy`);
  const created = await prisma.blogPost.create({
    data: {
      title: `${original.title} (Copy)`,
      slug,
      featuredImageUrl: original.featuredImageUrl,
      author: original.author,
      category: original.category,
      tags: original.tags as string[],
      excerpt: original.excerpt,
      contentJson: original.contentJson as object,
      contentHtml: original.contentHtml,
      publishDate: original.publishDate,
      status: "draft",
      featured: false,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
    },
  });
  revalidateBlogSurfaces(created.slug);
  return created;
}
