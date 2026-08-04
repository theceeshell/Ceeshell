"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { saveUpload } from "@/lib/cms/uploads";
import { revalidatePath } from "next/cache";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  industry: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(1, "Tell us a bit about your project"),
});

export interface InquiryState {
  success?: boolean;
  error?: string;
}

export async function submitInquiryAction(_prevState: InquiryState, formData: FormData): Promise<InquiryState> {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    industry: formData.get("industry") || undefined,
    service: formData.get("service") || undefined,
    budget: formData.get("budget") || undefined,
    timeline: formData.get("timeline") || undefined,
    message: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  let attachmentUrl: string | undefined;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const saved = await saveUpload(file, "inquiries");
    attachmentUrl = saved.url;
  }

  await prisma.contactInquiry.create({
    data: { ...parsed.data, attachmentUrl, status: "new" },
  });

  revalidatePath("/admin/inquiries");
  return { success: true };
}
