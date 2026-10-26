"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { deleteSubscriberAction } from "@/lib/actions/newsletter-actions";

export interface SubscriberRow {
  id: string;
  email: string;
  createdAt: Date;
}

function downloadCsv(rows: SubscriberRow[]) {
  const csv = ["email,subscribed_at", ...rows.map((r) => `${r.email},${new Date(r.createdAt).toISOString()}`)].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function SubscriberManager({ subscribers }: { subscribers: SubscriberRow[] }) {
  const router = useRouter();

  const columns: DataTableColumn<SubscriberRow>[] = [
    {
      key: "email",
      header: "Email",
      sortValue: (row) => row.email,
      render: (row) => <span className="font-medium text-text">{row.email}</span>,
    },
    {
      key: "createdAt",
      header: "Subscribed",
      sortValue: (row) => new Date(row.createdAt).getTime(),
      render: (row) => <span className="text-muted">{format(new Date(row.createdAt), "d MMM yyyy")}</span>,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button size="sm" variant="secondary" onClick={() => downloadCsv(subscribers)} disabled={subscribers.length === 0}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <DataTable
        data={subscribers}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search emails…"
        searchFn={(row, q) => row.email.includes(q)}
        emptyMessage="No subscribers yet."
        actions={(row) => (
          <div className="flex justify-end">
            <ConfirmDialog
              trigger={
                <DialogTrigger asChild>
                  <button aria-label="Remove" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </DialogTrigger>
              }
              title="Remove this subscriber?"
              description="Use this when someone asks to unsubscribe. This can't be undone."
              onConfirm={async () => {
                await deleteSubscriberAction(row.id);
                toast.success("Subscriber removed");
                router.refresh();
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
