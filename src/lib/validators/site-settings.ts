import { z } from "zod";
import { optionalUrlSchema } from "@/lib/validators/shared";

export const siteSettingsSchema = z.object({
  websiteName: z.string().min(1, "Website name is required"),
  companyName: z.string().min(1, "Company name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  whatsapp: z.string().min(1, "WhatsApp is required"),
  address: z.string().min(1, "Address is required"),
  businessHours: z.string().min(1, "Business hours are required"),
  googleMapsUrl: z.string().trim().regex(/^https:\/\//i, "Enter a full URL starting with https://"),
  socialLinks: z.object({
    instagram: optionalUrlSchema,
    linkedin: optionalUrlSchema,
    behance: optionalUrlSchema,
    pinterest: optionalUrlSchema,
    facebook: optionalUrlSchema,
    tiktok: optionalUrlSchema,
    youtube: optionalUrlSchema,
  }),
  logoUrl: z.string().optional(),
  footerLogoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export const seoSettingsSchema = z.object({
  defaultSeoTitle: z.string().min(1, "SEO title is required"),
  defaultSeoDescription: z.string().min(1, "SEO description is required"),
  defaultOgImageUrl: z.string().optional(),
  twitterCardType: z.enum(["summary", "summary_large_image"]),
  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
  googleVerification: z.string().optional(),
});

export type SeoSettingsFormValues = z.infer<typeof seoSettingsSchema>;
