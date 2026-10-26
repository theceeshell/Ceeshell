"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { SECTION_TYPES, type SectionType } from "@/lib/cms/section-types";
import type { ReferenceOptions } from "@/lib/cms/reference-options";
import { SectionEditForm } from "@/components/admin/content/section-edit-form";
import { createSectionAction, updateSectionAction } from "@/lib/actions/section-actions";

export interface SectionRow {
  id: string;
  type: string;
  name: string;
  content: unknown;
  enabled: boolean;
}

interface SectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageSlug: string;
  editing: SectionRow | null;
  referenceOptions: ReferenceOptions;
  onSaved: () => void;
}

export function SectionFormDialog({ open, onOpenChange, pageSlug, editing, referenceOptions, onSaved }: SectionFormDialogProps) {
  const [pickedType, setPickedType] = React.useState<SectionType | null>(null);
  const [name, setName] = React.useState("");

  // Reset the form each time the dialog opens (adjusting state during render,
  // rather than in an effect, avoids an extra render pass).
  const [wasOpen, setWasOpen] = React.useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setPickedType(editing ? (editing.type as SectionType) : null);
      setName(editing?.name ?? "");
    }
  }

  const isEditing = Boolean(editing);

  async function handleSubmit(content: Record<string, unknown>) {
    if (!name.trim()) {
      toast.error("Give this section a name (only shown here in the admin panel).");
      throw new Error("Name required");
    }
    if (isEditing && editing) {
      await updateSectionAction(editing.id, name.trim(), content);
      toast.success("Section updated");
    } else if (pickedType) {
      await createSectionAction(pageSlug, pickedType, name.trim(), content);
      toast.success("Section added");
    }
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Section" : pickedType ? "New Section" : "Choose a Section Type"}</DialogTitle>
          <DialogDescription>
            {isEditing || pickedType
              ? "Fill in the content for this section — it appears on the live page in this position."
              : "Pick the kind of block you'd like to add to this page."}
          </DialogDescription>
        </DialogHeader>

        {!isEditing && !pickedType && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SECTION_TYPES.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => {
                  setPickedType(t.type);
                  setName(t.label);
                }}
                className="rounded-xl border border-border p-4 text-left transition-colors hover:border-secondary hover:bg-background"
              >
                <p className="font-semibold text-primary">{t.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{t.description}</p>
              </button>
            ))}
          </div>
        )}

        {(isEditing || pickedType) && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="section-name">Section Name</Label>
              <Input id="section-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hero, Featured Projects" />
              <p className="text-xs text-muted">Only used inside the admin panel to identify this section — not shown on the site.</p>
            </div>

            <SectionEditForm
              type={(isEditing ? editing!.type : pickedType) as SectionType}
              initialContent={isEditing ? (editing!.content as Record<string, unknown>) : undefined}
              referenceOptions={referenceOptions}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              submitLabel={isEditing ? "Save Changes" : "Add Section"}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
