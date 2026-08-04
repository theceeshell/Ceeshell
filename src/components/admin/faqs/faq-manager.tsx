"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { FaqFormDialog } from "@/components/admin/faqs/faq-form-dialog";
import { deleteFaqAction, reorderFaqsAction, duplicateFaqAction } from "@/lib/actions/faq-actions";

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export function FaqManager({ faqs }: { faqs: FaqRow[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FaqRow | null>(null);
  const [pending, startTransition] = React.useTransition();

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(row: FaqRow) {
    setEditing(row);
    setDialogOpen(true);
  }

  function move(row: FaqRow, direction: -1 | 1) {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((f) => f.id === row.id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    [sorted[index], sorted[swapWith]] = [sorted[swapWith], sorted[index]];
    startTransition(async () => {
      await reorderFaqsAction(sorted.map((f) => f.id));
      router.refresh();
    });
  }

  const columns: DataTableColumn<FaqRow>[] = [
    {
      key: "question",
      header: "Question",
      sortValue: (row) => row.question,
      render: (row) => (
        <div className="max-w-md">
          <p className="font-medium text-text">{row.question}</p>
          <p className="mt-0.5 truncate text-xs text-muted">{row.answer}</p>
        </div>
      ),
    },
    { key: "category", header: "Category", sortValue: (row) => row.category, render: (row) => row.category },
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
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      <DataTable
        data={faqs}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search questions…"
        searchFn={(row, q) => row.question.toLowerCase().includes(q) || row.answer.toLowerCase().includes(q)}
        emptyMessage="No FAQs yet — add your first question."
        actions={(row) => (
          <div className="flex justify-end gap-1.5">
            <button
              aria-label="Edit"
              onClick={() => openEdit(row)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              aria-label="Duplicate"
              onClick={() =>
                startTransition(async () => {
                  await duplicateFaqAction(row.id);
                  toast.success("FAQ duplicated");
                  router.refresh();
                })
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
            >
              <Copy className="h-4 w-4" />
            </button>
            <ConfirmDialog
              trigger={
                <DialogTrigger asChild>
                  <button aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </DialogTrigger>
              }
              title="Delete this FAQ?"
              description="This will remove it from every page that references it. This can't be undone."
              onConfirm={async () => {
                await deleteFaqAction(row.id);
                toast.success("FAQ deleted");
                router.refresh();
              }}
            />
          </div>
        )}
      />

      <FaqFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValues={editing}
        onSaved={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
