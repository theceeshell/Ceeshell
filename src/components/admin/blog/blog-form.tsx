"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FormField } from "@/components/admin/ui/form-field";
import { RichTextEditor } from "@/components/admin/blog/rich-text-editor";
import { blogPostSchema, blogCategories, type BlogPostFormValues } from "@/lib/validators/blog";
import { createBlogPostAction, updateBlogPostAction } from "@/lib/actions/blog-actions";
import type { BlogPost } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

interface BlogFormProps {
  post?: BlogPost | null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

function toFormValues(post?: BlogPost | null): BlogPostFormValues {
  if (!post) {
    return {
      title: "",
      slug: "",
      featuredImageUrl: "",
      author: "",
      category: "",
      tags: [],
      excerpt: "",
      publishDate: toDateInputValue(new Date()),
      status: "draft",
      featured: false,
      seoTitle: "",
      seoDescription: "",
    };
  }
  return {
    title: post.title,
    slug: post.slug,
    featuredImageUrl: post.featuredImageUrl,
    author: post.author,
    category: post.category,
    tags: Array.isArray(post.tags) ? (post.tags as string[]) : [],
    excerpt: post.excerpt,
    publishDate: toDateInputValue(post.publishDate),
    status: post.status === "published" ? "published" : "draft",
    featured: post.featured,
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
  };
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <div className="mb-5">
        <h3 className="font-heading text-lg font-medium text-primary">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const isEditing = Boolean(post);
  const defaultValues = React.useMemo(() => toFormValues(post), [post]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormValues>({ resolver: zodResolver(blogPostSchema), defaultValues });

  const [slugEdited, setSlugEdited] = React.useState(isEditing);
  const title = useWatch({ control, name: "title" });

  React.useEffect(() => {
    if (slugEdited) return;
    setValue("slug", slugify(title || ""), { shouldValidate: false });
  }, [title, slugEdited, setValue]);

  const [contentJson, setContentJson] = React.useState<object | null>(
    post ? (post.contentJson as object) : null
  );
  const [contentHtml, setContentHtml] = React.useState<string>(post?.contentHtml ?? "");
  const [contentError, setContentError] = React.useState<string | null>(null);

  async function onSubmit(values: BlogPostFormValues) {
    const isContentEmpty = contentHtml.replace(/<[^>]+>/g, "").trim() === "";
    if (isContentEmpty) {
      setContentError("Content can't be empty.");
      return;
    }
    setContentError(null);

    const payload = { ...values, contentJson: contentJson ?? {}, contentHtml };

    try {
      const result = isEditing && post
        ? await updateBlogPostAction(post.id, payload)
        : await createBlogPostAction(payload);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isEditing ? "Post updated" : "Post created");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <SectionCard title="Basics">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" error={errors.title?.message}>
            <Input id="title" {...register("title")} placeholder="How Great Packaging Drives Sales" />
          </FormField>
          <FormField
            label="Slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint="Auto-generated from the title until you edit it manually."
          >
            <Input
              id="slug"
              {...register("slug", { onChange: () => setSlugEdited(true) })}
              placeholder="how-great-packaging-drives-sales"
            />
          </FormField>
        </div>

        <FormField label="Featured Image URL" htmlFor="featuredImageUrl" error={errors.featuredImageUrl?.message} hint="Paste an image URL, or upload it in Media Library and paste the URL here.">
          <Input id="featuredImageUrl" {...register("featuredImageUrl")} placeholder="https://…" />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Author" htmlFor="author" error={errors.author?.message}>
            <Input id="author" {...register("author")} placeholder="Ayesha Raza" />
          </FormField>

          <FormField label="Category" htmlFor="category" error={errors.category?.message}>
            <Controller
              control={control}
              name="category"
              render={({ field }) => {
                const isPreset = (blogCategories as readonly string[]).includes(field.value);
                const selectValue = isPreset ? field.value : field.value ? "Other" : "";
                return (
                  <div className="space-y-2">
                    <Select value={selectValue} onValueChange={(v) => field.onChange(v === "Other" ? "" : v)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {blogCategories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other…</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectValue === "Other" && (
                      <Input
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Custom category"
                      />
                    )}
                  </div>
                );
              }}
            />
          </FormField>
        </div>

        <FormField label="Tags" htmlFor="tags" hint="Comma separated, e.g. branding, packaging, print">
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <div className="space-y-2.5">
                <Input
                  id="tags"
                  defaultValue={field.value.join(", ")}
                  onBlur={(e) => {
                    const parsed = e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    field.onChange(parsed);
                  }}
                  placeholder="branding, packaging, print"
                />
                {field.value.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {field.value.map((tag, i) => (
                      <span
                        key={`${tag}-${i}`}
                        className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs text-primary"
                      >
                        {tag}
                        <button
                          type="button"
                          aria-label={`Remove ${tag}`}
                          onClick={() => field.onChange(field.value.filter((_, idx) => idx !== i))}
                          className="text-muted hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          />
        </FormField>
      </SectionCard>

      <SectionCard title="Excerpt" description="A short summary shown on blog listing cards.">
        <FormField label="Excerpt" htmlFor="excerpt" error={errors.excerpt?.message}>
          <Textarea id="excerpt" rows={3} {...register("excerpt")} placeholder="A one or two sentence teaser." />
        </FormField>
      </SectionCard>

      <SectionCard title="Content" description="The full article body.">
        <RichTextEditor
          initialContentJson={contentJson}
          onChange={(json, html) => {
            setContentJson(json);
            setContentHtml(html);
            if (contentError) setContentError(null);
          }}
        />
        {contentError && <p className="text-xs font-medium text-red-600">{contentError}</p>}
      </SectionCard>

      <SectionCard title="Publishing">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Publish Date" htmlFor="publishDate" error={errors.publishDate?.message}>
            <Input id="publishDate" type="date" {...register("publishDate")} />
          </FormField>

          <FormField label="Status" htmlFor="status" error={errors.status?.message}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>

        <div className={cn("flex items-center justify-between rounded-xl border border-border px-4 py-3.5")}>
          <div>
            <Label htmlFor="featured">Featured</Label>
            <p className="mt-0.5 text-xs text-muted">Featured posts are highlighted at the top of the blog page.</p>
          </div>
          <Controller
            control={control}
            name="featured"
            render={({ field }) => <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>
      </SectionCard>

      <SectionCard title="SEO" description="Optional overrides for search engines and social previews.">
        <FormField label="SEO Title" htmlFor="seoTitle" error={errors.seoTitle?.message}>
          <Input id="seoTitle" {...register("seoTitle")} placeholder="Defaults to the post title" />
        </FormField>
        <FormField label="SEO Description" htmlFor="seoDescription" error={errors.seoDescription?.message}>
          <Textarea id="seoDescription" rows={2} {...register("seoDescription")} placeholder="Defaults to the excerpt" />
        </FormField>
      </SectionCard>

      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="secondary" size="sm" asChild>
          <Link href="/admin/blog">Cancel</Link>
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Publish Post"}
        </Button>
      </div>
    </form>
  );
}
