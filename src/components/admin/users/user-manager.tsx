"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { UserFormDialog } from "@/components/admin/users/user-form-dialog";
import { deleteUserAction } from "@/lib/actions/user-actions";
import { formatDate } from "@/lib/format-date";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: Date;
}

export function UserManager({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<UserRow | null>(null);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(row: UserRow) {
    setEditing(row);
    setDialogOpen(true);
  }

  const columns: DataTableColumn<UserRow>[] = [
    {
      key: "name",
      header: "Name",
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <p className="font-medium text-text">{row.name}</p>
          <p className="text-xs text-muted">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortValue: (row) => row.role,
      render: (row) => <StatusBadge label={row.role === "ADMIN" ? "Admin" : "Editor"} tone={row.role === "ADMIN" ? "blue" : "neutral"} />,
    },
    {
      key: "active",
      header: "Status",
      render: (row) => <StatusBadge label={row.active ? "Active" : "Inactive"} tone={row.active ? "green" : "neutral"} />,
    },
    {
      key: "createdAt",
      header: "Created",
      sortValue: (row) => new Date(row.createdAt).getTime(),
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search users…"
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)}
        emptyMessage="No users yet."
        actions={(row) => (
          <div className="flex justify-end gap-1.5">
            <button
              aria-label="Edit"
              onClick={() => openEdit(row)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </button>
            {row.id === currentUserId ? (
              <span
                title="You can't delete your own account"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted/30"
              >
                <Trash2 className="h-4 w-4" />
              </span>
            ) : (
              <ConfirmDialog
                trigger={
                  <DialogTrigger asChild>
                    <button aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </DialogTrigger>
                }
                title="Delete this user?"
                description="They will immediately lose access to the admin panel. This can't be undone."
                onConfirm={async () => {
                  try {
                    const result = await deleteUserAction(row.id);
                    if (result?.error) {
                      toast.error(result.error);
                      return;
                    }
                    toast.success("User deleted");
                    router.refresh();
                  } catch {
                    toast.error("Something went wrong — please try again.");
                  }
                }}
              />
            )}
          </div>
        )}
      />

      <UserFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialValues={editing} onSaved={() => router.refresh()} />
    </div>
  );
}
