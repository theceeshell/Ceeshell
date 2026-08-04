import { PageHeader } from "@/components/admin/ui/page-header";
import { BlogForm } from "@/components/admin/blog/blog-form";

export const metadata = { title: "New Post" };

export default function NewBlogPostPage() {
  return (
    <div>
      <PageHeader title="New Post" description="Write a new blog article." />
      <BlogForm />
    </div>
  );
}
