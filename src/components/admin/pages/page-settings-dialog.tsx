"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/admin/ui/form-field";
import { slugify } from "@/lib/slug";
import { createPageAction, updatePageAction } from "@/lib/actions/page-actions";

export interface PageSettings {
  id: string;
  title: string;
  description: string;
  slug: string;
  system: boolean;
}

interface PageSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit to create a new page. */
  page?: PageSettings;
}

export function PageSettingsDialog({ open, onOpenChange, page }: PageSettingsDialogProps) {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [addToMenu, setAddToMenu] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [wasOpen, setWasOpen] = React.useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTitle(page?.title ?? "");
      setDescription(page?.description ?? "");
      setSlug(page?.slug ?? "");
      setSlugTouched(Boolean(page));
      setAddToMenu(true);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const values = { title, description, slug };
      const result = page ? await updatePageAction(page.id, values) : await createPageAction({ ...values, addToMenu });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(page ? "Page settings saved" : "Page created — now add some sections to it");
      onOpenChange(false);
      if (page) router.refresh();
      else router.push(`/admin/content/${slug}`);
    } catch {
      toast.error("Something went wrong — please check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{page ? "Page settings" : "New page"}</DialogTitle>
          <DialogDescription>
            {page ? "The page name, web address and the text shown in Google results." : "Create a page, then add sections to it."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={save} className="space-y-5">
          <FormField label="Page title" htmlFor="page-title" hint="Shown in the browser tab, in Google and in breadcrumbs.">
            <Input
              id="page-title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="Our Story"
            />
          </FormField>

          <FormField
            label="Web address"
            htmlFor="page-slug"
            hint={page?.system ? "This is a main page, so its address can't change." : `The page will be at /${slug || "your-address"}`}
          >
            <Input
              id="page-slug"
              required
              value={slug}
              disabled={page?.system}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase());
              }}
            />
          </FormField>

          <FormField label="Description for Google" htmlFor="page-description" hint="One or two sentences that appear under the page title in search results.">
            <Textarea id="page-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>

          {!page && (
            <label className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5">
              <span>
                <span className="block text-sm font-semibold text-primary">Add to the main menu</span>
                <span className="block text-xs text-muted">You can rename or reorder it later in Navigation.</span>
              </span>
              <Switch checked={addToMenu} onCheckedChange={setAddToMenu} />
            </label>
          )}

          <DialogFooter>
            <Button type="button" variant="secondary" size="sm" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {page ? "Save" : "Create page"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
