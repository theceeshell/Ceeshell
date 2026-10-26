"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-session";
import { revalidateSite } from "@/lib/actions/helpers";
import { SITE_TEXT_GROUPS } from "@/lib/cms/site-texts";
import { hrefSchema } from "@/lib/validators/shared";

type Submitted = Record<string, Record<string, string | string[]>>;

const textSchema = z.string().trim().max(2000);
const listSchema = z.array(z.string().trim().min(1).max(200)).max(50);

/**
 * Saves Website Texts. Only values that differ from the built-in default are
 * stored, so a field the editor never touched keeps following the default.
 * Empty text fields fall back to the default.
 */
export async function updateSiteTextsAction(values: Submitted): Promise<{ error: string } | undefined> {
  await requireAdmin();

  const overrides: Submitted = {};
  for (const group of SITE_TEXT_GROUPS) {
    for (const field of group.fields) {
      const raw = values[group.key]?.[field.key];
      if (raw === undefined) continue;

      const type = "type" in field ? field.type : "text";
      let value: string | string[];
      if (type === "list") {
        const parsed = listSchema.safeParse(Array.isArray(raw) ? raw.filter((v) => v.trim() !== "") : []);
        if (!parsed.success) return { error: `${group.label} → ${field.label}: each entry must be under 200 characters.` };
        value = parsed.data;
        if (JSON.stringify(value) === JSON.stringify(field.default)) continue;
      } else {
        const parsed = textSchema.safeParse(raw);
        if (!parsed.success) return { error: `${group.label} → ${field.label} is too long.` };
        value = parsed.data;
        if (value === "" || value === field.default) continue;
        if (type === "link" && !hrefSchema.safeParse(value).success) {
          return { error: `${group.label} → ${field.label}: use a path like /contact or a full https:// link.` };
        }
      }
      (overrides[group.key] ??= {})[field.key] = value;
    }
  }

  await prisma.siteSettings.update({ where: { id: "singleton" }, data: { texts: overrides } });
  revalidateSite();
}
