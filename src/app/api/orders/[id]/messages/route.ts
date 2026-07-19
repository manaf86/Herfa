import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const messageInput = z.object({
  body: z.string().trim().min(1, "الرسالة فارغة").max(4000, "الرسالة طويلة جداً"),
});

export async function POST(req: NextRequest, ctx: RouteContext) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const { id } = await ctx.params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const parsed = messageInput.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 },
    );
  }

  // نتحقّق أن المرسل طرف في الطلب.
  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, buyerId: true, sellerId: true, status: true },
  });
  if (!order || (order.buyerId !== user.id && order.sellerId !== user.id)) {
    return NextResponse.json(
      { error: "الطلب غير موجود" },
      { status: 404 },
    );
  }

  // لا نسمح بإرسال رسائل بعد إغلاق الطلب (لتبسيط الحالة الآن).
  if (order.status === "CANCELLED" || order.status === "COMPLETED") {
    return NextResponse.json(
      { error: "الطلب مغلق — لا يمكن إرسال رسائل جديدة" },
      { status: 400 },
    );
  }

  const msg = await prisma.message.create({
    data: {
      orderId: order.id,
      senderId: user.id,
      body: parsed.data.body,
    },
    select: {
      id: true,
      body: true,
      createdAt: true,
      senderId: true,
      sender: { select: { id: true, name: true, avatarLetter: true } },
    },
  });

  return NextResponse.json({ message: msg }, { status: 201 });
}
