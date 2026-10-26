import { z } from "zod";

/**
 * A link an editor can put on the site: a site-relative path ("/contact",
 * "#work") or an http(s)/mailto/tel URL. Rejects javascript:, data: etc.
 */
export const hrefSchema = z
  .string()
  .trim()
  .min(1, "Link is required")
  .refine((value) => /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(value), {
    message: "Use a path like /contact or a full URL starting with https://",
  });

/** Optional absolute http(s) URL; empty string allowed (form fields submit "" when blank). */
export const optionalUrlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\//i.test(value), { message: "Enter a full URL starting with https://" })
  .optional();
