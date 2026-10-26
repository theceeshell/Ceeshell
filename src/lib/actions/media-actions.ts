"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { detectFileType } from "@/lib/file-type";
import {
  CLOUDINARY_ROOT_FOLDER,
  cloudinaryConfig,
  createSignedUpload,
  destroyResource,
  getResource,
  type CloudinaryResourceType,
} from "@/lib/cloudinary";
import {
  MEDIA_BUCKET,
  createSignedUploadUrl,
  deleteObject,
  getObjectInfo,
  publicObjectUrl,
} from "@/lib/storage";

/**
 * Media Library uploads go to Cloudinary when it's configured (images and
 * videos, optimized delivery), otherwise to Supabase Storage (images only).
 * Either way the browser uploads directly, never through a Vercel function.
 */

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
/** Cloudinary free plan limits; Supabase's "media" bucket also caps images at 10MB. */
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

/** Storage path prefix marking a Cloudinary asset: "cloudinary:<image|video>:<public_id>". */
const CLOUDINARY_PREFIX = "cloudinary:";

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

export type MediaUploadTicket =
  | { error: string }
  | { provider: "supabase"; uploadUrl: string; path: string }
  | { provider: "cloudinary"; uploadUrl: string; fields: Record<string, string | number> };

/** Step 1: validates the file's declared metadata and returns where the browser should upload it. */
export async function createMediaUploadAction(input: z.input<typeof uploadRequestSchema>): Promise<MediaUploadTicket> {
  await requireSession();
  const { size, type, folder } = uploadRequestSchema.parse(input);
  const isVideo = VIDEO_TYPES.has(type);

  if (!IMAGE_TYPES[type] && !isVideo) return { error: "Upload a JPEG, PNG, WebP, GIF or AVIF image, or an MP4, WebM or MOV video." };

  if (cloudinaryConfig()) {
    if (size > (isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
      return { error: isVideo ? "Videos must be 100 MB or smaller." : "Images must be 10 MB or smaller." };
    }
    return {
      provider: "cloudinary",
      ...createSignedUpload(isVideo ? "video" : "image", folder, { storeAsWebp: type === "image/png" }),
    };
  }

  if (isVideo) return { error: "Video uploads need Cloudinary. You can paste a video link instead." };
  if (size > MAX_IMAGE_BYTES) return { error: "Images must be 10 MB or smaller." };
  const path = `${folder}/${nanoid(12)}.${IMAGE_TYPES[type]}`;
  return { provider: "supabase", uploadUrl: await createSignedUploadUrl(MEDIA_BUCKET, path), path };
}

const finalizeSupabaseSchema = z.object({
  path: z.string().regex(/^[a-z0-9-_]{1,40}\/[A-Za-z0-9_-]{12}\.(jpg|png|webp|gif|avif)$/),
  filename: z.string().trim().min(1).max(200),
});

/** Step 2 (Supabase): verifies what actually landed in Storage, then records it in the library. */
export async function finalizeMediaUploadAction(
  input: z.input<typeof finalizeSupabaseSchema>
): Promise<{ error: string } | { url: string }> {
  await requireSession();
  const { path, filename } = finalizeSupabaseSchema.parse(input);

  const info = await getObjectInfo(MEDIA_BUCKET, path);
  if (!info) return { error: "Upload didn't complete. Please try again." };

  // Check the real bytes, not just the declared Content-Type.
  const url = publicObjectUrl(MEDIA_BUCKET, path);
  const head = await fetch(url, { headers: { Range: "bytes=0-31" }, cache: "no-store" });
  const detected = detectFileType(new Uint8Array(await head.arrayBuffer()));
  if (!detected || !IMAGE_TYPES[detected.mime]) {
    await deleteObject(MEDIA_BUCKET, path);
    return { error: `${filename} isn't a valid image.` };
  }

  await prisma.media.create({
    data: { filename, url, storagePath: path, mimeType: detected.mime, size: info.size, folder: path.split("/")[0], alt: "" },
  });
  revalidatePath("/admin/media");
  return { url };
}

const finalizeCloudinarySchema = z.object({
  resourceType: z.enum(["image", "video"]),
  publicId: z.string().regex(new RegExp(`^${CLOUDINARY_ROOT_FOLDER}/[a-z0-9-_]{1,40}/[^/]{1,200}$`)),
  filename: z.string().trim().min(1).max(200),
});

/** Step 2 (Cloudinary): confirms the asset with Cloudinary's API (never trusting the browser), then records it. */
export async function finalizeCloudinaryUploadAction(
  input: z.input<typeof finalizeCloudinarySchema>
): Promise<{ error: string } | { url: string }> {
  await requireSession();
  const { resourceType, publicId, filename } = finalizeCloudinarySchema.parse(input);

  const resource = await getResource(resourceType, publicId);
  if (!resource) return { error: "Upload didn't complete. Please try again." };

  await prisma.media.create({
    data: {
      filename,
      url: resource.secure_url,
      storagePath: `${CLOUDINARY_PREFIX}${resourceType}:${publicId}`,
      mimeType: `${resourceType}/${resource.format}`,
      size: resource.bytes,
      folder: publicId.split("/")[1],
      alt: "",
    },
  });
  revalidatePath("/admin/media");
  return { url: resource.secure_url };
}

/** Library contents for the media picker. Videos are included only where a field accepts them. */
export async function listMediaAction(options: { includeVideos?: boolean } = {}) {
  await requireSession();
  const items = await prisma.media.findMany({
    where: options.includeVideos ? undefined : { mimeType: { startsWith: "image/" } },
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, filename: true, alt: true, folder: true, mimeType: true },
  });
  return { items, canUploadVideo: Boolean(cloudinaryConfig()) };
}

export async function deleteMediaAction(id: string) {
  await requireSession();

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Media not found");

  if (media.storagePath?.startsWith(CLOUDINARY_PREFIX)) {
    const [, resourceType, ...rest] = media.storagePath.split(":");
    await destroyResource(resourceType as CloudinaryResourceType, rest.join(":"));
  } else if (media.storagePath) {
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
