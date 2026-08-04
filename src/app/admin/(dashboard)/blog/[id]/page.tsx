import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { BlogForm } from "@/components/admin/blog/blog-form";

export const metadata = { title: "Edit Post" };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <PageHeader title="Edit Post" description={`Editing "${post.title}"`} />
      <BlogForm post={post} />
    </div>
  );
}
