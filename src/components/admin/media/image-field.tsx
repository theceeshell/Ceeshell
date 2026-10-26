"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Film, ImageIcon, Link2, Loader2, Plus, Search, UploadCloud, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isVideoUrl, videoPosterUrl } from "@/lib/media";
import { listMediaAction } from "@/lib/actions/media-actions";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  isAcceptedImage,
  isAcceptedVideo,
  uploadMedia,
} from "@/components/admin/media/upload-client";

type MediaItem = Awaited<ReturnType<typeof listMediaAction>>["items"][number];

/** Small preview of an image or video URL (videos show their poster frame, or the first frame). */
export function MediaThumb({ url, alt = "", className }: { url: string; alt?: string; className?: string }) {
  if (isVideoUrl(url)) {
    const poster = videoPosterUrl(url, 480);
    return (
      <span className={cn("relative block h-full w-full", className)}>
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview
          <img src={poster} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <video src={`${url}#t=0.1`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
        )}
        <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
          <Film className="h-3 w-3" /> Video
        </span>
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs
  return <img src={url} alt={alt} className={cn("h-full w-full object-cover", className)} loading="lazy" />;
}

/* -------------------------------------------------------------------------- */
/* Picker dialog: choose from the Media Library or upload new files            */
/* -------------------------------------------------------------------------- */

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  multiple?: boolean;
  /** Also list and accept videos. */
  allowVideo?: boolean;
  onSelect: (urls: string[]) => void;
}

export function MediaPickerDialog({ open, onOpenChange, multiple = false, allowVideo = false, onSelect }: MediaPickerDialogProps) {
  const [items, setItems] = React.useState<MediaItem[] | null>(null);
  const [canUploadVideo, setCanUploadVideo] = React.useState(false);
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
      listMediaAction({ includeVideos: allowVideo })
        .then((result) => {
          setItems(result.items);
          setCanUploadVideo(result.canUploadVideo);
        })
        .catch(() => {
          setItems([]);
          toast.error("Couldn't load the Media Library.");
        });
    }
  }

  const videosOk = allowVideo && canUploadVideo;
  const accepts = (file: File) => isAcceptedImage(file) || (videosOk && isAcceptedVideo(file));

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
    const rejected = files.filter((f) => !accepts(f));
    if (rejected.length) {
      toast.error(
        `Skipped (${videosOk ? "not an image under 10 MB or an MP4/WebM/MOV video under 100 MB" : "not a JPEG/PNG/WebP/GIF/AVIF image under 10 MB"}): ${rejected.map((f) => f.name).join(", ")}`
      );
    }
    const accepted = files.filter(accepts).slice(0, multiple ? undefined : 1);
    if (!accepted.length) return;

    setUploading(true);
    const urls: string[] = [];
    for (const file of accepted) {
      const result = await uploadMedia(file);
      if ("error" in result) toast.error(result.error);
      else urls.push(result.url);
    }
    setUploading(false);
    if (urls.length) {
      toast.success(urls.length === 1 ? "Uploaded" : `${urls.length} files uploaded`);
      choose(urls);
    }
  }

  const filtered = (items ?? []).filter((m) => {
    const q = query.trim().toLowerCase();
    return !q || m.filename.toLowerCase().includes(q) || m.alt.toLowerCase().includes(q) || m.folder.includes(q);
  });
  const noun = allowVideo ? "photos and videos" : "images";

  return (
    <Dialog open={open} onOpenChange={(next) => !uploading && onOpenChange(next)}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>{multiple ? `Choose ${noun}` : allowVideo ? "Choose a photo or video" : "Choose an image"}</DialogTitle>
          <DialogDescription>Upload something new, or pick something you&apos;ve uploaded before.</DialogDescription>
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
            <span className="font-semibold text-primary">{uploading ? "Uploading… (videos can take a minute)" : "Upload from your computer"}</span>
            {!uploading && (
              <span className="text-muted">
                {" "}
                — or drag and drop. Images up to 10 MB{videosOk ? ", MP4/WebM/MOV videos up to 100 MB" : ""}.
              </span>
            )}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={[...ACCEPTED_IMAGE_TYPES, ...(videosOk ? ACCEPTED_VIDEO_TYPES : [])].join(",")}
            multiple={multiple}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {allowVideo && !canUploadVideo && items !== null && (
          <p className="-mt-2 text-xs text-muted">
            To use a video, close this and choose &ldquo;Use a link&rdquo; to paste its Cloudinary link.
          </p>
        )}

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
              {items.length === 0 ? "Your Media Library is empty — upload something above." : "Nothing matches your search."}
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
                      <MediaThumb url={item.url} alt={item.alt || item.filename} />
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
              Add {selected.length > 0 ? `${selected.length} item${selected.length === 1 ? "" : "s"}` : noun}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

const VIDEO_HINT = "Videos: paste a Cloudinary video link or upload one. Keep background videos short (under 15 seconds) — they play muted on repeat.";

/* -------------------------------------------------------------------------- */
/* Single image (or image-or-video) field                                      */
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
  /** Accept a video as well as a photo (hero backgrounds, service media). */
  allowVideo?: boolean;
}

export function ImageField({ label, value, onChange, hint, error, optional = false, aspect = "wide", allowVideo = false }: ImageFieldProps) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [showLink, setShowLink] = React.useState(false);
  const id = React.useId();
  const what = allowVideo ? "photo or video" : "image";

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
            <MediaThumb url={value} />
          ) : (
            <span className="flex flex-col items-center gap-1.5 text-xs">
              {allowVideo ? <Film className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
              Nothing chosen
            </span>
          )}
        </button>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => setPickerOpen(true)}>
            <ImageIcon className="h-4 w-4" /> {value ? `Change ${what}` : `Choose ${what}`}
          </Button>
          {optional && value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>
              <X className="h-4 w-4" /> Remove
            </Button>
          )}
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowLink((v) => !v)}>
            <Link2 className="h-4 w-4" /> {showLink ? "Hide link" : allowVideo ? "Use a link (e.g. Cloudinary video)" : "Use a link"}
          </Button>
        </div>
      </div>
      {showLink && (
        <Input
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder={allowVideo ? "https://res.cloudinary.com/…/video/upload/….mp4" : "https://…"}
        />
      )}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {allowVideo && !error && <p className="text-xs text-muted">{VIDEO_HINT}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <MediaPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} allowVideo={allowVideo} onSelect={([url]) => onChange(url)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Gallery (ordered list of images, optionally videos)                         */
/* -------------------------------------------------------------------------- */

interface GalleryFieldProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  hint?: string;
  error?: string;
  allowVideo?: boolean;
}

export function GalleryField({ label, values, onChange, hint, error, allowVideo = false }: GalleryFieldProps) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [linkDraft, setLinkDraft] = React.useState<string | null>(null);

  function move(index: number, delta: number) {
    const next = [...values];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  }

  function addLink() {
    const url = linkDraft?.trim() ?? "";
    if (!/^https:\/\//i.test(url)) {
      toast.error("Paste a full link starting with https://");
      return;
    }
    onChange([...values, url]);
    setLinkDraft(null);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {values.map((url, index) => (
          <li key={`${url}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-background">
            <MediaThumb url={url} />
            <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
              <div className="flex gap-1">
                <IconButton label="Move left" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton label="Move right" disabled={index === values.length - 1} onClick={() => move(index, 1)}>
                  <ArrowRight className="h-3.5 w-3.5" />
                </IconButton>
              </div>
              <IconButton label="Remove" onClick={() => onChange(values.filter((_, i) => i !== index))}>
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
            <Plus className="h-5 w-5" /> {allowVideo ? "Add photos or videos" : "Add images"}
          </button>
        </li>
      </ul>
      {allowVideo &&
        (linkDraft === null ? (
          <Button type="button" size="sm" variant="ghost" onClick={() => setLinkDraft("")}>
            <Link2 className="h-4 w-4" /> Add a video link (e.g. from Cloudinary)
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              autoFocus
              value={linkDraft}
              onChange={(e) => setLinkDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              placeholder="https://res.cloudinary.com/…/video/upload/….mp4"
              className="h-11"
            />
            <Button type="button" size="sm" onClick={addLink}>
              Add
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setLinkDraft(null)}>
              Cancel
            </Button>
          </div>
        ))}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        multiple
        allowVideo={allowVideo}
        onSelect={(urls) => onChange([...values, ...urls])}
      />
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
