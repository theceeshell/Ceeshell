"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { createSignedDownloadUrl, deleteObject, INQUIRY_BUCKET } from "@/lib/storage";

const inquiryStatusSchema = z.enum(["new", "in_progress", "closed"]);
export type InquiryStatus = z.infer<typeof inquiryStatusSchema>;

export async function updateInquiryStatusAction(id: string, status: InquiryStatus) {
  await requireSession();
  await prisma.contactInquiry.update({ where: { id }, data: { status: inquiryStatusSchema.parse(status) } });
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiryAction(id: string) {
  await requireSession();
  const inquiry = await prisma.contactInquiry.delete({ where: { id } });
  if (inquiry.attachmentPath) {
    await deleteObject(INQUIRY_BUCKET, inquiry.attachmentPath).catch((error) => {
      console.error("Failed to delete inquiry attachment", inquiry.attachmentPath, error);
    });
  }
  revalidatePath("/admin/inquiries");
}

/** Issues a short-lived download link for an inquiry's attachment (the bucket is private). */
export async function getInquiryAttachmentUrlAction(id: string) {
  await requireSession();
  const inquiry = await prisma.contactInquiry.findUnique({ where: { id }, select: { attachmentPath: true } });
  if (!inquiry?.attachmentPath) throw new Error("No attachment");
  return createSignedDownloadUrl(INQUIRY_BUCKET, inquiry.attachmentPath, 5 * 60);
}
