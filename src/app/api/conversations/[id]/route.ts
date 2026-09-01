import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const detailSelect = {
  id: true,
  buyerId: true,
  sellerId: true,
  createdAt: true,
  buyer: { select: { id: true, name: true, avatarLetter: true } },
  seller: { select: { id: true, name: true, avatarLetter: true } },
  gig: { select: { id: true, slug: true, title: true } },
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
};

// ═══════════ GET /api/conversations/[id] ═══════════

export async function GET(req: NextRequest, ctx: RouteContext) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    select: detailSelect,
  });

  // نُعيد 404 لمن ليس طرفاً في المحادثة (لا نكشف وجودها).
  if (!conversation || (conversation.buyerId !== user.id && conversation.sellerId !== user.id)) {
    return NextResponse.json({ error: "المحادثة غير موجودة" }, { status: 404 });
  }

  // نسجّل وقت فتح هذا الطرف للمحادثة (أساس عدّاد غير المقروء).
  const iAmBuyer = conversation.buyerId === user.id;
  await prisma.conversation.update({
    where: { id },
    data: iAmBuyer ? { buyerLastReadAt: new Date() } : { sellerLastReadAt: new Date() },
  });

  return NextResponse.json({ conversation });
}
