import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

const reviewInput = z
  .object({
    action: z.enum(["approve", "reject"]),
    note: z.string().trim().max(500).optional(),
  })
  .refine((d) => d.action !== "reject" || (d.note?.length ?? 0) >= 5, {
    message: "سبب الرفض مطلوب (5 أحرف على الأقل)",
    path: ["note"],
  });

// ═══════════ PATCH /api/gigs/[slug]/review — اعتماد أو رفض (لوحة الإدارة) ═══════════
// TODO: قيّد هذا المسار بدور ADMIN حين يُضاف نظام الأدوار — مؤقتاً أي مستخدم مسجّل يصله.

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const { slug } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const parsed = reviewInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 },
    );
  }

  const gig = await prisma.gig.findUnique({
    where: { slug },
    select: { id: true, status: true },
  });
  if (!gig) {
    return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });
  }
  if (gig.status !== "PENDING_REVIEW") {
    return NextResponse.json(
      { error: "الخدمة ليست قيد المراجعة" },
      { status: 400 },
    );
  }

  const { action, note } = parsed.data;

  const updated = await prisma.gig.update({
    where: { id: gig.id },
    data:
      action === "approve"
        ? { status: "PUBLISHED", rejectionNote: null }
        : { status: "REJECTED", rejectionNote: note },
    select: { id: true, slug: true, status: true, rejectionNote: true },
  });

  return NextResponse.json({ gig: updated });
}
