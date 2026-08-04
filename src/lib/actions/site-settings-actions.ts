"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import {
  siteSettingsSchema,
  seoSettingsSchema,
  type SiteSettingsFormValues,
  type SeoSettingsFormValues,
} from "@/lib/validators/site-settings";

export async function updateSiteSettingsAction(values: SiteSettingsFormValues) {
  await requireSession();
  const data = siteSettingsSchema.parse(values);
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: { ...data, socialLinks: data.socialLinks },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

export async function updateSeoSettingsAction(values: SeoSettingsFormValues) {
  await requireSession();
  const data = seoSettingsSchema.parse(values);
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data,
  });
  revalidatePath("/admin/seo");
  revalidatePath("/", "layout");
}
