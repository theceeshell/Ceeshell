import {
  createMediaUploadAction,
  finalizeCloudinaryUploadAction,
  finalizeMediaUploadAction,
} from "@/lib/actions/media-actions";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function isAcceptedImage(file: File) {
  return ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_BYTES;
}

export function isAcceptedVideo(file: File) {
  return ACCEPTED_VIDEO_TYPES.includes(file.type) && file.size <= MAX_VIDEO_BYTES;
}

/**
 * Uploads one file straight from the browser (to Cloudinary, or to Supabase
 * Storage when Cloudinary isn't set up), then registers it in the Media Library.
 */
export async function uploadMedia(file: File, folder = "general"): Promise<{ error: string } | { url: string }> {
  const ticket = await createMediaUploadAction({ filename: file.name, size: file.size, type: file.type, folder });
  if ("error" in ticket) return ticket;

  if (ticket.provider === "cloudinary") {
    const form = new FormData();
    for (const [key, value] of Object.entries(ticket.fields)) form.append(key, String(value));
    form.append("file", file);
    const res = await fetch(ticket.uploadUrl, { method: "POST", body: form });
    const data = (await res.json().catch(() => null)) as { public_id?: string; resource_type?: string; error?: { message?: string } } | null;
    if (!res.ok || !data?.public_id) return { error: `${file.name}: upload failed${data?.error?.message ? ` (${data.error.message})` : ""}` };
    return finalizeCloudinaryUploadAction({
      resourceType: data.resource_type === "video" ? "video" : "image",
      publicId: data.public_id,
      filename: file.name,
    });
  }

  const res = await fetch(ticket.uploadUrl, {
    method: "PUT",
    headers: { "content-type": file.type, "x-upsert": "false" },
    body: file,
  });
  if (!res.ok) return { error: `${file.name}: upload failed (${res.status})` };
  return finalizeMediaUploadAction({ path: ticket.path, filename: file.name });
}
