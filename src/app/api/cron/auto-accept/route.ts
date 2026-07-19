import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

/**
 * POST /api/cron/auto-accept
 *
 * قاعدة spec/01-order-lifecycle.md — قاعدة #2 (القبول التلقائي):
 *   - المشتري لديه 5 أيام بعد التسليم.
 *   - عند الانتهاء: DELIVERED → ACCEPTED تلقائياً.
 *   - ⚠ القبول التلقائي لا يفتح السحب فوراً (5 أيام PENDING_CLEARANCE).
 *     صرف المال يأتي مع مزوّد الدفع في المرحلة اللاحقة.
 *
 * الحماية: Bearer token من متغيّر البيئة CRON_SECRET.
 * لاحقاً: نُشغّله بجدولة (Vercel Cron أو GitHub Actions أو BullMQ).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET غير مُعدّ في البيئة" },
      { status: 500 },
    );
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - FIVE_DAYS_MS);

  // نجلب فقط الطلبات المُسلَّمة قبل النافذة.
  const eligible = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      deliveredAt: { lt: cutoff, not: null },
    },
    select: { id: true },
  });

  let acceptedCount = 0;
  const now = new Date();

  for (const { id } of eligible) {
    try {
      const done = await prisma.$transaction(async (tx) => {
        // updateMany بحرس الحالة يمنع race مع اعتماد يدوي/إلغاء متزامن.
        const res = await tx.order.updateMany({
          where: { id, status: "DELIVERED" },
          data: { status: "ACCEPTED", acceptedAt: now },
        });
        if (res.count === 0) return false;
        await tx.orderEvent.create({
          data: {
            orderId: id,
            type: "auto_accepted",
            actorId: null, // النظام
            payload: { at: now.toISOString() },
          },
        });
        return true;
      });
      if (done) acceptedCount += 1;
    } catch (e) {
      console.error("auto-accept failed for order", id, e);
    }
  }

  return NextResponse.json({
    checked: eligible.length,
    accepted: acceptedCount,
    cutoff: cutoff.toISOString(),
  });
}
