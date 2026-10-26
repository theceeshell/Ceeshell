"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { recordMove } from "@/lib/cms/redirects";
import { requireAdmin } from "@/lib/auth/require-session";
import { isUniqueViolation, revalidateSite, type ActionResult } from "@/lib/actions/helpers";
import { isReservedSlug, isSystemPage, pagePath } from "@/lib/cms/pages";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Web address is required")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only, e.g. our-story");

const pageSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(300),
  slug: slugSchema,
});

export type PageFormValues = z.infer<typeof pageSchema>;

const SLUG_TAKEN = "Another page already uses that web address.";

export async function createPageAction(values: PageFormValues & { addToMenu: boolean }): Promise<ActionResult> {
  await requireAdmin();
  const data = pageSchema.parse(values);
  if (isReservedSlug(data.slug)) return { error: "That web address is reserved. Choose a different one." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.page.create({ data });
      if (values.addToMenu) {
        const maxOrder = await tx.navigationItem.aggregate({ _max: { order: true } });
        await tx.navigationItem.create({
          data: { label: data.title, href: pagePath(data.slug), order: (maxOrder._max.order ?? -1) + 1, visible: true, openNewTab: false },
        });
      }
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: SLUG_TAKEN };
    throw error;
  }
  revalidateSite();
}

export async function updatePageAction(id: string, values: PageFormValues): Promise<ActionResult> {
  await requireAdmin();
  const data = pageSchema.parse(values);
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return { error: "Page not found." };

  // System pages have a fixed address; custom pages can be renamed.
  const slug = isSystemPage(page.slug) ? page.slug : data.slug;
  if (slug !== page.slug && isReservedSlug(slug)) return { error: "That web address is reserved. Choose a different one." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.page.update({ where: { id }, data: { ...data, slug } });
      // Old links keep working and menu/footer links follow the page.
      await recordMove(tx, pagePath(page.slug), pagePath(slug));
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: SLUG_TAKEN };
    throw error;
  }
  revalidateSite();
}

export async function deletePageAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return { error: "Page not found." };
  if (isSystemPage(page.slug)) return { error: "This is one of the main pages of the website and can't be deleted." };

  await prisma.$transaction([
    prisma.navigationItem.deleteMany({ where: { href: pagePath(page.slug) } }),
    prisma.page.delete({ where: { id } }),
  ]);
  revalidateSite();
}
