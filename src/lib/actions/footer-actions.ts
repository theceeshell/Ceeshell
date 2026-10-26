"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-session";
import { revalidateSite } from "@/lib/actions/helpers";
import { footerConfigSchema, type FooterConfigFormValues } from "@/lib/validators/footer";

export async function updateFooterConfigAction(values: FooterConfigFormValues) {
  await requireAdmin();
  const data = footerConfigSchema.parse(values);
  await prisma.footerConfig.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  revalidateSite();
}
