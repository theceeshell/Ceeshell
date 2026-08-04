"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { deleteServiceAction, reorderServicesAction } from "@/lib/actions/service-actions";
import { iconMap } from "@/components/shared/icon-map";

export interface ServiceRow {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  featured: boolean;
  order: number;
}

export function ServiceManager({ services }: { services: ServiceRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function move(row: ServiceRow, direction: -1 | 1) {
    const sorted = [...services].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((s) => s.id === row.id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    [sorted[index], sorted[swapWith]] = [sorted[swapWith], sorted[index]];
    startTransition(async () => {
      await reorderServicesAction(sorted.map((s) => s.id));
      router.refresh();
    });
  }

  const columns: DataTableColumn<ServiceRow>[] = [
    {
      key: "icon",
      header: "Icon",
      className: "w-14",
      render: (row) => {
        const Icon = iconMap[row.icon];
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/8 text-primary">
            {Icon ? <Icon className="h-4 w-4" /> : null}
          </span>
        );
      },
    },
    {
      key: "name",
      header: "Service",
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <p className="font-medium text-text">{row.name}</p>
          <p className="text-xs text-muted">{row.shortName}</p>
        </div>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (row) => (
        <StatusBadge label={row.featured ? "Featured" : "Standard"} tone={row.featured ? "green" : "neutral"} />
      ),
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
        <Button size="sm" asChild>
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4" /> Add Service
          </Link>
        </Button>
      </div>

      <DataTable
        data={services}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search services…"
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.shortName.toLowerCase().includes(q)}
        emptyMessage="No services yet — add your first one."
        actions={(row) => (
          <div className="flex justify-end gap-1.5">
            <Link
              href={`/admin/services/${row.id}`}
              aria-label="Edit"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <ConfirmDialog
              trigger={
                <DialogTrigger asChild>
                  <button
                    aria-label="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </DialogTrigger>
              }
              title="Delete this service?"
              description="This will remove it from the Services page and anywhere it's referenced. This can't be undone."
              onConfirm={async () => {
                await deleteServiceAction(row.id);
                toast.success("Service deleted");
                router.refresh();
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
