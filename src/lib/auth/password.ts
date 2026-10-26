import bcrypt from "bcryptjs";

const BCRYPT_COST = 12;

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

/**
 * A real hash of a random string, compared against when the email doesn't
 * match any account so a failed login takes the same time either way (no
 * user enumeration via timing).
 */
export const DUMMY_PASSWORD_HASH = "$2b$12$G5iXRJpjUGlM650.j5Yj8.va6zy3iaLnV1YMfx1pUD6nRaZ5tUFrm";
