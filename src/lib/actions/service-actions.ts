"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { serviceSchema, type ServiceFormValues } from "@/lib/validators/service";

function revalidateServiceSurfaces(slug?: string) {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  if (slug) revalidatePath(`/services/${slug}`);
}

export async function createServiceAction(values: ServiceFormValues) {
  await requireSession();
  const data = serviceSchema.parse(values);
  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });
  const created = await prisma.service.create({
    data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
  });
  revalidateServiceSurfaces(created.slug);
  return created;
}

export async function updateServiceAction(id: string, values: ServiceFormValues) {
  await requireSession();
  const data = serviceSchema.parse(values);
  const updated = await prisma.service.update({ where: { id }, data });
  revalidateServiceSurfaces(updated.slug);
  return updated;
}

export async function deleteServiceAction(id: string) {
  await requireSession();
  const deleted = await prisma.service.delete({ where: { id } });
  revalidateServiceSurfaces(deleted.slug);
}

export async function reorderServicesAction(orderedIds: string[]) {
  await requireSession();
  await Promise.all(orderedIds.map((id, index) => prisma.service.update({ where: { id }, data: { order: index } })));
  revalidateServiceSurfaces();
}
