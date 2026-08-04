"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Trash2, Plus, Search, ImageOff, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { UploadDialog } from "@/components/admin/media/upload-dialog";
import { deleteMediaAction, updateMediaAltAction } from "@/lib/actions/media-actions";

export interface MediaRow {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  folder: string;
  alt: string;
  createdAt: Date;
}

function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

async function copyUrl(url: string) {
  await navigator.clipboard.writeText(url);
  toast.success("URL copied");
}

export function MediaLibrary({ media, folders }: { media: MediaRow[]; folders: string[] }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [folderFilter, setFolderFilter] = React.useState("all");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<MediaRow | null>(null);

  const filtered = React.useMemo(() => {
    return media.filter((item) => {
      if (folderFilter !== "all" && item.folder !== folderFilter) return false;
      if (query.trim() !== "" && !item.filename.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [media, query, folderFilter]);

  function handleUploaded() {
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search filenames…"
              className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>
          <Select value={folderFilter} onValueChange={setFolderFilter}>
            <SelectTrigger className="h-10 w-full sm:w-44">
              <SelectValue placeholder="All folders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All folders</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder} value={folder}>
                  {folder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Plus className="h-4 w-4" /> Upload
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-white py-20 text-center">
          <ImageOff className="h-8 w-8 text-muted" />
          <p className="text-sm text-muted">No media yet — upload your first image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-white"
              onClick={() => setPreview(item)}
            >
              <div className="aspect-square w-full overflow-hidden bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.alt || item.filename} className="aspect-square h-full w-full object-cover" />
              </div>

              <div className="absolute inset-0 flex flex-col items-end justify-start gap-1.5 bg-black/0 p-2 opacity-0 transition-all duration-200 group-hover:bg-black/35 group-hover:opacity-100">
                <button
                  type="button"
                  aria-label="Copy URL"
                  onClick={(e) => {
                    e.stopPropagation();
                    void copyUrl(item.url);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary shadow-soft hover:bg-white"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <ConfirmDialog
                  trigger={
                    <DialogTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                      <button
                        type="button"
                        aria-label="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-soft hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </DialogTrigger>
                  }
                  title="Delete this file?"
                  description="This will permanently remove the file from disk and the media library. This can't be undone."
                  onConfirm={async () => {
                    await deleteMediaAction(item.id);
                    toast.success("File deleted");
                    router.refresh();
                  }}
                />
              </div>

              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-text" title={item.filename}>
                  {item.filename}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">{formatBytes(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onUploaded={handleUploaded} />

      <MediaPreviewDialog
        key={preview?.id ?? "none"}
        item={preview}
        onOpenChange={(open) => !open && setPreview(null)}
      />
    </div>
  );
}

function MediaPreviewDialog({ item, onOpenChange }: { item: MediaRow | null; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [alt, setAlt] = React.useState(item?.alt ?? "");
  const [saving, setSaving] = React.useState(false);

  async function saveAlt() {
    if (!item || alt === item.alt) return;
    setSaving(true);
    try {
      await updateMediaAltAction(item.id, alt);
      toast.success("Alt text saved");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save alt text");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={item !== null} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        {item && (
          <>
            <DialogHeader>
              <DialogTitle className="truncate">{item.filename}</DialogTitle>
            </DialogHeader>

            <div className="overflow-hidden rounded-xl bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt || item.filename} className="max-h-[50vh] w-full object-contain" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Size</p>
                <p className="mt-0.5 text-text">{formatBytes(item.size)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Folder</p>
                <p className="mt-0.5 text-text">{item.folder}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Uploaded</p>
                <p className="mt-0.5 text-text">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Type</p>
                <p className="mt-0.5 text-text">{item.mimeType}</p>
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="media-alt">Alt text</Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  id="media-alt"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  onBlur={saveAlt}
                  placeholder="Describe this image…"
                />
                <Button variant="secondary" size="sm" type="button" onClick={saveAlt} disabled={saving || alt === item.alt}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button variant="secondary" size="sm" type="button" onClick={() => void copyUrl(item.url)}>
                <Copy className="h-4 w-4" /> Copy URL
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
