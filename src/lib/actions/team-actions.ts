"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { revalidateSite } from "@/lib/actions/helpers";
import { teamMemberSchema, type TeamMemberFormValues } from "@/lib/validators/team";


export async function createTeamMemberAction(values: TeamMemberFormValues) {
  await requireSession();
  const data = teamMemberSchema.parse(values);
  const maxOrder = await prisma.teamMember.aggregate({ _max: { order: true } });
  await prisma.teamMember.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  revalidateSite();
}

export async function updateTeamMemberAction(id: string, values: TeamMemberFormValues) {
  await requireSession();
  const data = teamMemberSchema.parse(values);
  await prisma.teamMember.update({ where: { id }, data });
  revalidateSite();
}

export async function deleteTeamMemberAction(id: string) {
  await requireSession();
  await prisma.teamMember.delete({ where: { id } });
  revalidateSite();
}

export async function reorderTeamMembersAction(orderedIds: string[]) {
  await requireSession();
  await prisma.$transaction(orderedIds.map((id, index) => prisma.teamMember.update({ where: { id }, data: { order: index } })));
  revalidateSite();
}
