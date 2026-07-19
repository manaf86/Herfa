import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/orders/[id]/accept
 * المشتري فقط. الانتقال المسموح: DELIVERED → ACCEPTED.
 *
 * قواعد spec/01-order-lifecycle.md:
 *   - القبول التلقائي (بعد 5 أيام) لا يفتح السحب فوراً — 5 أيام PENDING_CLEARANCE.
 *   - نافذة حماية 14 يوماً بعد القبول: بلاغ احتيال فقط، لا نزاع جودة.
 */
export async function POST(req: NextRequest, ctx: RouteContext) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const { id } = await ctx.params;

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
      { error: "لا يمكن الاعتماد في هذه الحالة — الطلب لم يُسلَّم بعد." },
      { status: 400 },
    );
  }

  const now = new Date();

  // TODO: هنا يُفرَج المال في المرحلة التالية عند ربط مزوّد الدفع.
  // (spec: ACCEPTED → PENDING_CLEARANCE لمدة 5 أيام، ثم AVAILABLE للسحب.)
  // القاعدة #9 من CLAUDE.md: لا نكتب كود دفع — مزوّد مرخّص فقط.

  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.order.update({
      where: { id: order.id },
      data: {
        status: "ACCEPTED",
        acceptedAt: now,
      },
      select: {
        id: true,
        status: true,
        acceptedAt: true,
      },
    });
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        type: "accepted",
        actorId: user.id,
        payload: {},
      },
    });
    return u;
  });

  return NextResponse.json({ order: updated });
}
