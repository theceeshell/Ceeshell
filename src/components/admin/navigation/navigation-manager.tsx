"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { NavigationFormDialog } from "@/components/admin/navigation/navigation-form-dialog";
import type { LinkOption } from "@/lib/cms/link-options";
import { deleteNavigationItemAction, reorderNavigationItemsAction } from "@/lib/actions/navigation-actions";

export interface NavigationItemRow {
  id: string;
  label: string;
  href: string;
  order: number;
  openNewTab: boolean;
  visible: boolean;
}

export function NavigationManager({ items, linkOptions }: { items: NavigationItemRow[]; linkOptions: LinkOption[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<NavigationItemRow | null>(null);
  const [pending, startTransition] = React.useTransition();

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(row: NavigationItemRow) {
    setEditing(row);
    setDialogOpen(true);
  }

  function move(row: NavigationItemRow, direction: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((f) => f.id === row.id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    [sorted[index], sorted[swapWith]] = [sorted[swapWith], sorted[index]];
    startTransition(async () => {
      await reorderNavigationItemsAction(sorted.map((f) => f.id));
      router.refresh();
    });
  }

  const columns: DataTableColumn<NavigationItemRow>[] = [
    {
      key: "label",
      header: "Label",
      sortValue: (row) => row.label,
      render: (row) => <p className="font-medium text-text">{row.label}</p>,
    },
    {
      key: "href",
      header: "Link",
      sortValue: (row) => row.href,
      render: (row) => (
        <span className="flex items-center gap-1.5 text-muted">
          {row.href}
          {row.openNewTab && <ExternalLink className="h-3.5 w-3.5" />}
        </span>
      ),
    },
    {
      key: "visible",
      header: "Visible",
      className: "w-24",
      render: (row) => (
        <span
          className={
            row.visible
              ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
              : "inline-flex rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted"
          }
        >
          {row.visible ? "Visible" : "Hidden"}
        </span>
      ),
    },
    {
      key: "openNewTab",
      header: "New Tab",
      className: "w-24",
      render: (row) => <span className="text-muted">{row.openNewTab ? "Yes" : "No"}</span>,
    },
    {
      key: "order",
      header: "Order",
      className: "w-28",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            aria-label="Move up"
            disabled={pending}
            onClick={() => move(row, -1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-primary disabled:opacity-40"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="Move down"
            disabled={pending}
            onClick={() => move(row, 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-primary disabled:opacity-40"
          >
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
          <Plus className="h-4 w-4" /> Add Nav Item
        </Button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search nav items…"
        searchFn={(row, q) => row.label.toLowerCase().includes(q) || row.href.toLowerCase().includes(q)}
        emptyMessage="No navigation items yet — add your first menu link."
        actions={(row) => (
          <div className="flex justify-end gap-1.5">
            <button
              aria-label="Edit"
              onClick={() => openEdit(row)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
            >
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
              title="Delete this nav item?"
              description="This will remove it from the main site menu. This can't be undone."
              onConfirm={async () => {
                await deleteNavigationItemAction(row.id);
                toast.success("Nav item deleted");
                router.refresh();
              }}
            />
          </div>
        )}
      />

      <NavigationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValues={editing}
        linkOptions={linkOptions}
        onSaved={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
