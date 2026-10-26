"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-session";
import { revalidateSite } from "@/lib/actions/helpers";
import {
  siteSettingsSchema,
  seoSettingsSchema,
  type SiteSettingsFormValues,
  type SeoSettingsFormValues,
} from "@/lib/validators/site-settings";

export async function updateSiteSettingsAction(values: SiteSettingsFormValues) {
  await requireAdmin();
  const data = siteSettingsSchema.parse(values);
  await prisma.siteSettings.update({ where: { id: "singleton" }, data });
  revalidateSite();
}

export async function updateSeoSettingsAction(values: SeoSettingsFormValues) {
  await requireAdmin();
  const data = seoSettingsSchema.parse(values);
  await prisma.siteSettings.update({ where: { id: "singleton" }, data });
  revalidateSite();
}
