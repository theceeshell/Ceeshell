"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, ImageIcon, Link2, Loader2, Plus, Search, UploadCloud, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { listMediaAction } from "@/lib/actions/media-actions";
import { ACCEPTED_IMAGE_TYPES, isAcceptedImage, uploadImage } from "@/components/admin/media/upload-client";

type MediaItem = Awaited<ReturnType<typeof listMediaAction>>[number];

/* -------------------------------------------------------------------------- */
/* Picker dialog: choose from the Media Library or upload new images           */
/* -------------------------------------------------------------------------- */

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  multiple?: boolean;
  onSelect: (urls: string[]) => void;
}

export function MediaPickerDialog({ open, onOpenChange, multiple = false, onSelect }: MediaPickerDialogProps) {
  const [items, setItems] = React.useState<MediaItem[] | null>(null);
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [wasOpen, setWasOpen] = React.useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setSelected([]);
      setQuery("");
      setItems(null);
      listMediaAction()
        .then(setItems)
        .catch(() => {
          setItems([]);
          toast.error("Couldn't load the Media Library.");
        });
    }
  }

  function choose(urls: string[]) {
    onSelect(urls);
    onOpenChange(false);
  }

  function toggle(url: string) {
    if (!multiple) return choose([url]);
    setSelected((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
  }

  async function handleFiles(list: FileList | File[]) {
    const files = Array.from(list);
    const rejected = files.filter((f) => !isAcceptedImage(f));
    if (rejected.length) toast.error(`Skipped (not a JPEG/PNG/WebP/GIF/AVIF image under 10 MB): ${rejected.map((f) => f.name).join(", ")}`);
    const accepted = files.filter(isAcceptedImage).slice(0, multiple ? undefined : 1);
    if (!accepted.length) return;

    setUploading(true);
    const urls: string[] = [];
    for (const file of accepted) {
      const result = await uploadImage(file);
      if ("error" in result) toast.error(result.error);
      else urls.push(result.url);
    }
    setUploading(false);
    if (urls.length) {
      toast.success(urls.length === 1 ? "Image uploaded" : `${urls.length} images uploaded`);
      choose(urls);
    }
  }

  const filtered = (items ?? []).filter((m) => {
    const q = query.trim().toLowerCase();
    return !q || m.filename.toLowerCase().includes(q) || m.alt.toLowerCase().includes(q) || m.folder.includes(q);
  });

  return (
    <Dialog open={open} onOpenChange={(next) => !uploading && onOpenChange(next)}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>{multiple ? "Choose images" : "Choose an image"}</DialogTitle>
          <DialogDescription>Upload a new image, or pick one you&apos;ve uploaded before.</DialogDescription>
        </DialogHeader>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-6 text-sm transition-colors",
            dragging ? "border-secondary bg-secondary/5" : "border-border bg-background hover:border-secondary"
          )}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin text-muted" /> : <UploadCloud className="h-5 w-5 text-muted" />}
          <span>
            <span className="font-semibold text-primary">{uploading ? "Uploading…" : "Upload from your computer"}</span>
            {!uploading && <span className="text-muted"> — or drag and drop. JPEG, PNG, WebP, GIF, AVIF up to 10 MB.</span>}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            multiple={multiple}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your Media Library…" className="pl-10" />
        </div>

        <div className="max-h-[45vh] overflow-y-auto">
          {items === null ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">
              {items.length === 0 ? "Your Media Library is empty — upload an image above." : "No images match your search."}
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {filtered.map((item) => {
                const isSelected = selected.includes(item.url);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item.url)}
                      title={item.filename}
                      className={cn(
                        "group relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-background",
                        isSelected ? "border-secondary" : "border-transparent hover:border-secondary/50"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
                      <img src={item.url} alt={item.alt || item.filename} className="h-full w-full object-cover" loading="lazy" />
                      {isSelected && (
                        <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-white">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {multiple && (
          <DialogFooter>
            <Button variant="secondary" size="sm" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" type="button" disabled={selected.length === 0} onClick={() => choose(selected)}>
              Add {selected.length > 0 ? `${selected.length} image${selected.length === 1 ? "" : "s"}` : "images"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Single image field                                                          */
/* -------------------------------------------------------------------------- */

interface ImageFieldProps {
  label: string;
  value: string | null | undefined;
  onChange: (url: string) => void;
  hint?: string;
  error?: string;
  /** Optional fields get a "Remove" button. */
  optional?: boolean;
  /** Preview shape: wide for banners/covers, square for logos/photos. */
  aspect?: "wide" | "square";
}

export function ImageField({ label, value, onChange, hint, error, optional = false, aspect = "wide" }: ImageFieldProps) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [showLink, setShowLink] = React.useState(false);
  const id = React.useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background text-muted transition-colors hover:border-secondary",
            aspect === "square" ? "h-28 w-28" : "aspect-video w-full sm:w-56"
          )}
          aria-label={value ? `Change ${label}` : `Choose ${label}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1.5 text-xs">
              <ImageIcon className="h-6 w-6" />
              No image
            </span>
          )}
        </button>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => setPickerOpen(true)}>
            <ImageIcon className="h-4 w-4" /> {value ? "Change image" : "Choose image"}
          </Button>
          {optional && value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>
              <X className="h-4 w-4" /> Remove
            </Button>
          )}
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowLink((v) => !v)}>
            <Link2 className="h-4 w-4" /> {showLink ? "Hide link" : "Use a link"}
          </Button>
        </div>
      </div>
      {showLink && (
        <Input id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value.trim())} placeholder="https://…" />
      )}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <MediaPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} onSelect={([url]) => onChange(url)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Gallery (ordered list of images)                                            */
/* -------------------------------------------------------------------------- */

interface GalleryFieldProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  hint?: string;
  error?: string;
}

export function GalleryField({ label, values, onChange, hint, error }: GalleryFieldProps) {
  const [pickerOpen, setPickerOpen] = React.useState(false);

  function move(index: number, delta: number) {
    const next = [...values];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {values.map((url, index) => (
          <li key={`${url}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
              <div className="flex gap-1">
                <IconButton label="Move left" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton label="Move right" disabled={index === values.length - 1} onClick={() => move(index, 1)}>
                  <ArrowRight className="h-3.5 w-3.5" />
                </IconButton>
              </div>
              <IconButton label="Remove image" onClick={() => onChange(values.filter((_, i) => i !== index))}>
                <X className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border text-xs font-semibold text-muted transition-colors hover:border-secondary hover:text-primary"
          >
            <Plus className="h-5 w-5" /> Add images
          </button>
        </li>
      </ul>
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <MediaPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} multiple onSelect={(urls) => onChange([...values, ...urls])} />
    </div>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm hover:bg-white disabled:opacity-30"
    >
      {children}
    </button>
  );
}
