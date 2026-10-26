import "server-only";
import { getSession } from "@/lib/auth/session";

/** Throws if there's no authenticated admin session. Call at the top of every mutating server action. */
export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

/**
 * Throws unless the current session belongs to an ADMIN (not EDITOR). EDITORs
 * manage content; site-wide settings, SEO, navigation, footer and users are
 * admin-only.
 */
export async function requireAdmin() {
  const session = await requireSession();
  if (session.role !== "ADMIN") throw new Error("Admins only");
  return session;
}
