import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

// CLAUDE.md #3
const input = z.object({
  reason: z
    .string()
    .trim()
    .min(10, "اشرح سبب التعديل بوضوح (10 أحرف على الأقل).")
    .max(500, "السبب طويل جداً."),
});

/**
 * POST /api/orders/[id]/revision
 * المشتري فقط. الانتقال المسموح: DELIVERED → REVISION_REQUESTED.
 *
 * ملاحظة: الوثيقة تُحدّد عدد التعديلات المسموح بها من الباقة (revisions).
 * التحقّق من العدد يتم في المرحلة اللاحقة — الآن نسمح بالطلب ونسجّله.
 */
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

  const parsed = input.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, buyerId: true, sellerId: true, status: true },
  });

  if (!order || order.buyerId !== user.id) {
    return NextResponse.json(
      { error: "الطلب غير موجود" },
      { status: 404 },
    );
  }

  if (order.status !== "DELIVERED") {
    return NextResponse.json(
      {
        error:
          "لا يمكن طلب تعديل في هذه الحالة — الطلب ليس مُسلَّماً بانتظار الاعتماد.",
      },
      { status: 400 },
    );
  }

  // معاملة ذرّية: تحديث الحالة + حدث + رسالة توضح السبب للبائع.
  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.order.update({
      where: { id: order.id },
      data: { status: "REVISION_REQUESTED" },
      select: { id: true, status: true },
    });
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        type: "revision_requested",
        actorId: user.id,
        payload: { reason: parsed.data.reason },
      },
    });
    // نبعث السبب رسالةً في المحادثة لكي يراه البائع مباشرة (سياق UX).
    await tx.message.create({
      data: {
        orderId: order.id,
        senderId: user.id,
        body: `طلب تعديل: ${parsed.data.reason}`,
      },
    });
    return u;
  });

  return NextResponse.json({ order: updated });
}
