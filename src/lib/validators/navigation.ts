import { z } from "zod";

export const navigationItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
  openNewTab: z.boolean(),
  visible: z.boolean(),
});

export type NavigationItemFormValues = z.infer<typeof navigationItemSchema>;
