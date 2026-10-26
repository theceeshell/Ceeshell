"use client";

import * as React from "react";
import { toast } from "sonner";
import { UploadCloud, X, Loader2, FileImage } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createMediaUploadAction, finalizeMediaUploadAction } from "@/lib/actions/media-actions";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 10 * 1024 * 1024;

/** Uploads one file straight to Storage via a signed URL, then registers it. Returns an error message or null. */
async function uploadOne(file: File, folder: string): Promise<string | null> {
  const ticket = await createMediaUploadAction({ filename: file.name, size: file.size, type: file.type, folder });
  if ("error" in ticket) return ticket.error;

  const res = await fetch(ticket.uploadUrl, {
    method: "PUT",
    headers: { "content-type": file.type, "x-upsert": "false" },
    body: file,
  });
  if (!res.ok) return `${file.name}: upload failed (${res.status})`;

  const result = await finalizeMediaUploadAction({ path: ticket.path, filename: file.name });
  return result?.error ?? null;
}

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: () => void;
}

export function UploadDialog({ open, onOpenChange, onUploaded }: UploadDialogProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [folder, setFolder] = React.useState("general");
  const [dragging, setDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function reset() {
    setFiles([]);
    setFolder("general");
    setDragging(false);
  }

  function handleOpenChange(next: boolean) {
    if (!uploading) {
      onOpenChange(next);
      if (!next) reset();
    }
  }

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list);
    const accepted: File[] = [];
    const rejected: string[] = [];
    for (const file of incoming) {
      if (ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_BYTES) {
        accepted.push(file);
      } else {
        rejected.push(file.name);
      }
    }
    if (rejected.length > 0) {
      toast.error(`Skipped (not a JPEG/PNG/WebP/GIF/AVIF image under 10 MB): ${rejected.join(", ")}`);
    }
    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted]);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const failed: File[] = [];
      for (const file of files) {
        const error = await uploadOne(file, folder.trim() || "general");
        if (error) {
          failed.push(file);
          toast.error(error);
        }
      }
      const uploaded = files.length - failed.length;
      if (uploaded > 0) {
        toast.success(`${uploaded} file${uploaded === 1 ? "" : "s"} uploaded`);
        onUploaded();
      }
      if (failed.length === 0) {
        reset();
        onOpenChange(false);
      } else {
        // Keep only what failed so a retry doesn't re-upload the rest.
        setFiles(failed);
      }
    } catch {
      toast.error("Upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Upload media</DialogTitle>
          <DialogDescription>Add images to the library. They can be reused anywhere on the site.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="upload-folder">Folder</Label>
            <Input
              id="upload-folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="general"
              className="mt-1.5"
            />
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragging ? "border-secondary bg-secondary/5" : "border-border bg-background"
            }`}
          >
            <UploadCloud className="h-8 w-8 text-muted" />
            <p className="text-sm text-text">
              <span className="font-semibold text-primary">Click to browse</span> or drag and drop images here
            </p>
            <p className="text-xs text-muted">JPEG, PNG, WebP, GIF or AVIF · up to 10 MB each</p>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {files.length > 0 && (
            <ul className="max-h-40 space-y-1.5 overflow-y-auto rounded-xl border border-border p-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-lg bg-background px-3 py-2 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <FileImage className="h-4 w-4 shrink-0 text-muted" />
                    <span className="truncate text-text">{file.name}</span>
                  </span>
                  <button
                    type="button"
                    aria-label="Remove file"
                    onClick={() => removeFile(index)}
                    className="shrink-0 rounded-full p-1 text-muted hover:bg-white hover:text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" size="sm" type="button" onClick={() => handleOpenChange(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="button" onClick={handleUpload} disabled={uploading || files.length === 0}>
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            Upload {files.length > 0 ? `(${files.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
