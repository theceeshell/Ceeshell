import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

export interface SavedUpload {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

/**
 * Saves an uploaded File to public/uploads/<folder>/ and returns the
 * publicly-servable URL. Used by both the Media Library and any ad-hoc
 * upload field (e.g. the contact form's reference-file attachment).
 */
export async function saveUpload(file: File, folder = "general"): Promise<SavedUpload> {
  const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "general";
  const dir = path.join(UPLOADS_ROOT, safeFolder);
  await mkdir(dir, { recursive: true });

  const ext = path.extname(file.name) || "";
  const filename = `${nanoid(10)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return {
    filename: file.name,
    url: `/uploads/${safeFolder}/${filename}`,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
  };
}

export function isImageType(mimeType: string) {
  return ALLOWED_TYPES.has(mimeType);
}
