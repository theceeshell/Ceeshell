"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { faqSchema, type FaqFormValues } from "@/lib/validators/faq";

function revalidateFaqSurfaces() {
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  revalidatePath("/contact");
}

export async function createFaqAction(values: FaqFormValues) {
  await requireSession();
  const data = faqSchema.parse(values);
  const maxOrder = await prisma.faq.aggregate({ _max: { order: true } });
  await prisma.faq.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  revalidateFaqSurfaces();
}

export async function updateFaqAction(id: string, values: FaqFormValues) {
  await requireSession();
  const data = faqSchema.parse(values);
  await prisma.faq.update({ where: { id }, data });
  revalidateFaqSurfaces();
}

export async function deleteFaqAction(id: string) {
  await requireSession();
  await prisma.faq.delete({ where: { id } });
  revalidateFaqSurfaces();
}

export async function reorderFaqsAction(orderedIds: string[]) {
  await requireSession();
  await Promise.all(orderedIds.map((id, index) => prisma.faq.update({ where: { id }, data: { order: index } })));
  revalidateFaqSurfaces();
}

export async function duplicateFaqAction(id: string) {
  await requireSession();
  const original = await prisma.faq.findUnique({ where: { id } });
  if (!original) throw new Error("FAQ not found");
  const maxOrder = await prisma.faq.aggregate({ _max: { order: true } });
  await prisma.faq.create({
    data: {
      question: `${original.question} (Copy)`,
      answer: original.answer,
      category: original.category,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });
  revalidateFaqSurfaces();
}
