import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { brevoConfig, getListSize, listSentCampaigns, type SentCampaign } from "@/lib/brevo";
import { formatDate } from "@/lib/format-date";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AccessDenied } from "@/components/admin/ui/access-denied";
import { NewsletterComposer } from "@/components/admin/subscribers/newsletter-composer";

export const metadata = { title: "Send Newsletter" };

const DESCRIPTION = "Write a newsletter and send it to everyone who subscribed.";

export default async function SendNewsletterPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") return <AccessDenied title="Send Newsletter" description={DESCRIPTION} />;

  const back = (
    <Link href="/admin/subscribers" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary">
      <ArrowLeft className="h-3.5 w-3.5" /> Subscribers
    </Link>
  );

  if (!brevoConfig()) {
    return (
      <div>
        {back}
        <PageHeader title="Send Newsletter" description={DESCRIPTION} />
        <div className="max-w-2xl rounded-2xl border border-border bg-white p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/8 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-medium text-primary">Connect Brevo to send newsletters</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Newsletters are delivered through Brevo (free for up to 300 emails a day), which also handles unsubscribes.
            Once it&apos;s connected, new subscribers are added to Brevo automatically and you can write and send
            newsletters right here. Ask your developer to set it up — it takes about 10 minutes.
          </p>
        </div>
      </div>
    );
  }

  let listSize: number | null = null;
  let campaigns: SentCampaign[] = [];
  try {
    [listSize, campaigns] = await Promise.all([getListSize(), listSentCampaigns()]);
  } catch (error) {
    console.error("Brevo status failed", error);
  }

  return (
    <div>
      {back}
      <PageHeader title="Send Newsletter" description={DESCRIPTION} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <NewsletterComposer recipientCount={listSize} testEmail={session.email} />
        <aside className="h-fit rounded-2xl border border-border bg-white p-6">
          <h2 className="font-heading text-lg font-medium text-primary">Recently sent</h2>
          {campaigns.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing sent yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {campaigns.map((c) => (
                <li key={c.id} className="py-3">
                  <p className="text-sm font-medium text-text">{c.subject}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {c.sentDate ? formatDate(c.sentDate) : "Sending…"}
                    {c.delivered !== undefined && ` · ${c.delivered} delivered`}
                    {c.opens !== undefined && ` · ${c.opens} opened`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
