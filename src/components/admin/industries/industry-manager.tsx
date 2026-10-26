"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { deleteIndustryAction, reorderIndustriesAction } from "@/lib/actions/industry-actions";

export interface IndustryRow {
  id: string;
  slug: string;
  name: string;
  heroImageUrl: string;
  visible: boolean;
  order: number;
  projectCount: number;
}

export function IndustryManager({ industries }: { industries: IndustryRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function move(row: IndustryRow, direction: -1 | 1) {
    const sorted = [...industries].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((s) => s.id === row.id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    [sorted[index], sorted[swapWith]] = [sorted[swapWith], sorted[index]];
    startTransition(async () => {
      await reorderIndustriesAction(sorted.map((s) => s.id));
      router.refresh();
    });
  }

  const columns: DataTableColumn<IndustryRow>[] = [
    {
      key: "name",
      header: "Industry",
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
          <img src={row.heroImageUrl} alt="" className="h-10 w-14 rounded object-cover" />
          <div>
            <p className="font-medium text-text">{row.name}</p>
            <p className="text-xs text-muted">
              {row.projectCount} project{row.projectCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "visible",
      header: "Status",
      render: (row) => <StatusBadge label={row.visible ? "On website" : "Hidden"} tone={row.visible ? "green" : "neutral"} />,
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
        <Button size="sm" asChild>
          <Link href="/admin/industries/new">
            <Plus className="h-4 w-4" /> Add Industry
          </Link>
        </Button>
      </div>

      <DataTable
        data={industries}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search industries…"
        searchFn={(row, q) => row.name.toLowerCase().includes(q)}
        emptyMessage="No industries yet."
        actions={(row) => (
          <div className="flex justify-end gap-1.5">
            {row.visible && (
              <a
                href={`/industries/${row.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on website"
                title="View on website"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <Link href={`/admin/industries/${row.id}`} aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary">
              <Pencil className="h-4 w-4" />
            </Link>
            <ConfirmDialog
              trigger={
                <DialogTrigger asChild>
                  <button aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </DialogTrigger>
              }
              title="Delete this industry?"
              description="Its page will be removed from the website. Projects are not deleted. Tip: you can hide it instead."
              onConfirm={async () => {
                await deleteIndustryAction(row.id);
                toast.success("Industry deleted");
                router.refresh();
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
