import "server-only";
import { cache } from "react";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "cs_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
}

export async function createSessionCookie(user: { id: string; sessionVersion: number }) {
  const token = await new SignJWT({ sv: user.sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Verifies the session cookie AND re-checks the user against the database, so
 * deactivating a user, changing their role/password or logging out (all of
 * which bump User.sessionVersion) takes effect immediately rather than when
 * the JWT expires. Memoized per request.
 */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  let userId: string;
  let sessionVersion: number;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.sv !== "number") return null;
    userId = payload.sub;
    sessionVersion = payload.sv;
  } catch {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, active: true, sessionVersion: true },
  });
  if (!user || !user.active || user.sessionVersion !== sessionVersion) return null;

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role === "ADMIN" ? "ADMIN" : "EDITOR",
  };
});
