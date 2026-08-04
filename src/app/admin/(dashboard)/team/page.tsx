import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { TeamManager } from "@/components/admin/team/team-manager";

export const metadata = { title: "Team" };

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Team" description="Manage the people shown on the About page." />
      <TeamManager members={members} />
    </div>
  );
}
