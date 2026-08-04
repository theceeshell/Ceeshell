"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { TeamFormDialog } from "@/components/admin/team/team-form-dialog";
import { deleteTeamMemberAction, reorderTeamMembersAction } from "@/lib/actions/team-actions";
import { initialsFromName } from "@/lib/cms/adapters";

export interface TeamRow {
  id: string;
  name: string;
  position: string;
  bio: string;
  photoUrl: string | null;
  linkedin: string | null;
  instagram: string | null;
  behance: string | null;
  order: number;
  active: boolean;
}

export function TeamManager({ members }: { members: TeamRow[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TeamRow | null>(null);
  const [pending, startTransition] = React.useTransition();

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(row: TeamRow) {
    setEditing(row);
    setDialogOpen(true);
  }

  function move(row: TeamRow, direction: -1 | 1) {
    const sorted = [...members].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((m) => m.id === row.id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    [sorted[index], sorted[swapWith]] = [sorted[swapWith], sorted[index]];
    startTransition(async () => {
      await reorderTeamMembersAction(sorted.map((m) => m.id));
      router.refresh();
    });
  }

  const columns: DataTableColumn<TeamRow>[] = [
    {
      key: "name",
      header: "Member",
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-xs font-semibold text-primary">
            {initialsFromName(row.name)}
          </span>
          <div>
            <p className="font-medium text-text">{row.name}</p>
            <p className="text-xs text-muted">{row.position}</p>
          </div>
        </div>
      ),
    },
    {
      key: "active",
      header: "Status",
      render: (row) => <StatusBadge label={row.active ? "Active" : "Hidden"} tone={row.active ? "green" : "neutral"} />,
    },
    {
      key: "order",
      header: "Order",
      className: "w-28",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button aria-label="Move up" disabled={pending} onClick={() => move(row, -1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-primary disabled:opacity-40">
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button aria-label="Move down" disabled={pending} onClick={() => move(row, 1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-primary disabled:opacity-40">
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Team Member
        </Button>
      </div>

      <DataTable
        data={members}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search team…"
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.position.toLowerCase().includes(q)}
        emptyMessage="No team members yet."
        actions={(row) => (
          <div className="flex justify-end gap-1.5">
            <button aria-label="Edit" onClick={() => openEdit(row)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary">
              <Pencil className="h-4 w-4" />
            </button>
            <ConfirmDialog
              trigger={
                <DialogTrigger asChild>
                  <button aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </DialogTrigger>
              }
              title="Remove this team member?"
              description="This will remove them from the About page. This can't be undone."
              onConfirm={async () => {
                await deleteTeamMemberAction(row.id);
                toast.success("Team member removed");
                router.refresh();
              }}
            />
          </div>
        )}
      />

      <TeamFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialValues={editing} onSaved={() => router.refresh()} />
    </div>
  );
}
