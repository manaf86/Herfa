// Server-only: يستخدم argon2 (native) و Prisma — لا يعمل في Edge.
// كل API route يمرّ من هنا. Middleware يستخدم auth-edge بدلاً منه.

import * as argon2 from "argon2";
import { SignJWT } from "jose";
import { prisma } from "./db";
import { COOKIE, verifyToken } from "./auth-edge";

// أعِد تصدير الكوكي و verifyToken حتى يكون auth.ts نقطة استيراد واحدة للسيرفر.
export { COOKIE, verifyToken };

const SECRET_STR = process.env.AUTH_SECRET;
if (!SECRET_STR) {
  throw new Error("AUTH_SECRET is not set. Add it to .env");
}
const SECRET = new TextEncoder().encode(SECRET_STR);

// ═══════════ كلمات المرور — Argon2id (SECURITY.md § المصادقة) ═══════════

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

// ═══════════ الرموز — JWT صالح 30 يوماً ═══════════

const TOKEN_TTL = "30d";

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(SECRET);
}

// ═══════════ المستخدم الحالي من رأس Cookie ═══════════

export async function getCurrentUser(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`),
  );
  if (!match) return null;

  const userId = await verifyToken(match[1]);
  if (!userId) return null;

  return prisma.user.findUnique({ where: { id: userId } });
}
