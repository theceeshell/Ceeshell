"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import type { ActionResult } from "@/lib/actions/helpers";
import { detectFileType } from "@/lib/file-type";
import {
  MEDIA_BUCKET,
  createSignedUploadUrl,
  deleteObject,
  getObjectInfo,
  publicObjectUrl,
} from "@/lib/storage";

/** Must match the "media" bucket's allowed_mime_types / file_size_limit (see the storage migration). */
const MEDIA_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

const folderSchema = z
  .string()
  .trim()
  .transform((value) => value.toLowerCase().replace(/[^a-z0-9-_]/g, "") || "general")
  .pipe(z.string().max(40));

const uploadRequestSchema = z.object({
  filename: z.string().trim().min(1).max(200),
  size: z.number().int().positive(),
  type: z.string(),
  folder: folderSchema,
});

/**
 * Step 1 of an upload: validates the file's declared metadata and returns a
 * signed URL the browser PUTs the file to directly. Files never pass through
 * a Vercel function, so they aren't capped by its 4.5MB request body limit.
 */
export async function createMediaUploadAction(
  input: z.input<typeof uploadRequestSchema>
): Promise<{ error: string } | { uploadUrl: string; path: string }> {
  await requireSession();
  const { size, type, folder } = uploadRequestSchema.parse(input);

  const ext = MEDIA_TYPES[type];
  if (!ext) return { error: "Only JPEG, PNG, WebP, GIF and AVIF images can be uploaded." };
  if (size > MAX_MEDIA_BYTES) return { error: "Images must be 10 MB or smaller." };

  const path = `${folder}/${nanoid(12)}.${ext}`;
  return { uploadUrl: await createSignedUploadUrl(MEDIA_BUCKET, path), path };
}

const finalizeSchema = z.object({
  path: z.string().regex(/^[a-z0-9-_]{1,40}\/[A-Za-z0-9_-]{12}\.(jpg|png|webp|gif|avif)$/),
  filename: z.string().trim().min(1).max(200),
});

/** Step 2: verifies what actually landed in Storage, then records it in the library. */
export async function finalizeMediaUploadAction(input: z.input<typeof finalizeSchema>): Promise<ActionResult> {
  await requireSession();
  const { path, filename } = finalizeSchema.parse(input);

  const info = await getObjectInfo(MEDIA_BUCKET, path);
  if (!info) return { error: "Upload didn't complete. Please try again." };

  // Check the real bytes, not just the declared Content-Type.
  const url = publicObjectUrl(MEDIA_BUCKET, path);
  const head = await fetch(url, { headers: { Range: "bytes=0-31" }, cache: "no-store" });
  const detected = detectFileType(new Uint8Array(await head.arrayBuffer()));
  if (!detected || !MEDIA_TYPES[detected.mime]) {
    await deleteObject(MEDIA_BUCKET, path);
    return { error: `${filename} isn't a valid image.` };
  }

  await prisma.media.create({
    data: {
      filename,
      url,
      storagePath: path,
      mimeType: detected.mime,
      size: info.size,
      folder: path.split("/")[0],
      alt: "",
    },
  });
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(id: string) {
  await requireSession();

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Media not found");

  if (media.storagePath) {
    await deleteObject(MEDIA_BUCKET, media.storagePath);
  }
  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}

export async function updateMediaAltAction(id: string, alt: string) {
  await requireSession();
  await prisma.media.update({ where: { id }, data: { alt: z.string().trim().max(300).parse(alt) } });
  revalidatePath("/admin/media");
}
