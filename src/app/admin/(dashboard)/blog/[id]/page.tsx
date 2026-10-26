import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { BlogForm } from "@/components/admin/blog/blog-form";
import { getSiteTexts } from "@/lib/cms/site-data";

export const metadata = { title: "Edit Post" };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, texts] = await Promise.all([prisma.blogPost.findUnique({ where: { id } }), getSiteTexts()]);
  if (!post) notFound();

  return (
    <div>
      <PageHeader title="Edit Post" description={`Editing "${post.title}"`} />
      <BlogForm post={post} categories={texts.blog.categories} />
    </div>
  );
}
