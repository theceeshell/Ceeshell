import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  bio: z.string().min(1, "Bio is required"),
  photoUrl: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  behance: z.string().optional(),
  active: z.boolean(),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;
