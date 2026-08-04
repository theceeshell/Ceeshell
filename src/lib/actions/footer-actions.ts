"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { footerConfigSchema, type FooterConfigFormValues } from "@/lib/validators/footer";

export async function updateFooterConfigAction(values: FooterConfigFormValues) {
  await requireSession();
  const data = footerConfigSchema.parse(values);
  await prisma.footerConfig.update({
    where: { id: "singleton" },
    data: {
      ...data,
      quickLinks: data.quickLinks,
      serviceLinks: data.serviceLinks,
    },
  });
  revalidatePath("/admin/footer");
  revalidatePath("/", "layout");
}
