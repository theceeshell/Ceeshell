"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DUMMY_PASSWORD_HASH, verifyPassword } from "@/lib/auth/password";
import { createSessionCookie, destroySessionCookie, getSession } from "@/lib/auth/session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

export interface LoginState {
  error?: string;
}

const INVALID_CREDENTIALS = "Incorrect email or password.";

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const { email, password } = parsed.data;
  const ip = await getClientIp();
  const [ipAllowed, emailAllowed] = await Promise.all([
    rateLimit(`login:ip:${ip}`, 20, 15 * 60),
    rateLimit(`login:email:${email}`, 10, 15 * 60),
  ]);
  if (!ipAllowed || !emailAllowed) {
    return { error: "Too many sign-in attempts. Please wait 15 minutes and try again." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Always run bcrypt so response time doesn't reveal whether the email exists.
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
  if (!user || !user.active || !valid) {
    return { error: INVALID_CREDENTIALS };
  }

  await createSessionCookie(user);
  redirect("/admin");
}

export async function logoutAction() {
  const session = await getSession();
  if (session) {
    // Invalidates this token everywhere (it can't be revoked any other way).
    await prisma.user.update({ where: { id: session.userId }, data: { sessionVersion: { increment: 1 } } });
  }
  await destroySessionCookie();
  redirect("/admin/login");
}
