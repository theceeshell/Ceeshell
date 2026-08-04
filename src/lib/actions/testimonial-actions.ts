"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validators/testimonial";

function revalidateTestimonialSurfaces() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/portfolio", "layout");
}

export async function createTestimonialAction(values: TestimonialFormValues) {
  await requireSession();
  const data = testimonialSchema.parse(values);
  const maxOrder = await prisma.testimonial.aggregate({ _max: { order: true } });
  await prisma.testimonial.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  revalidateTestimonialSurfaces();
}

export async function updateTestimonialAction(id: string, values: TestimonialFormValues) {
  await requireSession();
  const data = testimonialSchema.parse(values);
  await prisma.testimonial.update({ where: { id }, data });
  revalidateTestimonialSurfaces();
}

export async function deleteTestimonialAction(id: string) {
  await requireSession();
  await prisma.testimonial.delete({ where: { id } });
  revalidateTestimonialSurfaces();
}
