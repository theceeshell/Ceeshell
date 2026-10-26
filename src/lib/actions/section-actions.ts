"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { revalidateSite } from "@/lib/actions/helpers";
import { SECTION_SCHEMAS, SECTION_TYPES, type SectionType } from "@/lib/cms/section-types";

const sectionTypeSchema = z.enum(SECTION_TYPES.map((s) => s.type) as [SectionType, ...SectionType[]]);
const sectionNameSchema = z.string().trim().min(1, "Section name is required").max(120);

export async function toggleSectionEnabledAction(id: string, enabled: boolean) {
  await requireSession();
  await prisma.section.update({ where: { id }, data: { enabled: z.boolean().parse(enabled) } });
  revalidateSite();
}

export async function reorderSectionsAction(_pageSlug: string, orderedIds: string[]) {
  await requireSession();
  await prisma.$transaction(orderedIds.map((id, index) => prisma.section.update({ where: { id }, data: { order: index } })));
  revalidateSite();
}

export async function createSectionAction(pageSlug: string, type: SectionType, name: string, content: unknown) {
  await requireSession();
  const sectionType = sectionTypeSchema.parse(type);
  const sectionName = sectionNameSchema.parse(name);
  const parsed = SECTION_SCHEMAS[sectionType].parse(content);

  const page = await prisma.page.findUnique({ where: { slug: pageSlug } });
  if (!page) throw new Error("Page not found");

  const maxOrder = await prisma.section.aggregate({ _max: { order: true }, where: { pageId: page.id } });
  await prisma.section.create({
    data: { pageId: page.id, type: sectionType, name: sectionName, content: parsed, order: (maxOrder._max.order ?? -1) + 1, enabled: true },
  });
  revalidateSite();
}

export async function updateSectionAction(id: string, name: string, content: unknown) {
  await requireSession();
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section) throw new Error("Section not found");

  const parsed = SECTION_SCHEMAS[sectionTypeSchema.parse(section.type)].parse(content);
  await prisma.section.update({ where: { id }, data: { name: sectionNameSchema.parse(name), content: parsed } });
  revalidateSite();
}

export async function deleteSectionAction(id: string) {
  await requireSession();
  await prisma.section.delete({ where: { id } });
  revalidateSite();
}

export async function duplicateSectionAction(id: string) {
  await requireSession();
  const section = await prisma.section.findUnique({ where: { id } });
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
  revalidateSite();
}
