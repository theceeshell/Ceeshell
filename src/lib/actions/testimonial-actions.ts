"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { revalidateSite } from "@/lib/actions/helpers";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validators/testimonial";


export async function createTestimonialAction(values: TestimonialFormValues) {
  await requireSession();
  const data = testimonialSchema.parse(values);
  const maxOrder = await prisma.testimonial.aggregate({ _max: { order: true } });
  await prisma.testimonial.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  revalidateSite();
}

export async function updateTestimonialAction(id: string, values: TestimonialFormValues) {
  await requireSession();
  const data = testimonialSchema.parse(values);
  await prisma.testimonial.update({ where: { id }, data });
  revalidateSite();
}

export async function deleteTestimonialAction(id: string) {
  await requireSession();
  await prisma.testimonial.delete({ where: { id } });
  revalidateSite();
}

export async function reorderTestimonialsAction(orderedIds: string[]) {
  await requireSession();
  await prisma.$transaction(orderedIds.map((id, index) => prisma.testimonial.update({ where: { id }, data: { order: index } })));
  revalidateSite();
}
