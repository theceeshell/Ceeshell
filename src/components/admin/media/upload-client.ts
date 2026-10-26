import { createMediaUploadAction, finalizeMediaUploadAction } from "@/lib/actions/media-actions";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function isAcceptedImage(file: File) {
  return ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_BYTES;
}

/** Uploads one image straight to Storage via a signed URL, then registers it in the Media Library. */
export async function uploadImage(file: File, folder = "general"): Promise<{ error: string } | { url: string }> {
  const ticket = await createMediaUploadAction({ filename: file.name, size: file.size, type: file.type, folder });
  if ("error" in ticket) return ticket;

  const res = await fetch(ticket.uploadUrl, {
    method: "PUT",
    headers: { "content-type": file.type, "x-upsert": "false" },
    body: file,
  });
  if (!res.ok) return { error: `${file.name}: upload failed (${res.status})` };

  return finalizeMediaUploadAction({ path: ticket.path, filename: file.name });
}
