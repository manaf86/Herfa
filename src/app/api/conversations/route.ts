import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const partySelect = { id: true, name: true, avatarLetter: true } satisfies Prisma.UserSelect;

// ═══════════ GET — محادثاتي (كمشترٍ أو بائع) ═══════════

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      buyerId: true,
      sellerId: true,
      buyerLastReadAt: true,
      sellerLastReadAt: true,
      updatedAt: true,
      buyer: { select: partySelect },
      seller: { select: partySelect },
      gig: { select: { id: true, slug: true, title: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, body: true, createdAt: true, senderId: true },
      },
    },
  });

  const result = await Promise.all(
    conversations.map(async (c) => {
      const iAmBuyer = c.buyerId === user.id;
      const otherParty = iAmBuyer ? c.seller : c.buyer;
      const myLastReadAt = iAmBuyer ? c.buyerLastReadAt : c.sellerLastReadAt;

      const unreadCount = await prisma.directMessage.count({
        where: {
          conversationId: c.id,
          senderId: { not: user.id },
          ...(myLastReadAt ? { createdAt: { gt: myLastReadAt } } : {}),
        },
      });

      return {
        id: c.id,
        otherParty,
        gig: c.gig,
        lastMessage: c.messages[0] ?? null,
        updatedAt: c.updatedAt,
        unreadCount,
      };
    }),
  );

  return NextResponse.json({ conversations: result });
}

// ═══════════ POST — ابدأ أو اجلب محادثة ═══════════

const createInput = z.object({
  sellerId: z.string().uuid(),
  gigId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const parsed = createInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 },
    );
  }
  const { sellerId, gigId } = parsed.data;

  if (sellerId === user.id) {
    return NextResponse.json(
      { error: "لا يمكنك مراسلة نفسك" },
      { status: 400 },
    );
  }

  const seller = await prisma.user.findUnique({
    where: { id: sellerId },
    select: { id: true },
  });
  if (!seller) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  if (gigId) {
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      select: { id: true, sellerId: true },
    });
    if (!gig || gig.sellerId !== sellerId) {
      return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });
    }
  }

  const existing = await prisma.conversation.findFirst({
    where: { buyerId: user.id, sellerId, gigId: gigId ?? null },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ conversationId: existing.id });
  }

  try {
    const conversation = await prisma.conversation.create({
      data: { buyerId: user.id, sellerId, gigId: gigId ?? null },
      select: { id: true },
    });
    return NextResponse.json({ conversationId: conversation.id }, { status: 201 });
  } catch (e) {
    // تصادم نادر: محادثة أُنشئت للتو من طلب موازٍ لنفس الطرفين/الخدمة.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const raced = await prisma.conversation.findFirst({
        where: { buyerId: user.id, sellerId, gigId: gigId ?? null },
        select: { id: true },
      });
      if (raced) return NextResponse.json({ conversationId: raced.id });
    }
    console.error("conversation create error:", e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
