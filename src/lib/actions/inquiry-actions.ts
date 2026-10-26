"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { detectFileType } from "@/lib/file-type";
import { sendInquiryNotification } from "@/lib/notify";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { INQUIRY_BUCKET, uploadObject } from "@/lib/storage";

/** Must stay under Vercel's 4.5MB request limit (see serverActions.bodySizeLimit) and match the bucket's file_size_limit. */
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
const ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const optionalText = (max: number) => z.string().trim().max(max).optional();

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  company: z.string().trim().min(1, "Company is required").max(160),
  email: z.string().trim().email("Enter a valid email").max(254),
  phone: optionalText(40),
  industry: optionalText(80),
  service: optionalText(80),
  // Choices are editable in Website Texts (up to 200 characters each).
  budget: optionalText(200),
  timeline: optionalText(200),
  message: z.string().trim().min(1, "Tell us a bit about your project").max(5000, "Please keep your message under 5,000 characters"),
});

export interface InquiryState {
  success?: boolean;
  error?: string;
}

export async function submitInquiryAction(_prevState: InquiryState, formData: FormData): Promise<InquiryState> {
  // Honeypot: a field real visitors never see. Pretend success so bots don't adapt.
  if (formData.get("website")) return { success: true };

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

  const file = formData.get("file");
  let attachment: { bytes: Uint8Array; mime: string; ext: string } | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_ATTACHMENT_BYTES) return { error: "Attachments must be 4 MB or smaller." };
    const bytes = new Uint8Array(await file.arrayBuffer());
    const detected = detectFileType(bytes, file.name);
    if (!detected || !ATTACHMENT_TYPES.has(detected.mime)) {
      return { error: "Attach a PDF, JPG, PNG, WebP, Word (.docx) or PowerPoint (.pptx) file." };
    }
    attachment = { bytes, ...detected };
  }

  const ip = await getClientIp();
  if (!(await rateLimit(`inquiry:${ip}`, 5, 60 * 60))) {
    return { error: "You've sent several inquiries already. Please try again later or email us directly." };
  }

  // A failed upload shouldn't lose the inquiry itself.
  let attachmentPath: string | null = null;
  if (attachment) {
    const path = `${new Date().toISOString().slice(0, 7)}/${nanoid(16)}.${attachment.ext}`;
    try {
      await uploadObject(INQUIRY_BUCKET, path, attachment.bytes, attachment.mime);
      attachmentPath = path;
    } catch (error) {
      console.error("Inquiry attachment upload failed", error);
    }
  }

  await prisma.contactInquiry.create({
    data: { ...parsed.data, attachmentPath, status: "new" },
  });

  after(() => sendInquiryNotification({ ...parsed.data, hasAttachment: Boolean(attachmentPath) }));

  revalidatePath("/admin/inquiries");
  return { success: true };
}
