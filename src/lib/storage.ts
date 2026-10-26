import "server-only";

/**
 * Minimal Supabase Storage client (REST) for server-side use. Vercel's
 * filesystem is read-only and per-instance, so every upload lives here.
 *
 * Buckets (created by migration 20261026150000_storage_sessions_rate_limits):
 * - "media": public, images only -- served straight from Supabase's CDN.
 * - "inquiry-attachments": private -- admins get short-lived signed URLs.
 *
 * Authenticates with the project's secret key, which bypasses RLS. It must
 * only ever be read on the server.
 */

export const MEDIA_BUCKET = "media";
export const INQUIRY_BUCKET = "inquiry-attachments";

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set to use file uploads.");
  }
  return { base: `${url.replace(/\/+$/, "")}/storage/v1`, key };
}

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function storageFetch(path: string, init: RequestInit = {}) {
  const { base, key } = config();
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { apikey: key, ...init.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Supabase Storage ${init.method ?? "GET"} ${path} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return res;
}

export async function uploadObject(bucket: string, path: string, body: Uint8Array, contentType: string) {
  await storageFetch(`/object/${bucket}/${encodePath(path)}`, {
    method: "POST",
    headers: { "content-type": contentType, "x-upsert": "false" },
    body: body as BodyInit,
  });
}

export async function deleteObject(bucket: string, path: string) {
  await storageFetch(`/object/${bucket}`, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prefixes: [path] }),
  });
}

/** Returns an absolute URL the browser can PUT the file to directly (valid ~2h), bypassing Vercel's 4.5MB request limit. */
export async function createSignedUploadUrl(bucket: string, path: string) {
  const res = await storageFetch(`/object/upload/sign/${bucket}/${encodePath(path)}`, { method: "POST" });
  const { url } = (await res.json()) as { url: string };
  return `${config().base}${url}`;
}

/** Short-lived download URL for an object in a private bucket. */
export async function createSignedDownloadUrl(bucket: string, path: string, expiresInSeconds = 60 * 60) {
  const res = await storageFetch(`/object/sign/${bucket}/${encodePath(path)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ expiresIn: expiresInSeconds }),
  });
  const { signedURL } = (await res.json()) as { signedURL: string };
  return `${config().base}${signedURL}&download`;
}

/** Size/content type as recorded by Storage, or null if the object doesn't exist. */
export async function getObjectInfo(bucket: string, path: string) {
  try {
    const res = await storageFetch(`/object/info/${bucket}/${encodePath(path)}`);
    const info = (await res.json()) as { size?: number; content_type?: string; metadata?: { size?: number; mimetype?: string } };
    return {
      size: info.size ?? info.metadata?.size ?? 0,
      contentType: info.content_type ?? info.metadata?.mimetype ?? "application/octet-stream",
    };
  } catch {
    return null;
  }
}

export function publicObjectUrl(bucket: string, path: string) {
  return `${config().base}/object/public/${bucket}/${encodePath(path)}`;
}
