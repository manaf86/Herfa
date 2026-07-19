import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/orders/[id]/deliver
 * البائع فقط. الانتقال المسموح: IN_PROGRESS | REVISION_REQUESTED → DELIVERED.
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

  // 404 هنا يُخفي الوجود عن غير الأطراف.
  if (!order || order.sellerId !== user.id) {
    return NextResponse.json(
      { error: "الطلب غير موجود" },
      { status: 404 },
    );
  }

  if (
    order.status !== "IN_PROGRESS" &&
    order.status !== "REVISION_REQUESTED"
  ) {
    return NextResponse.json(
      {
        error:
          "لا يمكن التسليم في هذه الحالة — يجب أن يكون الطلب قيد التنفيذ أو طُلب تعديل عليه.",
      },
      { status: 400 },
    );
  }

  const now = new Date();

  // معاملة ذرّية: تحديث + حدث append-only.
  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.order.update({
      where: { id: order.id },
      data: {
        status: "DELIVERED",
        deliveredAt: now,
      },
      select: {
        id: true,
        status: true,
        deliveredAt: true,
      },
    });
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        type: "delivered",
        actorId: user.id,
        payload: { previousStatus: order.status },
      },
    });
    return u;
  });

  return NextResponse.json({ order: updated });
}
