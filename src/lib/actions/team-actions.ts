"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { teamMemberSchema, type TeamMemberFormValues } from "@/lib/validators/team";

function revalidateTeamSurfaces() {
  revalidatePath("/admin/team");
  revalidatePath("/about");
}

export async function createTeamMemberAction(values: TeamMemberFormValues) {
  await requireSession();
  const data = teamMemberSchema.parse(values);
  const maxOrder = await prisma.teamMember.aggregate({ _max: { order: true } });
  await prisma.teamMember.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  revalidateTeamSurfaces();
}

export async function updateTeamMemberAction(id: string, values: TeamMemberFormValues) {
  await requireSession();
  const data = teamMemberSchema.parse(values);
  await prisma.teamMember.update({ where: { id }, data });
  revalidateTeamSurfaces();
}

export async function deleteTeamMemberAction(id: string) {
  await requireSession();
  await prisma.teamMember.delete({ where: { id } });
  revalidateTeamSurfaces();
}

export async function reorderTeamMembersAction(orderedIds: string[]) {
  await requireSession();
  await Promise.all(orderedIds.map((id, index) => prisma.teamMember.update({ where: { id }, data: { order: index } })));
  revalidateTeamSurfaces();
}
