"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ExternalLink, FileStack, Lock, Plus, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { PageSettingsDialog, type PageSettings } from "@/components/admin/pages/page-settings-dialog";
import { deletePageAction } from "@/lib/actions/page-actions";
import { pagePath } from "@/lib/cms/pages";

export interface PageCard extends PageSettings {
  sectionCount: number;
  enabledCount: number;
}

export function PageList({ pages, canManage }: { pages: PageCard[]; canManage: boolean }) {
  const router = useRouter();
  const [creating, setCreating] = React.useState(false);
  const [editing, setEditing] = React.useState<PageSettings | undefined>();

  return (
    <div>
      {canManage && (
        <div className="mb-6 flex justify-end">
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> New Page
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <div key={page.id} className="flex flex-col justify-between rounded-2xl border border-border bg-white p-6">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <FileStack className="h-5 w-5" />
                </div>
                <div className="flex gap-1">
                  <a
                    href={pagePath(page.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on website"
                    title="View on website"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  {canManage && (
                    <button
                      type="button"
                      aria-label="Page settings"
                      title="Page settings"
                      onClick={() => setEditing(page)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-primary"
                    >
                      <Settings2 className="h-4 w-4" />
                    </button>
                  )}
                  {canManage && !page.system && (
                    <ConfirmDialog
                      trigger={
                        <DialogTrigger asChild>
                          <button aria-label="Delete page" title="Delete page" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </DialogTrigger>
                      }
                      title={`Delete "${page.title}"?`}
                      description="The page and all its sections will be removed, along with any menu link to it. This can't be undone."
                      onConfirm={async () => {
                        const result = await deletePageAction(page.id);
                        if (result?.error) {
                          toast.error(result.error);
                          return;
                        }
                        toast.success("Page deleted");
                        router.refresh();
                      }}
                    />
                  )}
                </div>
              </div>
              <h3 className="mt-4 flex items-center gap-2 font-heading text-xl font-medium text-primary">
                {page.title}
                {page.system && <Lock className="h-3.5 w-3.5 text-muted" aria-label="Main page" />}
              </h3>
              <p className="mt-0.5 font-mono text-xs text-muted">{pagePath(page.slug)}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{page.description}</p>
            </div>
            <Link
              href={`/admin/content/${page.slug}`}
              className="group mt-6 flex items-center justify-between rounded-xl bg-background px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/8"
            >
              Edit content
              <span className="flex items-center gap-2 text-xs font-medium text-muted">
                {page.enabledCount} / {page.sectionCount} sections shown
                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        ))}
      </div>

      <PageSettingsDialog open={creating} onOpenChange={setCreating} />
      <PageSettingsDialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(undefined)} page={editing} />
    </div>
  );
}
