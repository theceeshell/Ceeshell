"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSessionCookie } from "@/lib/auth/session";
import { isUniqueViolation, type ActionResult } from "@/lib/actions/helpers";

const accountSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254),
  currentPassword: z.string().min(1, "Enter your current password to confirm").max(200),
  newPassword: z
    .string()
    .max(72, "Password must be at most 72 characters")
    .refine((v) => v === "" || v.length >= 8, "New password must be at least 8 characters"),
});

/** Lets any signed-in user change their own name, email and password (current password required). */
export async function updateMyAccountAction(values: z.input<typeof accountSchema>): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = accountSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  const { name, email, currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return { error: "Your current password is incorrect." };
  }

  let updated;
  try {
    updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        ...(newPassword
          ? { passwordHash: await hashPassword(newPassword), sessionVersion: { increment: 1 } }
          : {}),
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "Another user already has that email." };
    throw error;
  }

  // A new password signs out every other device; keep this one signed in.
  if (newPassword) await createSessionCookie(updated);
  revalidatePath("/admin", "layout");
}
