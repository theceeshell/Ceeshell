import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/ui/button";
import { BlogManager } from "@/components/admin/blog/blog-manager";

export const metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { publishDate: "desc" } });

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Write and manage blog articles."
        action={
          <Button size="sm" asChild>
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4" /> Add Post
            </Link>
          </Button>
        }
      />
      <BlogManager posts={posts} />
    </div>
  );
}
