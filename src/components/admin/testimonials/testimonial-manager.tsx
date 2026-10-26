"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, ArrowUp, ArrowDown } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { TestimonialFormDialog } from "@/components/admin/testimonials/testimonial-form-dialog";
import { deleteTestimonialAction, reorderTestimonialsAction } from "@/lib/actions/testimonial-actions";

export interface TestimonialRow {
  id: string;
  clientName: string;
  company: string;
  position: string;
  review: string;
  rating: number;
  photoUrl: string | null;
  featured: boolean;
  order: number;
}

export function TestimonialManager({ testimonials }: { testimonials: TestimonialRow[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TestimonialRow | null>(null);
  const [pending, startTransition] = React.useTransition();

  function move(row: TestimonialRow, direction: -1 | 1) {
    const sorted = [...testimonials].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((t) => t.id === row.id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    [sorted[index], sorted[swapWith]] = [sorted[swapWith], sorted[index]];
    startTransition(async () => {
      await reorderTestimonialsAction(sorted.map((t) => t.id));
      router.refresh();
    });
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(row: TestimonialRow) {
    setEditing(row);
    setDialogOpen(true);
  }

  const columns: DataTableColumn<TestimonialRow>[] = [
    {
      key: "clientName",
      header: "Client",
      sortValue: (row) => row.clientName,
      render: (row) => (
        <div className="max-w-sm">
          <p className="font-medium text-text">{row.clientName} &middot; {row.company}</p>
          <p className="mt-0.5 truncate text-xs text-muted">{row.review}</p>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      className: "w-24",
      sortValue: (row) => row.rating,
      render: (row) => (
        <div className="flex items-center gap-0.5 text-accent">
          {Array.from({ length: row.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-accent" />
          ))}
        </div>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (row) => <StatusBadge label={row.featured ? "Featured" : "Standard"} tone={row.featured ? "blue" : "neutral"} />,
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
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <DataTable
        data={testimonials}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search testimonials…"
        searchFn={(row, q) => row.clientName.toLowerCase().includes(q) || row.company.toLowerCase().includes(q) || row.review.toLowerCase().includes(q)}
        emptyMessage="No testimonials yet."
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
              title="Delete this testimonial?"
              description="If a case study links to this testimonial, it will no longer display one. This can't be undone."
              onConfirm={async () => {
                await deleteTestimonialAction(row.id);
                toast.success("Testimonial deleted");
                router.refresh();
              }}
            />
          </div>
        )}
      />

      <TestimonialFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialValues={editing} onSaved={() => router.refresh()} />
    </div>
  );
}
