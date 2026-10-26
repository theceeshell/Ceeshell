"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { revalidateSite, withSlugCheck, type ActionResult } from "@/lib/actions/helpers";
import { industrySchema, type IndustryFormValues } from "@/lib/validators/industry";

function toData(values: IndustryFormValues) {
  const { projectIds, seoTitle, seoDescription, ...rest } = industrySchema.parse(values);
  return { data: { ...rest, seoTitle: seoTitle || null, seoDescription: seoDescription || null }, projectIds };
}

export async function createIndustryAction(values: IndustryFormValues): Promise<ActionResult> {
  await requireSession();
  const { data, projectIds } = toData(values);
  const maxOrder = await prisma.industry.aggregate({ _max: { order: true } });
  const result = await withSlugCheck(() =>
    prisma.industry.create({
      data: {
        ...data,
        order: (maxOrder._max.order ?? -1) + 1,
        relatedProjects: { connect: projectIds.map((id) => ({ id })) },
      },
    })
  );
  if (!result) revalidateSite();
  return result;
}

export async function updateIndustryAction(id: string, values: IndustryFormValues): Promise<ActionResult> {
  await requireSession();
  const { data, projectIds } = toData(values);
  const result = await withSlugCheck(() =>
    prisma.industry.update({
      where: { id },
      data: { ...data, relatedProjects: { set: projectIds.map((projectId) => ({ id: projectId })) } },
    })
  );
  if (!result) revalidateSite();
  return result;
}

export async function deleteIndustryAction(id: string) {
  await requireSession();
  await prisma.industry.delete({ where: { id } });
  revalidateSite();
}

export async function reorderIndustriesAction(orderedIds: string[]) {
  await requireSession();
  await prisma.$transaction(orderedIds.map((id, index) => prisma.industry.update({ where: { id }, data: { order: index } })));
  revalidateSite();
}
