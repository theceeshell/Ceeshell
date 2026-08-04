"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-session";
import { hashPassword } from "@/lib/auth/password";
import { createUserSchema, updateUserSchema, type CreateUserFormValues, type UpdateUserFormValues } from "@/lib/validators/user";

function revalidateUserSurfaces() {
  revalidatePath("/admin/users");
}

/**
 * Throws if deactivating/demoting `targetId` (from its current state to the
 * given `nextRole`/`nextActive`) would leave the site with zero active admins.
 */
async function assertNotRemovingLastAdmin(
  target: { role: string; active: boolean },
  nextRole: "ADMIN" | "EDITOR",
  nextActive: boolean
) {
  const willRemainActiveAdmin = nextRole === "ADMIN" && nextActive === true;
  if (target.role === "ADMIN" && target.active && !willRemainActiveAdmin) {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN", active: true } });
    if (adminCount === 1) {
      throw new Error("You can't remove the last active administrator.");
    }
  }
}

export async function createUserAction(values: CreateUserFormValues) {
  await requireAdmin();
  const data = createUserSchema.parse(values);

  const email = data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("A user with that email already exists.");
  }

  const passwordHash = await hashPassword(data.password);
  await prisma.user.create({
    data: {
      name: data.name,
      email,
      passwordHash,
      role: data.role,
      active: data.active,
    },
  });

  revalidateUserSurfaces();
}

export async function updateUserAction(id: string, values: UpdateUserFormValues) {
  await requireAdmin();
  const data = updateUserSchema.parse(values);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("User not found.");
  }

  const email = data.email.toLowerCase();
  if (email !== existing.email) {
    const emailInUse = await prisma.user.findUnique({ where: { email } });
    if (emailInUse) {
      throw new Error("A user with that email already exists.");
    }
  }

  await assertNotRemovingLastAdmin(existing, data.role, data.active);

  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email,
      role: data.role,
      active: data.active,
      ...(data.password ? { passwordHash: await hashPassword(data.password) } : {}),
    },
  });

  revalidateUserSurfaces();
}

export async function deleteUserAction(id: string) {
  const session = await requireAdmin();

  if (id === session.userId) {
    throw new Error("You can't delete your own account.");
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("User not found.");
  }

  if (existing.role === "ADMIN" && existing.active) {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN", active: true } });
    if (adminCount === 1) {
      throw new Error("You can't remove the last active administrator.");
    }
  }

  await prisma.user.delete({ where: { id } });
  revalidateUserSurfaces();
}

export async function toggleUserActiveAction(id: string, active: boolean) {
  await requireAdmin();

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("User not found.");
  }

  await assertNotRemovingLastAdmin(existing, existing.role as "ADMIN" | "EDITOR", active);

  await prisma.user.update({ where: { id }, data: { active } });
  revalidateUserSurfaces();
}
