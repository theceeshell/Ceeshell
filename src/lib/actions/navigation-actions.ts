"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-session";
import { revalidateSite } from "@/lib/actions/helpers";
import { navigationItemSchema, type NavigationItemFormValues } from "@/lib/validators/navigation";


export async function createNavigationItemAction(values: NavigationItemFormValues) {
  await requireAdmin();
  const data = navigationItemSchema.parse(values);
  const maxOrder = await prisma.navigationItem.aggregate({ _max: { order: true } });
  await prisma.navigationItem.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  revalidateSite();
}

export async function updateNavigationItemAction(id: string, values: NavigationItemFormValues) {
  await requireAdmin();
  const data = navigationItemSchema.parse(values);
  await prisma.navigationItem.update({ where: { id }, data });
  revalidateSite();
}

export async function deleteNavigationItemAction(id: string) {
  await requireAdmin();
  await prisma.navigationItem.delete({ where: { id } });
  revalidateSite();
}

export async function reorderNavigationItemsAction(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(orderedIds.map((id, index) => prisma.navigationItem.update({ where: { id }, data: { order: index } })));
  revalidateSite();
}
