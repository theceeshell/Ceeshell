import { z } from "zod";

export const testimonialSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  review: z.string().min(1, "Review is required"),
  rating: z.number().min(1).max(5),
  photoUrl: z.string().optional(),
  featured: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
