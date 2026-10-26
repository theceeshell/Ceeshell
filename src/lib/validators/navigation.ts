import { z } from "zod";
import { hrefSchema } from "@/lib/validators/shared";

export const navigationItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: hrefSchema,
  openNewTab: z.boolean(),
  visible: z.boolean(),
});

export type NavigationItemFormValues = z.infer<typeof navigationItemSchema>;
