import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/orders/[id]/cancel
 * أيّ طرف (مشترٍ أو بائع). الانتقال المسموح: AWAITING_REQUIREMENTS → CANCELLED فقط.
 *
 * قاعدة الوثيقة: بعد بدء العمل لا يُلغى الطلب إلا بنزاع.
 *   قبل بدء العدّاد → استرداد كامل، بلا أثر على أي طرف.
 * الحالات الأخرى (IN_PROGRESS/DELIVERED/…): تُدار عبر غرفة النزاع لاحقاً.
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

  if (!order || (order.buyerId !== user.id && order.sellerId !== user.id)) {
    return NextResponse.json(
      { error: "الطلب غير موجود" },
      { status: 404 },
    );
  }

  if (order.status !== "AWAITING_REQUIREMENTS") {
    return NextResponse.json(
      {
        error:
          "لا يمكن إلغاء الطلب بعد بدء العمل — استخدم النزاع بدل الإلغاء المباشر.",
      },
      { status: 400 },
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
      select: { id: true, status: true },
    });
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        type: "cancelled",
        actorId: user.id,
        payload: {
          initiator: order.buyerId === user.id ? "buyer" : "seller",
        },
      },
    });
    return u;
  });

  return NextResponse.json({ order: updated });
}
