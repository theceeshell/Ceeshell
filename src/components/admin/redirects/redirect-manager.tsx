"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Info, Loader2, Plus, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { FormField } from "@/components/admin/ui/form-field";
import { LinkPicker } from "@/components/admin/ui/link-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@/components/ui/dialog";
import { formatDate } from "@/lib/format-date";
import type { LinkOption } from "@/lib/cms/link-options";
import { createRedirectAction, deleteRedirectAction } from "@/lib/actions/redirect-actions";

export interface RedirectRow {
  id: string;
  from: string;
  to: string;
  createdAt: Date;
}

export function RedirectManager({ redirects, linkOptions }: { redirects: RedirectRow[]; linkOptions: LinkOption[] }) {
  const router = useRouter();
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await createRedirectAction({ from, to });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Redirect added");
      setFrom("");
      setTo("");
      router.refresh();
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setSaving(false);
    }
  }

  const columns: DataTableColumn<RedirectRow>[] = [
    {
      key: "from",
      header: "Old address",
      sortValue: (row) => row.from,
      render: (row) => <span className="font-mono text-xs text-text">{row.from}</span>,
    },
    {
      key: "to",
      header: "Goes to",
      render: (row) => (
        <span className="flex items-center gap-2 font-mono text-xs text-text">
          <ArrowRight className="h-3.5 w-3.5 text-muted" /> {row.to}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Added",
      sortValue: (row) => new Date(row.createdAt).getTime(),
      render: (row) => <span className="text-muted">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <p className="flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Redirects are added automatically when you change the web address of a page, service, project, industry or
        blog post. Add one yourself only to keep an old link working, for example from a previous website.
      </p>

      <form
        onSubmit={add}
        className="grid grid-cols-1 items-start gap-4 rounded-2xl border border-border bg-white p-6 lg:grid-cols-[1fr_1fr_auto]"
      >
        <FormField label="Old address" htmlFor="redirect-from" hint="For example /old-services">
          <Input id="redirect-from" required value={from} onChange={(e) => setFrom(e.target.value)} placeholder="/old-page" className="h-11" />
        </FormField>
        <FormField label="Send visitors to" htmlFor="redirect-to">
          <LinkPicker id="redirect-to" value={to} onChange={setTo} options={linkOptions} />
        </FormField>
        <Button type="submit" size="sm" disabled={saving || !from || !to} className="lg:mt-7">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add redirect
        </Button>
      </form>

      <DataTable
        data={redirects}
        columns={columns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search addresses…"
        searchFn={(row, q) => row.from.includes(q) || row.to.includes(q)}
        emptyMessage="No redirects yet."
        actions={(row) => (
          <div className="flex justify-end">
            <ConfirmDialog
              trigger={
                <DialogTrigger asChild>
                  <button aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </DialogTrigger>
              }
              title="Delete this redirect?"
              description="Visitors using the old address will see the “page not found” page."
              onConfirm={async () => {
                await deleteRedirectAction(row.id);
                toast.success("Redirect deleted");
                router.refresh();
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
