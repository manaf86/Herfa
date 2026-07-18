import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { COOKIE, createToken, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  identifier: z.string().trim().min(3, "المعرّف قصير جداً").max(120),
  password: z.string().min(1, "أدخل كلمة المرور").max(200),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "طلب غير صالح" },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 },
    );
  }

  // TODO: SECURITY.md § المصادقة — Rate Limiting هنا (5 محاولات/ساعة/معرّف).

  const { identifier, password } = parsed.data;
  const isPhone = /^05\d{8}$/.test(identifier);

  const user = await prisma.user.findFirst({
    where: isPhone ? { phone: identifier } : { email: identifier.toLowerCase() },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      passwordHash: true,
      status: true,
      role: true,
    },
  });

  // نفس رسالة الخطأ للمستخدم غير الموجود ولكلمة المرور الخاطئة (منع user enumeration).
  const genericAuthError = () =>
    NextResponse.json(
      { error: "البريد أو كلمة المرور غير صحيحة" },
      { status: 401 },
    );

  if (!user || !user.passwordHash) return genericAuthError();

  if (user.status === "SUSPENDED") {
    return NextResponse.json(
      {
        error:
          "أُقفل حسابك مؤقتاً. راسل الدعم لتفعيله قبل المتابعة.",
      },
      { status: 403 },
    );
  }

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return genericAuthError();

  const token = await createToken(user.id);
  const res = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // TODO: راجع Strict قبل الإنتاج.
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
