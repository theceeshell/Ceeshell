import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const industrySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "Web address is required")
    .regex(slugRegex, "Use lowercase letters, numbers and hyphens only, e.g. food-and-beverage"),
  summary: z.string().trim().min(1, "Summary is required").max(1000),
  heroImageUrl: z.string().trim().min(1, "Choose a banner image"),
  painPoints: z.array(z.string().trim().min(1).max(500)),
  solutions: z.array(z.string().trim().min(1).max(500)),
  projectIds: z.array(z.string()),
  visible: z.boolean(),
  seoTitle: z.string().trim().max(120).optional(),
  seoDescription: z.string().trim().max(300).optional(),
});

export type IndustryFormValues = z.infer<typeof industrySchema>;
