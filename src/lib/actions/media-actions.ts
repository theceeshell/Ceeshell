"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { saveUpload } from "@/lib/cms/uploads";

export async function uploadMediaAction(formData: FormData) {
  await requireSession();

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const folderRaw = formData.get("folder");
  const folder = typeof folderRaw === "string" && folderRaw.trim() !== "" ? folderRaw.trim() : "general";

  const created = [];
  for (const file of files) {
    const saved = await saveUpload(file, folder);
    const record = await prisma.media.create({
      data: {
        filename: saved.filename,
        url: saved.url,
        mimeType: saved.mimeType,
        size: saved.size,
        folder,
        alt: "",
      },
    });
    created.push(record);
  }

  revalidatePath("/admin/media");
  return created;
}

export async function deleteMediaAction(id: string) {
  await requireSession();

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Media not found");

  try {
    const filePath = path.join(process.cwd(), "public", media.url.replace(/^\//, ""));
    await unlink(filePath);
  } catch {
    // File may already be gone -- don't block deleting the DB row.
  }

  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}

export async function updateMediaAltAction(id: string, alt: string) {
  await requireSession();
  await prisma.media.update({ where: { id }, data: { alt } });
  revalidatePath("/admin/media");
}
