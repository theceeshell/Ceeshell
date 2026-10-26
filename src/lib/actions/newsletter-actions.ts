"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, requireSession } from "@/lib/auth/require-session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { addContactToList, brevoConfig, importContacts, removeContactFromList, sendCampaign, sendSingleEmail } from "@/lib/brevo";
import { renderNewsletterHtml } from "@/lib/newsletter-email";
import { getSiteSettings } from "@/lib/cms/site-data";
import { siteConfig } from "@/lib/site-config";
import type { ActionResult } from "@/lib/actions/helpers";

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
  after(() =>
    addContactToList(parsed.data).catch((error) => console.error("Brevo: adding subscriber failed", error))
  );
  revalidatePath("/admin/subscribers");
  return { success: true };
}

export async function deleteSubscriberAction(id: string) {
  await requireSession();
  const subscriber = await prisma.newsletterSubscriber.delete({ where: { id } });
  await removeContactFromList(subscriber.email).catch((error) => console.error("Brevo: removing subscriber failed", error));
  revalidatePath("/admin/subscribers");
}

/** Copies every stored subscriber into the Brevo list (e.g. people who signed up before Brevo was connected). */
export async function syncSubscribersToBrevoAction(): Promise<{ error: string } | { count: number }> {
  await requireAdmin();
  if (!brevoConfig()) return { error: "Brevo isn't connected yet." };
  const subscribers = await prisma.newsletterSubscriber.findMany({ select: { email: true } });
  await importContacts(subscribers.map((s) => s.email));
  return { count: subscribers.length };
}

const newsletterSchema = z.object({
  subject: z.string().trim().min(1, "Write a subject line").max(150),
  html: z.string().refine((v) => v.replace(/<[^>]+>/g, "").trim() !== "" || /<img/i.test(v), "Write the newsletter first"),
});

async function buildEmail(values: z.infer<typeof newsletterSchema>, forTest: boolean) {
  const settings = await getSiteSettings();
  return renderNewsletterHtml({
    subject: values.subject,
    bodyHtml: values.html,
    siteName: settings.websiteName,
    siteUrl: siteConfig.url,
    address: settings.address,
    forTest,
  });
}

/** Sends the newsletter only to the signed-in admin, to check how it looks. */
export async function sendNewsletterTestAction(values: { subject: string; html: string }): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!brevoConfig()) return { error: "Brevo isn't connected yet." };
  const parsed = newsletterSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the newsletter." };

  const settings = await getSiteSettings();
  try {
    await sendSingleEmail(session.email, `[Test] ${parsed.data.subject}`, await buildEmail(parsed.data, true), settings.websiteName);
  } catch (error) {
    console.error("Brevo test send failed", error);
    return { error: "Brevo couldn't send the test. Check that the sender email is verified in Brevo." };
  }
}

/** Sends the newsletter to everyone on the Brevo list. */
export async function sendNewsletterAction(values: { subject: string; html: string }): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!brevoConfig()) return { error: "Brevo isn't connected yet." };
  const parsed = newsletterSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the newsletter." };
  // Guards against double clicks / double submits sending twice.
  if (!(await rateLimit(`newsletter-send:${session.userId}`, 1, 60))) {
    return { error: "A newsletter was just sent. Wait a minute before sending another." };
  }

  const settings = await getSiteSettings();
  try {
    await sendCampaign(parsed.data.subject, await buildEmail(parsed.data, false), settings.websiteName);
  } catch (error) {
    console.error("Brevo campaign send failed", error);
    return { error: "Brevo couldn't send the newsletter. Check your Brevo account (sender verified, daily limit)." };
  }
  revalidatePath("/admin/subscribers/send");
}
