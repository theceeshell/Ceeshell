import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Covers the simple form fields only. contentJson/contentHtml come from the
 * RichTextEditor and are handled separately (see blog-actions.ts) rather than
 * folded into this schema, since they aren't plain form inputs.
 */
export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only, e.g. our-latest-project"),
  featuredImageUrl: z.string().min(1, "Choose a featured image"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  excerpt: z.string().min(1, "Excerpt is required"),
  // Plain HTML date-input string (e.g. "2026-06-18"). Converted to a Date
  // only inside the server action, never coerced here, to keep the
  // zodResolver's input/output types identical for useForm<BlogPostFormValues>.
  publishDate: z.string().min(1, "Publish date is required"),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
