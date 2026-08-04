"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { navigationItemSchema, type NavigationItemFormValues } from "@/lib/validators/navigation";

function revalidateNavigationSurfaces() {
  revalidatePath("/admin/navigation");
  // Defensive: the marketing route group already runs force-dynamic, so the
  // navbar reads fresh NavigationItem rows on every request regardless.
  revalidatePath("/", "layout");
}

export async function createNavigationItemAction(values: NavigationItemFormValues) {
  await requireSession();
  const data = navigationItemSchema.parse(values);
  const maxOrder = await prisma.navigationItem.aggregate({ _max: { order: true } });
  await prisma.navigationItem.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  revalidateNavigationSurfaces();
}

export async function updateNavigationItemAction(id: string, values: NavigationItemFormValues) {
  await requireSession();
  const data = navigationItemSchema.parse(values);
  await prisma.navigationItem.update({ where: { id }, data });
  revalidateNavigationSurfaces();
}

export async function deleteNavigationItemAction(id: string) {
  await requireSession();
  await prisma.navigationItem.delete({ where: { id } });
  revalidateNavigationSurfaces();
}

export async function reorderNavigationItemsAction(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) => prisma.navigationItem.update({ where: { id }, data: { order: index } }))
  );
  revalidateNavigationSurfaces();
}
