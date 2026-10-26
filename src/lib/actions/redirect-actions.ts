"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-session";
import { isUniqueViolation, revalidateSite, type ActionResult } from "@/lib/actions/helpers";
import { hrefSchema } from "@/lib/validators/shared";

/** Accepts a path or a full URL of this site; stores the path without a trailing slash. */
function toPath(value: string) {
  let path = value.trim();
  try {
    path = new URL(path).pathname;
  } catch {
    // Not a full URL: treat it as a path.
  }
  return (path.startsWith("/") ? path : `/${path}`).replace(/\/+$/, "") || "/";
}

const redirectSchema = z.object({
  from: z
    .string()
    .transform(toPath)
    .refine((v) => v !== "/" && !v.startsWith("/admin") && !v.startsWith("/api"), "Choose an old address like /old-page"),
  to: hrefSchema,
});

export async function createRedirectAction(values: { from: string; to: string }): Promise<ActionResult> {
  await requireAdmin();
  const parsed = redirectSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the addresses." };
  if (parsed.data.from === parsed.data.to) return { error: "The old and new address are the same." };

  try {
    await prisma.redirect.create({ data: parsed.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "There's already a redirect from that address." };
    throw error;
  }
  revalidateSite(); // a cached "not found" for the old address must be re-rendered
}

export async function deleteRedirectAction(id: string) {
  await requireAdmin();
  await prisma.redirect.delete({ where: { id } });
  revalidatePath("/admin/redirects");
}
