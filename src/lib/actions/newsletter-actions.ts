"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export interface NewsletterState {
  success?: boolean;
  error?: string;
}

const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address").max(254);

export async function subscribeNewsletterAction(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  if (formData.get("website")) return { success: true }; // honeypot

  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  if (!(await rateLimit(`newsletter:${await getClientIp()}`, 5, 60 * 60))) {
    return { error: "Too many attempts. Please try again later." };
  }

  // Same response whether or not the address was already subscribed.
  await prisma.newsletterSubscriber.createMany({ data: [{ email: parsed.data }], skipDuplicates: true });
  revalidatePath("/admin/subscribers");
  return { success: true };
}

export async function deleteSubscriberAction(id: string) {
  await requireSession();
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}
