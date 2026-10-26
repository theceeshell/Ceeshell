import "server-only";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";

/**
 * Public pages are statically rendered and cached (ISR). Almost every piece
 * of CMS content can surface on several pages (a service appears on its own
 * page, the services index, home showcases, the footer, ...), so any content
 * change purges the whole site rather than trying to track each dependency.
 * Pages regenerate lazily on their next visit, which is cheap at this size.
 */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

/**
 * Next.js hides thrown Server Action error messages in production, so
 * failures the user can act on (duplicate slug, last admin, ...) are returned
 * as values instead. Unexpected errors still throw.
 */
export type ActionResult = { error: string } | undefined;

export function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/** Runs a create/update and turns a unique-slug collision into a user-facing error. */
export async function withSlugCheck(run: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await run();
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "That slug is already in use. Choose a different one." };
    throw error;
  }
}
