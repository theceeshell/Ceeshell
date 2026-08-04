"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";

export type InquiryStatus = "new" | "in_progress" | "closed";

export async function updateInquiryStatusAction(id: string, status: InquiryStatus) {
  await requireSession();
  await prisma.contactInquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiryAction(id: string) {
  await requireSession();
  await prisma.contactInquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
}
