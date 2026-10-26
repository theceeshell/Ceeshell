"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Download, Loader2, Send, Trash2, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { deleteSubscriberAction, syncSubscribersToBrevoAction } from "@/lib/actions/newsletter-actions";
import { formatDate } from "@/lib/format-date";

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

export function SubscriberManager({
  subscribers,
  brevoConnected,
  canSend,
}: {
  subscribers: SubscriberRow[];
  brevoConnected: boolean;
  canSend: boolean;
}) {
  const router = useRouter();
  const [syncing, setSyncing] = React.useState(false);

  async function sync() {
    setSyncing(true);
    try {
      const result = await syncSubscribersToBrevoAction();
      if ("error" in result) toast.error(result.error);
      else toast.success(`${result.count} subscriber${result.count === 1 ? "" : "s"} sent to Brevo. It may take a minute to show there.`);
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setSyncing(false);
    }
  }

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
      render: (row) => <span className="text-muted">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-muted">
          {brevoConnected ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" /> Connected to Brevo — new subscribers are added automatically.
            </>
          ) : (
            "Newsletter sending isn't connected yet."
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => downloadCsv(subscribers)} disabled={subscribers.length === 0}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          {canSend && brevoConnected && (
            <Button size="sm" variant="secondary" onClick={sync} disabled={syncing || subscribers.length === 0} title="Copy everyone who subscribed before Brevo was connected">
              {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />} Sync to Brevo
            </Button>
          )}
          {canSend && (
            <Button size="sm" asChild>
              <Link href="/admin/subscribers/send">
                <Send className="h-4 w-4" /> Write a newsletter
              </Link>
            </Button>
          )}
        </div>
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
