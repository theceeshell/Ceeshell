"use server";

import { prisma } from "@/lib/db";
import { recordMove } from "@/lib/cms/redirects";
import { requireSession } from "@/lib/auth/require-session";
import { revalidateSite, withSlugCheck, type ActionResult } from "@/lib/actions/helpers";
import { serviceSchema, type ServiceFormValues } from "@/lib/validators/service";

export async function createServiceAction(values: ServiceFormValues): Promise<ActionResult> {
  await requireSession();
  const data = serviceSchema.parse(values);
  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });
  const result = await withSlugCheck(() =>
    prisma.service.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } })
  );
  if (!result) revalidateSite();
  return result;
}

export async function updateServiceAction(id: string, values: ServiceFormValues): Promise<ActionResult> {
  await requireSession();
  const data = serviceSchema.parse(values);
  const result = await withSlugCheck(() =>
    prisma.$transaction(async (tx) => {
      const before = await tx.service.findUniqueOrThrow({ where: { id }, select: { slug: true } });
      await tx.service.update({ where: { id }, data });
      await recordMove(tx, `/services/${before.slug}`, `/services/${data.slug}`);
    })
  );
  if (!result) revalidateSite();
  return result;
}

export async function deleteServiceAction(id: string) {
  await requireSession();
  await prisma.service.delete({ where: { id } });
  revalidateSite();
}

export async function reorderServicesAction(orderedIds: string[]) {
  await requireSession();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.service.update({ where: { id }, data: { order: index } }))
  );
  revalidateSite();
}
