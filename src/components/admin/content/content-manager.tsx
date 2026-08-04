"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { SECTION_TYPES } from "@/lib/cms/section-types";
import type { ReferenceOptions } from "@/lib/cms/reference-options";
import { SectionFormDialog, type SectionRow } from "@/components/admin/content/section-form-dialog";
import {
  toggleSectionEnabledAction,
  reorderSectionsAction,
  deleteSectionAction,
  duplicateSectionAction,
} from "@/lib/actions/section-actions";

const TYPE_LABELS = Object.fromEntries(SECTION_TYPES.map((t) => [t.type, t.label]));

export function ContentManager({
  pageSlug,
  pageTitle,
  sections,
  referenceOptions,
}: {
  pageSlug: string;
  pageTitle: string;
  sections: SectionRow[];
  referenceOptions: ReferenceOptions;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SectionRow | null>(null);
  const [enabledMap, setEnabledMap] = React.useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.id, s.enabled]))
  );
  const [pending, startTransition] = React.useTransition();

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(row: SectionRow) {
    setEditing(row);
    setDialogOpen(true);
  }

  function move(row: SectionRow, direction: -1 | 1) {
    const index = sections.findIndex((s) => s.id === row.id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= sections.length) return;
    const next = [...sections];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    startTransition(async () => {
      await reorderSectionsAction(pageSlug, next.map((s) => s.id));
      router.refresh();
    });
  }

  function toggleEnabled(id: string, checked: boolean) {
    setEnabledMap((prev) => ({ ...prev, [id]: checked }));
    startTransition(async () => {
      await toggleSectionEnabledAction(id, checked);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted">
          {sections.length} section{sections.length === 1 ? "" : "s"} on <strong className="text-text">{pageTitle}</strong>
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Section
        </Button>
      </div>

      <div className="space-y-3">
        {sections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center text-muted">
            No sections yet — add your first one.
          </div>
        )}

        {sections.map((section, i) => (
          <div key={section.id} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-1">
              <button
                aria-label="Move up"
                disabled={pending || i === 0}
                onClick={() => move(section, -1)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:text-primary disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Move down"
                disabled={pending || i === sections.length - 1}
                onClick={() => move(section, 1)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:text-primary disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-text">{section.name}</p>
                <span className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {TYPE_LABELS[section.type] ?? section.type}
                </span>
              </div>
            </div>

            <Switch checked={enabledMap[section.id] ?? true} onCheckedChange={(v) => toggleEnabled(section.id, v)} />

            <div className="flex items-center gap-1">
              <button
                aria-label="Edit"
                onClick={() => openEdit(section)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                aria-label="Duplicate"
                onClick={() =>
                  startTransition(async () => {
                    await duplicateSectionAction(section.id);
                    toast.success("Section duplicated");
                    router.refresh();
                  })
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
              >
                <Copy className="h-4 w-4" />
              </button>
              <ConfirmDialog
                trigger={
                  <DialogTrigger asChild>
                    <button aria-label="Delete" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </DialogTrigger>
                }
                title="Delete this section?"
                description="It will be removed from the live page immediately. This can't be undone."
                onConfirm={async () => {
                  await deleteSectionAction(section.id);
                  toast.success("Section deleted");
                  router.refresh();
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <SectionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pageSlug={pageSlug}
        editing={editing}
        referenceOptions={referenceOptions}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
