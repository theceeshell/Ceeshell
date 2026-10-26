import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AccessDenied } from "@/components/admin/ui/access-denied";
import { UserManager } from "@/components/admin/users/user-manager";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const session = await getSession();

  if (session?.role !== "ADMIN") {
    return <AccessDenied title="Users" description="Manage who can access the admin panel." />;
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
