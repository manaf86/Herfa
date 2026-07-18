// Edge-safe: مسموح استخدامه في src/middleware.ts.
// لا يستورد Prisma أو argon2 — بحيث يعمل في Edge runtime في Next.js.

import { jwtVerify } from "jose";

/** اسم كوكي الجلسة. مصدره الوحيد هنا حتى لا يتكرّر. */
export const COOKIE = "herfa_session";

const SECRET_STR = process.env.AUTH_SECRET;
if (!SECRET_STR) {
  // أفشل مبكّراً في التطوير بدل توقيع رموز فارغة صامتة.
  throw new Error("AUTH_SECRET is not set. Add it to .env");
}
const SECRET = new TextEncoder().encode(SECRET_STR);

/** يفكّ توقيع JWT ويعيد userId إن كان صالحاً، وإلا null. */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
