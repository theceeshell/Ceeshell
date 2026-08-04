import { ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/ui/page-header";
import { UserManager } from "@/components/admin/users/user-manager";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const session = await getSession();

  if (session?.role !== "ADMIN") {
    return (
      <div>
        <PageHeader title="Users" description="Manage who can access the admin panel." />
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <p className="font-heading text-lg font-medium text-primary">Access denied</p>
          <p className="max-w-sm text-sm text-muted">You need administrator access to view this page.</p>
        </div>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <PageHeader title="Users" description="Manage who can access the admin panel." />
      <UserManager users={users} currentUserId={session.userId} />
    </div>
  );
}
