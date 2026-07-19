import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { makeOrderReference } from "@/lib/reference";

export const runtime = "nodejs";

// ═══════════ Zod ═══════════

const createInput = z.object({
  gigId: z.string().uuid(),
  packageId: z.string().uuid(),
});

const listQuery = z.object({
  role: z.enum(["buyer", "seller"]).optional(),
  status: z
    .enum([
      "PENDING_PAYMENT",
      "AWAITING_REQUIREMENTS",
      "IN_PROGRESS",
      "DELIVERED",
      "REVISION_REQUESTED",
      "ACCEPTED",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// حقول عرض القائمة — بلا تفاصيل حسّاسة.
const listSelect = {
  id: true,
  reference: true,
  status: true,
  amountMinor: true,
  currency: true,
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
      deliveryDays: true,
      revisions: true,
    },
  },
  buyer: {
    select: { id: true, name: true, avatarLetter: true },
  },
  seller: {
    select: { id: true, name: true, avatarLetter: true },
  },
} satisfies Prisma.OrderSelect;

// ═══════════ GET — طلبات المستخدم الحالي ═══════════

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const parsed = listQuery.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "معاملات غير صالحة" },
      { status: 400 },
    );
  }
  const { role, status, limit } = parsed.data;

  const where: Prisma.OrderWhereInput = {};
  if (role === "buyer") where.buyerId = user.id;
  else if (role === "seller") where.sellerId = user.id;
  // بلا role: نجلب كل الطلبات التي المستخدم طرف فيها.
  else where.OR = [{ buyerId: user.id }, { sellerId: user.id }];
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    select: listSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ orders });
}

// ═══════════ POST — إنشاء طلب ═══════════

export async function POST(req: NextRequest) {
  // CLAUDE.md #2
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json(
      { error: "يجب تسجيل الدخول لإنشاء طلب" },
      { status: 401 },
    );
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
  const { gigId, packageId } = parsed.data;

  // نجلب الخدمة والباقة معاً ونتحقّق من الملكية والانتماء.
  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    select: {
      id: true,
      gigId: true,
      priceMinor: true,
      currency: true,
      deliveryDays: true,
      gig: {
        select: {
          id: true,
          sellerId: true,
          status: true,
        },
      },
    },
  });

  if (!pkg || pkg.gigId !== gigId) {
    // نعيد 404 لا 400 حتى لا نكشف بنية DB.
    return NextResponse.json(
      { error: "الخدمة أو الباقة غير موجودة" },
      { status: 404 },
    );
  }

  if (pkg.gig.status !== "PUBLISHED") {
    return NextResponse.json(
      { error: "لا يمكن طلب خدمة غير منشورة" },
      { status: 400 },
    );
  }

  // CLAUDE.md-like: لا يشتري المستخدم خدمته الخاصة.
  if (pkg.gig.sellerId === user.id) {
    return NextResponse.json(
      { error: "لا يمكنك شراء خدمتك الخاصة" },
      { status: 400 },
    );
  }

  // ═══ إنشاء ذرّي: Order + OrderEvent("created") في معاملة واحدة ═══
  // ملاحظة: نتخطّى PENDING_PAYMENT (الدفع سيُربَط لاحقاً).
  // نبدأ من AWAITING_REQUIREMENTS كما نصّت الوثيقة والمهمّة.
  let attempts = 0;
  while (attempts < 3) {
    attempts += 1;
    const reference = makeOrderReference();
    try {
      const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
          data: {
            reference,
            gigId,
            packageId,
            buyerId: user.id,
            sellerId: pkg.gig.sellerId,
            // amountMinor نسخة وقت الطلب (لا يتغيّر إن غيّر البائع السعر).
            amountMinor: pkg.priceMinor,
            currency: pkg.currency,
            status: "AWAITING_REQUIREMENTS",
          },
          select: { id: true, reference: true },
        });
        await tx.orderEvent.create({
          data: {
            orderId: created.id,
            type: "created",
            actorId: user.id,
            payload: {
              amountMinor: pkg.priceMinor,
              currency: pkg.currency,
            },
          },
        });
        return created;
      });

      return NextResponse.json(
        { orderId: order.id, reference: order.reference },
        { status: 201 },
      );
    } catch (e) {
      // تصادم reference نادر — أعِد المحاولة برقم جديد.
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        continue;
      }
      console.error("order create error:", e);
      return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: "تعذّر توليد مرجع فريد. حاول مرة أخرى." },
    { status: 500 },
  );
}
