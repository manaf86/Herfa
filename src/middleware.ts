import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verifyToken } from "@/lib/auth-edge";

// يعمل في Edge runtime — لذلك نستورد auth-edge فقط (لا Prisma ولا argon2).
// المسارات المحميّة: الداشبورد، السوق، طلبات جديدة.
// الصفحات العامة: /، /login، /gig/*.

const PROTECTED_PREFIXES = ["/dashboard", "/orders", "/marketplace"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(loginUrl(req, pathname));
  }

  const userId = await verifyToken(token);
  if (!userId) {
    // رمز تالف/منتهي → حذفه في الاستجابة وإعادة توجيه.
    const res = NextResponse.redirect(loginUrl(req, pathname));
    res.cookies.delete(COOKIE);
    return res;
  }

  return NextResponse.next();
}

function loginUrl(req: NextRequest, next: string) {
  const url = new URL("/login", req.url);
  // لاحقاً: نستخدم next لإعادة التوجيه بعد الدخول.
  url.searchParams.set("next", next);
  return url;
}

// يطابق المسارات المحميّة فقط — لا نُنفّذ middleware على /، /login، /gig/*.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/marketplace/:path*",
  ],
};
