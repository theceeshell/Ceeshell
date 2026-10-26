"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { InquiryDetailDialog } from "@/components/admin/inquiries/inquiry-detail-dialog";
import {
  updateInquiryStatusAction,
  deleteInquiryAction,
  type InquiryStatus,
} from "@/lib/actions/inquiry-management-actions";
import { cn } from "@/lib/utils";

export interface InquiryRow {
  id: string;
  name: string;
  company: string;
  phone: string | null;
  email: string;
  budget: string | null;
  timeline: string | null;
  service: string | null;
  industry: string | null;
  message: string;
  attachmentPath: string | null;
  status: string;
  createdAt: string | Date;
}

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  in_progress: "In Progress",
  closed: "Closed",
};

export const STATUS_TONES: Record<string, "blue" | "amber" | "green" | "neutral"> = {
  new: "blue",
  in_progress: "amber",
  closed: "green",
};

const FILTERS: { label: string; value: "all" | InquiryStatus }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "In Progress", value: "in_progress" },
  { label: "Closed", value: "closed" },
];

export function InquiryManager({ inquiries }: { inquiries: InquiryRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"all" | InquiryStatus>("all");
  const [viewing, setViewing] = React.useState<InquiryRow | null>(null);
  const [pending, startTransition] = React.useTransition();

  const filtered = React.useMemo(() => {
    if (filter === "all") return inquiries;
    return inquiries.filter((row) => row.status === filter);
  }, [inquiries, filter]);

  function changeStatus(id: string, status: InquiryStatus) {
    startTransition(async () => {
      await updateInquiryStatusAction(id, status);
      toast.success("Status updated");
      router.refresh();
    });
  }

  const columns: DataTableColumn<InquiryRow>[] = [
    {
      key: "name",
      header: "Name",
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="max-w-[14rem]">
          <p className="font-medium text-text">{row.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted">{row.company}</p>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortValue: (row) => row.email,
      render: (row) => (
        <a href={`mailto:${row.email}`} className="text-sm text-primary hover:underline">
          {row.email}
        </a>
      ),
    },
    {
      key: "service",
      header: "Service / Industry",
      render: (row) =>
        row.service || row.industry ? (
          <div className="text-sm">
            {row.service && <p className="text-text">{row.service}</p>}
            {row.industry && <p className="text-xs text-muted">{row.industry}</p>}
          </div>
        ) : (
          <span className="text-xs text-muted">—</span>
        ),
    },
    {
      key: "budget",
      header: "Budget",
      render: (row) =>
        row.budget ? <span className="text-sm text-text">{row.budget}</span> : <span className="text-xs text-muted">—</span>,
    },
    {
      key: "status",
      header: "Status",
      className: "w-40",
      render: (row) => (
        <StatusBadge label={STATUS_LABELS[row.status] ?? row.status} tone={STATUS_TONES[row.status] ?? "neutral"} />
      ),
    },
    {
      key: "createdAt",
      header: "Submitted",
      sortValue: (row) => new Date(row.createdAt).getTime(),
      render: (row) => <span className="text-sm text-muted">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-muted hover:text-primary"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search name, company, email…"
        searchFn={(row, q) =>
          row.name.toLowerCase().includes(q) || row.company.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)
        }
        emptyMessage="No inquiries found."
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <Select
              value={row.status}
              onValueChange={(value) => changeStatus(row.id, value as InquiryStatus)}
              disabled={pending}
            >
              <SelectTrigger className="h-8 w-[9.5rem] px-3 py-0 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <button
              aria-label="View"
              onClick={() => setViewing(row)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
            >
              <Eye className="h-4 w-4" />
            </button>
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
              title="Delete this inquiry?"
              description="This will permanently remove the submission. This can't be undone."
              onConfirm={async () => {
                await deleteInquiryAction(row.id);
                toast.success("Inquiry deleted");
                router.refresh();
              }}
            />
          </div>
        )}
      />

      <InquiryDetailDialog
        inquiry={viewing}
        open={viewing !== null}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
        onStatusChange={(status) => {
          if (viewing) changeStatus(viewing.id, status);
        }}
      />
    </div>
  );
}
