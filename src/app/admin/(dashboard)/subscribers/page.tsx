import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { brevoConfig } from "@/lib/brevo";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SubscriberManager } from "@/components/admin/subscribers/subscriber-manager";

export const metadata = { title: "Newsletter Subscribers" };

export default async function AdminSubscribersPage() {
  const [session, subscribers] = await Promise.all([
    getSession(),
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <PageHeader title="Newsletter Subscribers" description="People who signed up through the website's newsletter form." />
      <SubscriberManager subscribers={subscribers} brevoConnected={Boolean(brevoConfig())} canSend={session?.role === "ADMIN"} />
    </div>
  );
}
