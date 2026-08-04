import { z } from "zod";

const footerLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
});

export const footerConfigSchema = z.object({
  description: z.string().min(1, "Description is required"),
  copyrightText: z.string().min(1, "Copyright text is required"),
  privacyPolicyHref: z.string().min(1, "Privacy policy link is required"),
  termsHref: z.string().min(1, "Terms link is required"),
  quickLinks: z.array(footerLinkSchema).default([]),
  serviceLinks: z.array(footerLinkSchema).default([]),
});

// `.default([])` on the link arrays makes Zod's input type diverge from its
// output type (input: optional array, output: required array). Server
// actions work with the parsed/output shape; the form below wires
// react-hook-form's three type params (input/context/output) so the
// resolver's input->output transform type-checks cleanly.
export type FooterConfigFormValues = z.output<typeof footerConfigSchema>;
export type FooterConfigFormInput = z.input<typeof footerConfigSchema>;
export type FooterLink = z.infer<typeof footerLinkSchema>;
