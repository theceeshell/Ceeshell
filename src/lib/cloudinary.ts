import "server-only";
import { createHash, randomBytes } from "node:crypto";

/**
 * Cloudinary (free plan: 25 credits/month) stores and delivers Media Library
 * uploads: images are resized/compressed per device, videos are transcoded.
 * Uploads go straight from the browser to Cloudinary with a signature made
 * here, so the API secret never leaves the server.
 *
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   (Cloudinary console -> Settings -> API Keys)
 *
 * Without them, image uploads fall back to Supabase Storage (src/lib/storage.ts).
 */

export type CloudinaryResourceType = "image" | "video";

/** Everything the site uploads lives under this folder in the Cloudinary account. */
export const CLOUDINARY_ROOT_FOLDER = "ceeshell";

export function cloudinaryConfig() {
  // Trimmed: values pasted into dashboards often pick up stray spaces.
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

function requireConfig() {
  const config = cloudinaryConfig();
  if (!config) throw new Error("Cloudinary is not configured");
  return config;
}

/** Cloudinary's signature: SHA-1 of the sorted "key=value" pairs joined with "&", followed by the secret. */
function sign(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(payload + apiSecret).digest("hex");
}

const ALLOWED_FORMATS: Record<CloudinaryResourceType, string> = {
  image: "jpg,jpeg,png,webp,gif,avif",
  video: "mp4,webm,mov",
};

/**
 * Form fields + URL for one direct browser upload (valid for about an hour).
 * The public_id is chosen here ("ceeshell/<folder>/<random>"), which behaves
 * the same in Cloudinary's fixed- and dynamic-folder account modes.
 */
export function createSignedUpload(resourceType: CloudinaryResourceType, folder: string) {
  const { cloudName, apiKey, apiSecret } = requireConfig();
  const params = {
    allowed_formats: ALLOWED_FORMATS[resourceType],
    public_id: `${CLOUDINARY_ROOT_FOLDER}/${folder}/${randomBytes(9).toString("base64url")}`,
    timestamp: Math.floor(Date.now() / 1000),
  };
  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    fields: { ...params, api_key: apiKey, signature: sign(params, apiSecret) },
  };
}

function adminAuth() {
  const { apiKey, apiSecret } = requireConfig();
  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;
}

/** What Cloudinary actually stored, or null if it doesn't exist. */
export async function getResource(resourceType: CloudinaryResourceType, publicId: string) {
  const { cloudName } = requireConfig();
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}/upload/${publicId.split("/").map(encodeURIComponent).join("/")}`,
    { headers: { Authorization: adminAuth() }, cache: "no-store" }
  );
  if (!res.ok) return null;
  return (await res.json()) as { secure_url: string; bytes: number; format: string; public_id: string };
}

export async function destroyResource(resourceType: CloudinaryResourceType, publicId: string) {
  const { cloudName, apiKey, apiSecret } = requireConfig();
  const params = { invalidate: "true", public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
  const body = new URLSearchParams({ ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])), api_key: apiKey, signature: sign(params, apiSecret) });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, { method: "POST", body, cache: "no-store" });
  if (!res.ok) throw new Error(`Cloudinary destroy failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
}
