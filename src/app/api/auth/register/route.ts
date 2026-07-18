import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { COOKIE, createToken, hashPassword } from "@/lib/auth";

// Node runtime إلزامي: argon2 و Prisma ليسا edge-safe.
export const runtime = "nodejs";

// CLAUDE.md § القاعدة 3: كل مدخل عبر Zod.
const schema = z
  .object({
    name: z.string().trim().min(2, "الاسم قصير جداً").max(60),
    email: z.string().email("بريد إلكتروني غير صحيح").optional(),
    phone: z
      .string()
      .regex(/^05\d{8}$/, "رقم الجوال يبدأ بـ 05 ويتكوّن من 10 أرقام")
      .optional(),
    password: z
      .string()
      .min(8, "كلمة المرور 8 أحرف على الأقل")
      .max(100),
  })
  .refine((d) => Boolean(d.email || d.phone), {
    message: "يجب إدخال البريد أو رقم الجوال",
    path: ["email"],
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
  const data = parsed.data;

  // TODO: SECURITY.md § المصادقة — إضافة Rate Limiting هنا (5 محاولات/ساعة/IP).

  // منع التسجيل ببريد أو جوال مستخدم.
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        data.email ? { email: data.email } : { email: "__none__" },
        data.phone ? { phone: data.phone } : { phone: "__none__" },
      ],
    },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "هذا البريد أو الجوال مسجَّل مسبقاً" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(data.password);
  const avatarLetter = data.name.trim().charAt(0) || "أ";

  let user;
  try {
    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        avatarLetter,
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
  } catch (e) {
    // Race على unique index بين وقتَي الفحص والإنشاء.
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "هذا البريد أو الجوال مسجَّل مسبقاً" },
        { status: 409 },
      );
    }
    console.error("register error:", e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }

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
    // SECURITY.md ينصّ على Strict. نستخدم Lax مؤقّتاً لتوافق تدفّق SSO المستقبلي.
    // TODO: راجع القرار قبل الإنتاج — ربّما نحتاج Strict لصفحات الدفع.
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
