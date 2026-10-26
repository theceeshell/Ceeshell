"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/require-session";
import { revalidateSite, withSlugCheck, type ActionResult } from "@/lib/actions/helpers";
import { portfolioProjectSchema, type PortfolioProjectFormValues } from "@/lib/validators/portfolio";

export async function createPortfolioProjectAction(values: PortfolioProjectFormValues): Promise<ActionResult> {
  await requireSession();
  const { industryIds, testimonialId, ...rest } = portfolioProjectSchema.parse(values);
  const maxOrder = await prisma.portfolioProject.aggregate({ _max: { order: true } });
  const result = await withSlugCheck(() =>
    prisma.portfolioProject.create({
      data: {
        ...rest,
        testimonialId: testimonialId || null,
        order: (maxOrder._max.order ?? -1) + 1,
        industries: industryIds.length ? { connect: industryIds.map((id) => ({ id })) } : undefined,
      },
    })
  );
  if (!result) revalidateSite();
  return result;
}

export async function updatePortfolioProjectAction(id: string, values: PortfolioProjectFormValues): Promise<ActionResult> {
  await requireSession();
  const { industryIds, testimonialId, ...rest } = portfolioProjectSchema.parse(values);
  const result = await withSlugCheck(() =>
    prisma.portfolioProject.update({
      where: { id },
      data: {
        ...rest,
        testimonialId: testimonialId || null,
        industries: { set: industryIds.map((id) => ({ id })) },
      },
    })
  );
  if (!result) revalidateSite();
  return result;
}

export async function deletePortfolioProjectAction(id: string) {
  await requireSession();
  await prisma.portfolioProject.delete({ where: { id } });
  revalidateSite();
}

export async function reorderPortfolioProjectsAction(orderedIds: string[]) {
  await requireSession();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.portfolioProject.update({ where: { id }, data: { order: index } }))
  );
  revalidateSite();
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

  await prisma.portfolioProject.create({
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
  revalidateSite();
}
