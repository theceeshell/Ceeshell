import { z } from "zod";

export const siteSettingsSchema = z.object({
  websiteName: z.string().min(1, "Website name is required"),
  companyName: z.string().min(1, "Company name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  whatsapp: z.string().min(1, "WhatsApp is required"),
  address: z.string().min(1, "Address is required"),
  businessHours: z.string().min(1, "Business hours are required"),
  googleMapsUrl: z.string().min(1, "Google Maps URL is required"),
  socialLinks: z.object({
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    behance: z.string().optional(),
    pinterest: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
    youtube: z.string().optional(),
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
