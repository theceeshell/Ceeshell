import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const serviceIcons = ["camera", "layers", "package", "printer", "gift"] as const;

const titleDescriptionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const faqEntrySchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

/**
 * Flat schema matching the Service Prisma model exactly. Used by the server
 * actions to validate data right before it's persisted.
 */
export const serviceSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only, e.g. brand-identity"),
  name: z.string().min(1, "Name is required"),
  shortName: z.string().min(1, "Short name is required"),
  icon: z.enum(serviceIcons),
  tagline: z.string().min(1, "Tagline is required"),
  summary: z.string().min(1, "Summary is required"),
  heroImageUrl: z.string().min(1, "Hero image URL is required"),
  overview: z.array(z.string().min(1, "Paragraph can't be empty")).min(1, "Add at least one overview paragraph"),
  benefits: z.array(titleDescriptionSchema).min(1, "Add at least one benefit"),
  process: z.array(titleDescriptionSchema).min(1, "Add at least one process step"),
  subServices: z.array(titleDescriptionSchema).min(1, "Add at least one capability"),
  gallery: z.array(z.string().min(1, "Image URL can't be empty")).min(1, "Add at least one image"),
  faqs: z.array(faqEntrySchema).default([]),
  featured: z.boolean(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

/**
 * Shape used by the create/edit page form. The repeatable "overview" and
 * "gallery" sections are modeled as arrays of objects (rather than arrays of
 * primitives) so they can be driven by react-hook-form's useFieldArray, which
 * requires object rows. These get flattened back into ServiceFormValues on
 * submit before calling the server action.
 */
export const serviceFormSchema = serviceSchema.extend({
  overview: z
    .array(z.object({ value: z.string().min(1, "Paragraph can't be empty") }))
    .min(1, "Add at least one overview paragraph"),
  gallery: z
    .array(z.object({ url: z.string().min(1, "Image URL can't be empty") }))
    .min(1, "Add at least one image"),
  // No `.default([])` here (unlike serviceSchema) — a default makes the
  // input type optional while the output type stays required, which breaks
  // zodResolver's generic inference when paired with useForm<ServiceFormShape>.
  // The form always supplies an array explicitly via defaultValues instead.
  faqs: z.array(faqEntrySchema),
});

export type ServiceFormShape = z.infer<typeof serviceFormSchema>;
