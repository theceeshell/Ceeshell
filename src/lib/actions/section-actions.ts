"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { SECTION_SCHEMAS, type SectionType } from "@/lib/cms/section-types";

function revalidatePageSurfaces(pageSlug: string) {
  revalidatePath(`/admin/content/${pageSlug}`);
  revalidatePath(pageSlug === "home" ? "/" : `/${pageSlug}`);
}

export async function toggleSectionEnabledAction(id: string, enabled: boolean) {
  await requireSession();
  const section = await prisma.section.update({ where: { id }, data: { enabled }, include: { page: true } });
  revalidatePageSurfaces(section.page.slug);
}

export async function reorderSectionsAction(pageSlug: string, orderedIds: string[]) {
  await requireSession();
  await Promise.all(orderedIds.map((id, index) => prisma.section.update({ where: { id }, data: { order: index } })));
  revalidatePageSurfaces(pageSlug);
}

export async function createSectionAction(pageSlug: string, type: SectionType, name: string, content: unknown) {
  await requireSession();
  const schema = SECTION_SCHEMAS[type];
  const parsed = schema.parse(content);

  const page = await prisma.page.findUnique({ where: { slug: pageSlug } });
  if (!page) throw new Error("Page not found");

  const maxOrder = await prisma.section.aggregate({ _max: { order: true }, where: { pageId: page.id } });
  await prisma.section.create({
    data: { pageId: page.id, type, name, content: parsed, order: (maxOrder._max.order ?? -1) + 1, enabled: true },
  });
  revalidatePageSurfaces(pageSlug);
}

export async function updateSectionAction(id: string, name: string, content: unknown) {
  await requireSession();
  const section = await prisma.section.findUnique({ where: { id }, include: { page: true } });
  if (!section) throw new Error("Section not found");

  const schema = SECTION_SCHEMAS[section.type as SectionType];
  const parsed = schema.parse(content);

  await prisma.section.update({ where: { id }, data: { name, content: parsed } });
  revalidatePageSurfaces(section.page.slug);
}

export async function deleteSectionAction(id: string) {
  await requireSession();
  const section = await prisma.section.findUnique({ where: { id }, include: { page: true } });
  if (!section) throw new Error("Section not found");
  await prisma.section.delete({ where: { id } });
  revalidatePageSurfaces(section.page.slug);
}

export async function duplicateSectionAction(id: string) {
  await requireSession();
  const section = await prisma.section.findUnique({ where: { id }, include: { page: true } });
  if (!section) throw new Error("Section not found");

  const maxOrder = await prisma.section.aggregate({ _max: { order: true }, where: { pageId: section.pageId } });
  await prisma.section.create({
    data: {
      pageId: section.pageId,
      type: section.type,
      name: `${section.name} (Copy)`,
      content: section.content as object,
      order: (maxOrder._max.order ?? -1) + 1,
      enabled: section.enabled,
    },
  });
  revalidatePageSurfaces(section.page.slug);
}
