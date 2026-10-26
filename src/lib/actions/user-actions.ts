"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-session";
import { hashPassword } from "@/lib/auth/password";
import { isUniqueViolation, type ActionResult } from "@/lib/actions/helpers";
import { createUserSchema, updateUserSchema, type CreateUserFormValues, type UpdateUserFormValues } from "@/lib/validators/user";

const EMAIL_IN_USE = "A user with that email already exists.";
const LAST_ADMIN = "You can't remove the last active administrator.";

/** True if changing `target` to `nextRole`/`nextActive` would leave the site with zero active admins. */
async function wouldRemoveLastAdmin(target: { role: string; active: boolean }, nextRole: string, nextActive: boolean) {
  const willRemainActiveAdmin = nextRole === "ADMIN" && nextActive;
  if (target.role !== "ADMIN" || !target.active || willRemainActiveAdmin) return false;
  const adminCount = await prisma.user.count({ where: { role: "ADMIN", active: true } });
  return adminCount <= 1;
}

export async function createUserAction(values: CreateUserFormValues): Promise<ActionResult> {
  await requireAdmin();
  const data = createUserSchema.parse(values);

  try {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: await hashPassword(data.password),
        role: data.role,
        active: data.active,
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: EMAIL_IN_USE };
    throw error;
  }

  revalidatePath("/admin/users");
}

export async function updateUserAction(id: string, values: UpdateUserFormValues): Promise<ActionResult> {
  await requireAdmin();
  const data = updateUserSchema.parse(values);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return { error: "User not found." };
  if (await wouldRemoveLastAdmin(existing, data.role, data.active)) return { error: LAST_ADMIN };

  // Any change to credentials or privileges signs the user out everywhere.
  const revokeSessions = Boolean(data.password) || data.role !== existing.role || data.active !== existing.active;

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        role: data.role,
        active: data.active,
        ...(data.password ? { passwordHash: await hashPassword(data.password) } : {}),
        ...(revokeSessions ? { sessionVersion: { increment: 1 } } : {}),
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: EMAIL_IN_USE };
    throw error;
  }

  revalidatePath("/admin/users");
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (id === session.userId) return { error: "You can't delete your own account." };

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return { error: "User not found." };
  if (await wouldRemoveLastAdmin(existing, "EDITOR", false)) return { error: LAST_ADMIN };

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function toggleUserActiveAction(id: string, active: boolean): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return { error: "User not found." };
  if (await wouldRemoveLastAdmin(existing, existing.role, active)) return { error: LAST_ADMIN };

  await prisma.user.update({ where: { id }, data: { active, sessionVersion: { increment: 1 } } });
  revalidatePath("/admin/users");
}
