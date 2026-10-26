import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const COVER_ASPECT_OPTIONS = ["portrait", "landscape", "square"] as const;

/**
 * Flat schema matching the PortfolioProject Prisma model exactly (plus
 * `industryIds`, used to drive the `industries` many-to-many relation).
 * Used by the server actions to validate data right before it's persisted.
 */
export const portfolioProjectSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(slugRegex, "Use lowercase letters, numbers and hyphens only"),
  title: z.string().min(1, "Title is required"),
  client: z.string().min(1, "Client is required"),
  industry: z.string().min(1, "Industry is required"),
  year: z.string().min(1, "Year is required"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  servicesUsed: z.array(z.string()),
  excerpt: z.string().min(1, "Excerpt is required"),
  coverImageUrl: z.string().min(1, "Choose a cover image"),
  coverAspect: z.enum(COVER_ASPECT_OPTIONS),
  gallery: z.array(z.string()),
  challenge: z.string(),
  research: z.string(),
  strategy: z.string(),
  concept: z.string(),
  designProcess: z.string(),
  photography: z.string(),
  printing: z.string(),
  deliverables: z.array(z.string()),
  testimonialId: z.string().optional().nullable(),
  industryIds: z.array(z.string()),
  featured: z.boolean(),
  visible: z.boolean(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export type PortfolioProjectFormValues = z.infer<typeof portfolioProjectSchema>;

/**
 * Shape used by the create/edit page form. `testimonialId` is always a plain
 * string here (a "none" sentinel stands in for null) so it can back a Radix
 * Select; it gets mapped back to null on submit.
 */
export const portfolioFormSchema = portfolioProjectSchema.extend({
  testimonialId: z.string(),
});

export type PortfolioFormShape = z.infer<typeof portfolioFormSchema>;
