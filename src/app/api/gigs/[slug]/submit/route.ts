import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

// ═══════════ PATCH /api/gigs/[slug]/submit — أرسل للمراجعة (DRAFT → PENDING_REVIEW) ═══════════

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const { slug } = await ctx.params;

  const gig = await prisma.gig.findUnique({
    where: { slug },
    select: {
      id: true,
      sellerId: true,
      status: true,
      title: true,
      categoryId: true,
      description: true,
      coverImage: true,
      packages: { select: { id: true } },
    },
  });

  if (!gig || gig.sellerId !== user.id) {
    // نُعيد 404 لا 403 حتى لا نكشف وجود slugs لغير المالك.
    return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });
  }

  if (gig.status !== "DRAFT") {
    return NextResponse.json(
      { error: "لا يمكن إرسال هذه الخدمة للمراجعة من حالتها الحالية" },
      { status: 400 },
    );
  }

  // التحقّق من اكتمال الحقول المطلوبة قبل المراجعة.
  const missing: string[] = [];
  if (!gig.title || gig.title.trim().length < 10) missing.push("عنوان الخدمة");
  if (!gig.categoryId) missing.push("الفئة");
  if (!gig.description || gig.description.trim().length < 50) missing.push("الوصف");
  if (gig.packages.length < 1) missing.push("باقة واحدة على الأقل");
  if (!gig.coverImage) missing.push("صورة الغلاف");

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "الخدمة غير مكتملة", missing },
      { status: 400 },
    );
  }

  const updated = await prisma.gig.update({
    where: { id: gig.id },
    data: { status: "PENDING_REVIEW", rejectionNote: null },
    select: { id: true, slug: true, status: true },
  });

  return NextResponse.json({ gig: updated });
}
