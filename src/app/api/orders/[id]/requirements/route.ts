import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const reqInput = z.object({
  requirements: z
    .string()
    .trim()
    .min(20, "المتطلبات قصيرة جداً — اشرح ما تحتاج بوضوح.")
    .max(10_000, "المتطلبات طويلة جداً."),
});

/**
 * POST /api/orders/[id]/requirements
 *
 * القاعدة #11 من CLAUDE.md — نصّها الحرفي:
 * "العدّاد يبدأ عند اكتمال المتطلبات، لا عند الدفع."
 *
 * لذلك هنا فقط تحدث ثلاثة أشياء معاً (في معاملة ذرّية):
 *   1) نحفظ requirements
 *   2) نضبط timerStartedAt = now(), dueAt = now() + deliveryDays
 *   3) ننقل الحالة AWAITING_REQUIREMENTS → IN_PROGRESS
 * ونسجّل حدثين append-only: requirements_submitted + timer_started.
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

  const parsed = reqInput.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      buyerId: true,
      sellerId: true,
      status: true,
      package: { select: { deliveryDays: true } },
    },
  });
  if (!order) {
    return NextResponse.json(
      { error: "الطلب غير موجود" },
      { status: 404 },
    );
  }

  // المشتري فقط يرسل المتطلبات.
  if (order.buyerId !== user.id) {
    return NextResponse.json(
      { error: "الطلب غير موجود" }, // إخفاء الوجود عن الغرباء
      { status: 404 },
    );
  }

  if (order.status !== "AWAITING_REQUIREMENTS") {
    return NextResponse.json(
      {
        error:
          "لا يمكن تعديل المتطلبات في هذه المرحلة — الطلب انتقل بالفعل.",
      },
      { status: 400 },
    );
  }

  const now = new Date();
  const dueAt = new Date(
    now.getTime() + order.package.deliveryDays * 24 * 60 * 60 * 1000,
  );

  // معاملة ذرّية — إمّا الكل أو لا شيء.
  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.order.update({
      where: { id: order.id },
      data: {
        requirements: parsed.data.requirements,
        timerStartedAt: now,
        dueAt,
        status: "IN_PROGRESS",
      },
      select: {
        id: true,
        status: true,
        timerStartedAt: true,
        dueAt: true,
      },
    });

    // append-only. نسجّل الحدثين معاً كما في spec/01-order-lifecycle.md.
    await tx.orderEvent.createMany({
      data: [
        {
          orderId: order.id,
          type: "requirements_submitted",
          actorId: user.id,
          payload: { length: parsed.data.requirements.length },
        },
        {
          orderId: order.id,
          type: "timer_started",
          actorId: user.id,
          payload: {
            deliveryDays: order.package.deliveryDays,
            dueAt: dueAt.toISOString(),
          },
        },
      ],
    });

    return u;
  });

  return NextResponse.json({ order: updated });
}
