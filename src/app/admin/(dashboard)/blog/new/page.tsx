import { PageHeader } from "@/components/admin/ui/page-header";
import { BlogForm } from "@/components/admin/blog/blog-form";
import { getSiteTexts } from "@/lib/cms/site-data";

export const metadata = { title: "New Post" };

export default async function NewBlogPostPage() {
  const texts = await getSiteTexts();

  return (
    <div>
      <PageHeader title="New Post" description="Write a new blog article." />
      <BlogForm categories={texts.blog.categories} />
    </div>
  );
}
