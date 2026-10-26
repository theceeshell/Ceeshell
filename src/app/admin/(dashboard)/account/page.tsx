import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AccountForm } from "@/components/admin/account/account-form";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <PageHeader title="My Account" description="Change your name, login email or password." />
      <AccountForm name={session.name} email={session.email} />
    </div>
  );
}
