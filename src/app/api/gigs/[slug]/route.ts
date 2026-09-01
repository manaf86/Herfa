import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const detailSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  categoryId: true,
  serviceType: true,
  tags: true,
  status: true,
  aiDisclosure: true,
  coverImage: true,
  gallery: true,
  deliverables: true,
  faqs: true,
  requirements: true,
  rejectionNote: true,
  createdAt: true,
  updatedAt: true,
  sellerId: true,
  seller: {
    select: { id: true, name: true, avatarLetter: true },
  },
  packages: {
    orderBy: { priceMinor: "asc" as const },
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
};

type RouteContext = { params: Promise<{ slug: string }> };

// ═══════════ GET /api/gigs/[slug] ═══════════

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;

  const gig = await prisma.gig.findUnique({
    where: { slug },
    select: detailSelect,
  });

  if (!gig) {
    return NextResponse.json(
      { error: "الخدمة غير موجودة" },
      { status: 404 },
    );
  }

  // خدمة غير منشورة → للمالك فقط.
  if (gig.status !== "PUBLISHED") {
    const user = await getCurrentUser(_req.headers.get("cookie"));
    if (!user || user.id !== gig.sellerId) {
      return NextResponse.json(
        { error: "الخدمة غير موجودة" },
        { status: 404 },
      );
    }
  }

  return NextResponse.json({ gig });
}

// ═══════════ PATCH /api/gigs/[slug] — تغيير الحالة ═══════════

const patchInput = z.object({
  status: z.enum(["PUBLISHED", "PAUSED"]),
});

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json(
      { error: "يجب تسجيل الدخول" },
      { status: 401 },
    );
  }

  const { slug } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const parsed = patchInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 },
    );
  }

  // CLAUDE.md #2: تحقّق الملكية على الخادم — لا نثق بمن يستدعي API.
  const existing = await prisma.gig.findUnique({
    where: { slug },
    select: { id: true, sellerId: true, status: true },
  });
  if (!existing) {
    return NextResponse.json(
      { error: "الخدمة غير موجودة" },
      { status: 404 },
    );
  }
  if (existing.sellerId !== user.id) {
    // نُعيد 404 لا 403 حتى لا نكشف وجود slugs لغير المالك.
    return NextResponse.json(
      { error: "الخدمة غير موجودة" },
      { status: 404 },
    );
  }

  // انتقالات مسموحة عبر هذا المسار: PUBLISHED ↔ PAUSED فقط.
  // DRAFT → PENDING_REVIEW عبر /submit، وPENDING_REVIEW → PUBLISHED/REJECTED عبر /review
  // (لوحة مراجعة الإدارة) — كلاهما مسار مقصود منفصل، لا هذا المسار العام.
  const allowed: Record<string, string[]> = {
    PUBLISHED: ["PAUSED"],
    PAUSED: ["PUBLISHED"],
  };
  if (
    existing.status !== parsed.data.status &&
    !allowed[existing.status]?.includes(parsed.data.status)
  ) {
    return NextResponse.json(
      { error: `لا يمكن نقل الحالة من ${existing.status} إلى ${parsed.data.status}` },
      { status: 400 },
    );
  }

  const gig = await prisma.gig.update({
    where: { id: existing.id },
    data: { status: parsed.data.status },
    select: detailSelect,
  });

  return NextResponse.json({ gig });
}
