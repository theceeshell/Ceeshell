import "server-only";
import { permanentRedirect } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Called by public pages right before they would show "not found": if the
 * address was renamed, send visitors (and Google) to the new one with a 308.
 * Only runs for misses, so normal page views never touch the Redirect table.
 */
export async function redirectIfMoved(path: string) {
  const redirect = await prisma.redirect.findUnique({ where: { from: path } });
  if (redirect) permanentRedirect(redirect.to);
}

type FooterLink = { label: string; href: string };

/**
 * Records that `from` moved to `to`: adds a redirect, collapses chains
 * (A->B + B->C = A->C), and updates menu and footer links that pointed at
 * the old address. Call inside the same transaction as the slug change.
 */
export async function recordMove(tx: Prisma.TransactionClient, from: string, to: string) {
  if (from === to) return;

  await tx.redirect.deleteMany({ where: { from: to } }); // the new address is a real page again
  await tx.redirect.updateMany({ where: { to: from }, data: { to } });
  await tx.redirect.upsert({ where: { from }, update: { to }, create: { from, to } });

  await tx.navigationItem.updateMany({ where: { href: from }, data: { href: to } });

  const footer = await tx.footerConfig.findUnique({ where: { id: "singleton" } });
  if (footer) {
    const move = (links: unknown) => (links as FooterLink[]).map((l) => (l.href === from ? { ...l, href: to } : l));
    await tx.footerConfig.update({
      where: { id: "singleton" },
      data: {
        quickLinks: move(footer.quickLinks),
        serviceLinks: move(footer.serviceLinks),
        privacyPolicyHref: footer.privacyPolicyHref === from ? to : footer.privacyPolicyHref,
        termsHref: footer.termsHref === from ? to : footer.termsHref,
      },
    });
  }
}
