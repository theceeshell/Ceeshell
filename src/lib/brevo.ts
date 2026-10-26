import "server-only";

/**
 * Brevo (free plan: 300 emails/day) powers the newsletter. Subscribers are
 * mirrored into a Brevo contact list, and campaigns are written in the admin
 * and sent through Brevo, which handles delivery, bounces and unsubscribes.
 * Optional: without the env vars below, sign-ups are only stored in the DB.
 *
 *   BREVO_API_KEY       Brevo -> SMTP & API -> API keys
 *   BREVO_LIST_ID       Brevo -> Contacts -> Lists (the list's ID number)
 *   BREVO_SENDER_EMAIL  a sender verified in Brevo -> Senders, domains & IPs
 *   BREVO_SENDER_NAME   optional, defaults to the website name
 */

const API = "https://api.brevo.com/v3";

export function brevoConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !Number.isInteger(listId) || listId <= 0 || !senderEmail) return null;
  return { apiKey, listId, senderEmail, senderName: process.env.BREVO_SENDER_NAME };
}

async function brevo<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const config = brevoConfig();
  if (!config) throw new Error("Brevo is not configured");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "api-key": config.apiKey, "content-type": "application/json", accept: "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo ${init.method ?? "GET"} ${path} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return (res.status === 204 ? undefined : await res.json().catch(() => undefined)) as T;
}

export async function addContactToList(email: string) {
  const config = brevoConfig();
  if (!config) return;
  await brevo("/contacts", {
    method: "POST",
    body: JSON.stringify({ email, listIds: [config.listId], updateEnabled: true }),
  });
}

export async function removeContactFromList(email: string) {
  const config = brevoConfig();
  if (!config) return;
  await brevo(`/contacts/lists/${config.listId}/contacts/remove`, {
    method: "POST",
    body: JSON.stringify({ emails: [email] }),
  });
}

/** Adds every given address to the list in one background import. */
export async function importContacts(emails: string[]) {
  const config = brevoConfig();
  if (!config || emails.length === 0) return;
  await brevo("/contacts/import", {
    method: "POST",
    body: JSON.stringify({
      listIds: [config.listId],
      jsonBody: emails.map((email) => ({ email })),
      updateExistingContacts: true,
      emptyContactsAttributes: false,
    }),
  });
}

export async function getListSize() {
  const config = brevoConfig();
  if (!config) return null;
  const list = await brevo<{ uniqueSubscribers?: number; totalSubscribers?: number }>(`/contacts/lists/${config.listId}`);
  return list.uniqueSubscribers ?? list.totalSubscribers ?? 0;
}

function sender(fallbackName: string) {
  const config = brevoConfig()!;
  return { email: config.senderEmail, name: config.senderName || fallbackName };
}

/** One-off email to a single address (used for "send me a test"). */
export async function sendSingleEmail(to: string, subject: string, html: string, senderName: string) {
  await brevo("/smtp/email", {
    method: "POST",
    body: JSON.stringify({ sender: sender(senderName), to: [{ email: to }], subject, htmlContent: html }),
  });
}

/** Creates a campaign for the whole list and sends it immediately. */
export async function sendCampaign(subject: string, html: string, senderName: string) {
  const config = brevoConfig()!;
  const campaign = await brevo<{ id: number }>("/emailCampaigns", {
    method: "POST",
    body: JSON.stringify({
      name: `${subject} (${new Date().toISOString().slice(0, 10)})`,
      subject,
      sender: sender(senderName),
      type: "classic",
      htmlContent: html,
      recipients: { listIds: [config.listId] },
    }),
  });
  await brevo(`/emailCampaigns/${campaign.id}/sendNow`, { method: "POST" });
  return campaign.id;
}

export interface SentCampaign {
  id: number;
  subject: string;
  sentDate?: string;
  delivered?: number;
  opens?: number;
}

export async function listSentCampaigns(): Promise<SentCampaign[]> {
  const config = brevoConfig();
  if (!config) return [];
  const data = await brevo<{
    campaigns?: {
      id: number;
      subject: string;
      sentDate?: string;
      statistics?: { globalStats?: { delivered?: number; uniqueViews?: number } };
    }[];
  }>("/emailCampaigns?status=sent&limit=10&sort=desc&statistics=globalStats");
  return (data.campaigns ?? []).map((c) => ({
    id: c.id,
    subject: c.subject,
    sentDate: c.sentDate,
    delivered: c.statistics?.globalStats?.delivered,
    opens: c.statistics?.globalStats?.uniqueViews,
  }));
}
