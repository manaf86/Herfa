import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const detailSelect = {
  id: true,
  reference: true,
  status: true,
  amountMinor: true,
  currency: true,
  requirements: true,
  timerStartedAt: true,
  dueAt: true,
  deliveredAt: true,
  acceptedAt: true,
  createdAt: true,
  updatedAt: true,
  buyerId: true,
  sellerId: true,
  gig: {
    select: {
      id: true,
      slug: true,
      title: true,
      categoryId: true,
    },
  },
  package: {
    select: {
      id: true,
      tier: true,
      title: true,
      description: true,
      priceMinor: true,
      currency: true,
      deliveryDays: true,
      revisions: true,
      features: true,
    },
  },
  buyer: {
    select: { id: true, name: true, avatarLetter: true },
  },
  seller: {
    select: { id: true, name: true, avatarLetter: true },
  },
  messages: {
    orderBy: { createdAt: "asc" as const },
    select: {
      id: true,
      body: true,
      createdAt: true,
      senderId: true,
      sender: { select: { id: true, name: true, avatarLetter: true } },
    },
  },
  events: {
    orderBy: { createdAt: "asc" as const },
    select: {
      id: true,
      type: true,
      actorId: true,
      createdAt: true,
    },
  },
};

export async function GET(req: NextRequest, ctx: RouteContext) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: detailSelect,
  });

  // CLAUDE.md #2: المستخدم يجب أن يكون طرفاً في الطلب.
  // نُعيد 404 لمن ليس طرفاً لمنع كشف وجود الطلب.
  if (!order || (order.buyerId !== user.id && order.sellerId !== user.id)) {
    return NextResponse.json(
      { error: "الطلب غير موجود" },
      { status: 404 },
    );
  }

  return NextResponse.json({ order });
}
