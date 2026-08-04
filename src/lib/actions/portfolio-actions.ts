"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { portfolioProjectSchema, type PortfolioProjectFormValues } from "@/lib/validators/portfolio";

function revalidatePortfolioSurfaces(slug?: string) {
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  if (slug) revalidatePath(`/portfolio/${slug}`);
}

export async function createPortfolioProjectAction(values: PortfolioProjectFormValues) {
  await requireSession();
  const { industryIds, testimonialId, ...rest } = portfolioProjectSchema.parse(values);
  const maxOrder = await prisma.portfolioProject.aggregate({ _max: { order: true } });
  const created = await prisma.portfolioProject.create({
    data: {
      ...rest,
      testimonialId: testimonialId || null,
      order: (maxOrder._max.order ?? -1) + 1,
      industries: industryIds.length ? { connect: industryIds.map((id) => ({ id })) } : undefined,
    },
  });
  revalidatePortfolioSurfaces(created.slug);
  return created;
}

export async function updatePortfolioProjectAction(id: string, values: PortfolioProjectFormValues) {
  await requireSession();
  const { industryIds, testimonialId, ...rest } = portfolioProjectSchema.parse(values);
  const updated = await prisma.portfolioProject.update({
    where: { id },
    data: {
      ...rest,
      testimonialId: testimonialId || null,
      industries: { set: industryIds.map((id) => ({ id })) },
    },
  });
  revalidatePortfolioSurfaces(updated.slug);
  return updated;
}

export async function deletePortfolioProjectAction(id: string) {
  await requireSession();
  const deleted = await prisma.portfolioProject.delete({ where: { id } });
  revalidatePortfolioSurfaces(deleted.slug);
}

export async function reorderPortfolioProjectsAction(orderedIds: string[]) {
  await requireSession();
  await Promise.all(
    orderedIds.map((id, index) => prisma.portfolioProject.update({ where: { id }, data: { order: index } }))
  );
  revalidatePortfolioSurfaces();
}

async function generateCopySlug(baseSlug: string) {
  let candidate = `${baseSlug}-copy`;
  let attempt = 2;
  while (await prisma.portfolioProject.findUnique({ where: { slug: candidate } })) {
    candidate = `${baseSlug}-copy-${attempt}`;
    attempt += 1;
  }
  return candidate;
}

export async function duplicatePortfolioProjectAction(id: string) {
  await requireSession();
  const original = await prisma.portfolioProject.findUnique({
    where: { id },
    include: { industries: true },
  });
  if (!original) throw new Error("Portfolio project not found");

  const slug = await generateCopySlug(original.slug);
  const maxOrder = await prisma.portfolioProject.aggregate({ _max: { order: true } });

  const created = await prisma.portfolioProject.create({
    data: {
      slug,
      title: `${original.title} (Copy)`,
      client: original.client,
      industry: original.industry,
      year: original.year,
      categories: original.categories as string[],
      servicesUsed: original.servicesUsed as string[],
      excerpt: original.excerpt,
      coverImageUrl: original.coverImageUrl,
      coverAspect: original.coverAspect,
      gallery: original.gallery as string[],
      challenge: original.challenge,
      research: original.research,
      strategy: original.strategy,
      concept: original.concept,
      designProcess: original.designProcess,
      photography: original.photography,
      printing: original.printing,
      deliverables: original.deliverables as string[],
      testimonialId: original.testimonialId,
      featured: false,
      order: (maxOrder._max.order ?? -1) + 1,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
      industries: original.industries.length
        ? { connect: original.industries.map((industry) => ({ id: industry.id })) }
        : undefined,
    },
  });
  revalidatePortfolioSurfaces(created.slug);
  return created;
}
