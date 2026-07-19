import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { makeGigSlug } from "@/lib/slug";

export const runtime = "nodejs";

// ═══════════ Zod ═══════════

const packageInput = z.object({
  tier: z.enum(["BASIC", "STANDARD", "PREMIUM"]),
  title: z.string().trim().min(3).max(80),
  description: z.string().trim().min(10).max(500),
  priceMinor: z.number().int().positive().max(100_000_000), // حتى مليون ريال
  deliveryDays: z.number().int().min(1).max(90),
  revisions: z.number().int().min(0).max(99),
  features: z.array(z.string().min(1).max(120)).max(10).default([]),
});

const gigCreateInput = z.object({
  title: z.string().trim().min(10).max(100),
  description: z.string().trim().min(50).max(2000),
  categoryId: z.enum(CATEGORY_SLUGS),
  tags: z.array(z.string().min(1).max(40)).max(5).default([]),
  aiDisclosure: z
    .enum(["HUMAN", "AI_ASSISTED", "AI_GENERATED"])
    .default("HUMAN"),
  packages: z.array(packageInput).min(1).max(3),
});

const listQuery = z.object({
  category: z.enum(CATEGORY_SLUGS).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(36),
  seller: z.enum(["me"]).optional(),
});

// حقول العرض للسوق (بلا حقول حسّاسة).
const listSelect = {
  id: true,
  slug: true,
  title: true,
  categoryId: true,
  status: true,
  aiDisclosure: true,
  createdAt: true,
  updatedAt: true,
  seller: {
    select: {
      id: true,
      name: true,
      avatarLetter: true,
    },
  },
  packages: {
    orderBy: { priceMinor: Prisma.SortOrder.asc },
    take: 1,
    select: {
      tier: true,
      priceMinor: true,
      currency: true,
      deliveryDays: true,
    },
  },
  _count: { select: { packages: true } },
} satisfies Prisma.GigSelect;

// ═══════════ GET /api/gigs ═══════════

export async function GET(req: NextRequest) {
  const parsed = listQuery.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "معاملات غير صالحة" },
      { status: 400 },
    );
  }
  const { category, limit, seller } = parsed.data;

  let sellerId: string | undefined;
  let where: Prisma.GigWhereInput = { status: "PUBLISHED" };

  if (seller === "me") {
    // "خدماتي" — يحتاج مصادقة، ونُظهر كل حالات الملكية.
    const user = await getCurrentUser(req.headers.get("cookie"));
    if (!user) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول" },
        { status: 401 },
      );
    }
    sellerId = user.id;
    where = { sellerId };
  }

  if (category) where.categoryId = category;

  const gigs = await prisma.gig.findMany({
    where,
    select: listSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ gigs });
}

// ═══════════ POST /api/gigs ═══════════

export async function POST(req: NextRequest) {
  // CLAUDE.md #2: تحقّق الجلسة على الخادم.
  const user = await getCurrentUser(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json(
      { error: "يجب تسجيل الدخول لإنشاء خدمة" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  // CLAUDE.md #3: كل مدخل عبر Zod.
  const parsed = gigCreateInput.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: first?.message ?? "بيانات غير صالحة",
        field: first?.path?.join(".") ?? undefined,
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // تفرّد baقات: كل tier مرّة واحدة فقط داخل نفس الخدمة.
  const tiers = new Set(data.packages.map((p) => p.tier));
  if (tiers.size !== data.packages.length) {
    return NextResponse.json(
      { error: "لا يمكن تكرار نفس الباقة (BASIC/STANDARD/PREMIUM)" },
      { status: 400 },
    );
  }

  // نولّد slug ونعيد المحاولة إن حدث تصادم نادر (nanoid يقلّل الاحتمال).
  let attempts = 0;
  while (attempts < 3) {
    attempts += 1;
    const slug = makeGigSlug(data.title);
    try {
      const gig = await prisma.gig.create({
        data: {
          slug,
          sellerId: user.id,
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          tags: data.tags,
          aiDisclosure: data.aiDisclosure,
          status: "DRAFT",
          packages: {
            create: data.packages.map((p) => ({
              tier: p.tier,
              title: p.title,
              description: p.description,
              priceMinor: p.priceMinor,
              deliveryDays: p.deliveryDays,
              revisions: p.revisions,
              features: p.features,
            })),
          },
        },
        select: listSelect,
      });
      return NextResponse.json({ gig }, { status: 201 });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        // تصادم slug — أعِد المحاولة بمُعرّف جديد.
        continue;
      }
      console.error("gig create error:", e);
      return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: "تعذّر توليد رابط فريد. حاول مرة أخرى." },
    { status: 500 },
  );
}
