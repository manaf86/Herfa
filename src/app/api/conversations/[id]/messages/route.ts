import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const messageInput = z.object({
  body: z.string().trim().min(1, "الرسالة فارغة").max(2000, "الرسالة طويلة جداً"),
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

  // نتحقّق أن المرسل طرف في المحادثة.
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    select: { id: true, buyerId: true, sellerId: true },
  });
  if (!conversation || (conversation.buyerId !== user.id && conversation.sellerId !== user.id)) {
    return NextResponse.json({ error: "المحادثة غير موجودة" }, { status: 404 });
  }

  const iAmBuyer = conversation.buyerId === user.id;

  const [message] = await prisma.$transaction([
    prisma.directMessage.create({
      data: {
        conversationId: conversation.id,
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
    }),
    // إرسال رسالة يعني أن المُرسل قرأ المحادثة حتى الآن، ويرفع updatedAt للترتيب في القائمة.
    prisma.conversation.update({
      where: { id: conversation.id },
      data: iAmBuyer ? { buyerLastReadAt: new Date() } : { sellerLastReadAt: new Date() },
    }),
  ]);

  return NextResponse.json({ message }, { status: 201 });
}
