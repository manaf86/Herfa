// حِرفة — بيانات تجريبية لدفتر المال (LedgerEntry).
// يُشغَّل: node prisma/seed-ledger.mjs
//
// idempotent: كل صف بمفتاح تفرّد (idempotencyKey) — إعادة التشغيل آمنة.
// المرجع: CLAUDE.md §القاعدة 4 + §القاعدة 14.
//
// الفلسفة: كل صف "دلتا" — موجب = دخول، سالب = خروج من الحالة.
// رصيد المستخدم في حالة X = SUM(amountMinor WHERE state=X).
// الانتقال بين حالتين = صفّان (سالب في القديمة + موجب في الجديدة) بنفس المرجع.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COMMISSION_RATE = 0.15;
const CLEAR_DAYS = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

function toSar(minor) {
  return (minor / 100).toLocaleString("en-US");
}

async function main() {
  const seller = await prisma.user.findUnique({
    where: { email: "manaf.test@herfa.dev" },
  });
  const buyer = await prisma.user.findUnique({
    where: { email: "other@test.dev" },
  });
  if (!seller || !buyer) {
    throw new Error(
      "لم يُعثر على المستخدمين التجريبيّين. سجّل manaf.test@herfa.dev و other@test.dev أولاً.",
    );
  }

  const orders = await prisma.order.findMany({
    where: { sellerId: seller.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      reference: true,
      status: true,
      amountMinor: true,
      createdAt: true,
      deliveredAt: true,
      acceptedAt: true,
    },
  });
  console.log(`📦 عُثر على ${orders.length} طلب للبائع ${seller.name}`);

  const entries = [];

  for (const o of orders) {
    const gross = o.amountMinor;
    const commission = Math.round(gross * COMMISSION_RATE);
    const net = gross - commission;

    // ── 1) دفع المشتري → دخول إلى IN_ESCROW ─────────────────
    // نُقدّر لحظة الدفع بلحظة إنشاء الطلب (في MVP لا فارق).
    entries.push({
      orderId: o.id,
      userId: seller.id,
      type: "ESCROW_HOLD",
      state: "IN_ESCROW",
      amountMinor: gross,
      idempotencyKey: `${o.id}:escrow-hold`,
      note: `دفع المشتري ${toSar(gross)} ر.س — محجوز في الخزنة`,
      createdAt: o.createdAt,
    });

    // للحالات النشطة: يبقى المال في الخزنة، لا حركات أخرى.
    if (
      o.status === "AWAITING_REQUIREMENTS" ||
      o.status === "IN_PROGRESS" ||
      o.status === "DELIVERED" ||
      o.status === "REVISION_REQUESTED"
    ) {
      continue;
    }

    // ── إلغاء قبل بدء العمل: استرداد كامل للمشتري ────────────
    if (o.status === "CANCELLED") {
      // خروج من IN_ESCROW
      entries.push({
        orderId: o.id,
        userId: seller.id,
        type: "REFUND",
        state: "IN_ESCROW",
        amountMinor: -gross,
        idempotencyKey: `${o.id}:refund-out-escrow`,
        note: "إلغاء الطلب — خروج من الخزنة",
        createdAt: o.createdAt,
      });
      // استرداد للمشتري (نسجّله على المشتري)
      entries.push({
        orderId: o.id,
        userId: buyer.id,
        type: "REFUND",
        state: "REVERSED",
        amountMinor: gross,
        idempotencyKey: `${o.id}:refund-buyer`,
        note: "استرداد كامل بعد إلغاء الطلب قبل بدء العمل",
        createdAt: o.createdAt,
      });
      continue;
    }

    // ── 2) اعتماد → خروج من الخزنة، دخول PENDING_CLEARANCE ─
    if (!o.acceptedAt) continue;

    entries.push({
      orderId: o.id,
      userId: seller.id,
      type: "ESCROW_RELEASE",
      state: "IN_ESCROW",
      amountMinor: -gross,
      idempotencyKey: `${o.id}:release-out-escrow`,
      note: "اعتماد العميل — خروج من الخزنة",
      createdAt: o.acceptedAt,
    });
    entries.push({
      orderId: o.id,
      userId: seller.id,
      type: "ESCROW_RELEASE",
      state: "PENDING_CLEARANCE",
      amountMinor: gross,
      idempotencyKey: `${o.id}:release-into-pending`,
      note: "دخول التصفية — 5 أيام قبل السحب (§#12)",
      createdAt: o.acceptedAt,
    });
    // العمولة تُخصم من PENDING_CLEARANCE في نفس اللحظة
    entries.push({
      orderId: o.id,
      userId: seller.id,
      type: "COMMISSION",
      state: "PENDING_CLEARANCE",
      amountMinor: -commission,
      idempotencyKey: `${o.id}:commission`,
      note: `عمولة حِرفة ${Math.round(COMMISSION_RATE * 100)}٪`,
      createdAt: o.acceptedAt,
    });

    // ── 3) إن مرّت 5 أيام: PENDING → AVAILABLE ──────────────
    const daysSince = Math.floor(
      (Date.now() - o.acceptedAt.getTime()) / DAY_MS,
    );
    if (daysSince >= CLEAR_DAYS) {
      const clearedAt = new Date(o.acceptedAt.getTime() + CLEAR_DAYS * DAY_MS);
      entries.push({
        orderId: o.id,
        userId: seller.id,
        type: "ESCROW_RELEASE",
        state: "PENDING_CLEARANCE",
        amountMinor: -net,
        idempotencyKey: `${o.id}:cleared-out-pending`,
        note: "انتهت نافذة التصفية",
        createdAt: clearedAt,
      });
      entries.push({
        orderId: o.id,
        userId: seller.id,
        type: "ESCROW_RELEASE",
        state: "AVAILABLE",
        amountMinor: net,
        idempotencyKey: `${o.id}:cleared-into-available`,
        note: "متاح للسحب",
        createdAt: clearedAt,
      });
    }
  }

  // ═════════════ سيناريو تاريخي (بلا orderId) ═════════════

  // (٠) ثلاث طلبات قديمة أُقفلت — رصيد متاح تراكمي:
  //     نُدخلها مباشرة إلى AVAILABLE (تخطّي المراحل لأنها قديمة).
  const historical = [
    { grossMinor: 200000, days: 40, note: "طلب قديم — تصميم شعار كافيه الأصيل" },
    { grossMinor: 150000, days: 30, note: "طلب قديم — كتابة محتوى مدوّنة نور" },
    { grossMinor: 300000, days: 20, note: "طلب قديم — موقع عيادة الشفاء" },
  ];
  for (const [i, h] of historical.entries()) {
    const net = h.grossMinor - Math.round(h.grossMinor * COMMISSION_RATE);
    entries.push({
      userId: seller.id,
      type: "ESCROW_RELEASE",
      state: "AVAILABLE",
      amountMinor: net,
      idempotencyKey: `seed:historical-${i}:cleared-to-available`,
      note: h.note,
      createdAt: new Date(Date.now() - h.days * DAY_MS),
    });
  }

  // (أ) سحب بنكي قديم — 3,000 ر.س
  const payoutDate = new Date(Date.now() - 10 * DAY_MS);
  entries.push({
    userId: seller.id,
    type: "PAYOUT",
    state: "AVAILABLE",
    amountMinor: -300000,
    idempotencyKey: "seed:payout-2026-07-09:out-available",
    note: "خروج من الرصيد المتاح بسبب طلب سحب",
    createdAt: payoutDate,
  });
  entries.push({
    userId: seller.id,
    type: "PAYOUT",
    state: "WITHDRAWN",
    amountMinor: 300000,
    providerRef: "NCB-XXXXXX1234",
    idempotencyKey: "seed:payout-2026-07-09:withdrawn",
    note: "سحب إلى حساب البنك الأهلي — تم بنجاح",
    createdAt: payoutDate,
  });

  // (ب) Chargeback + Seller Protection (§#14) — طلب قديم 850 ر.س
  const cbDate = new Date(Date.now() - 30 * DAY_MS);
  entries.push({
    userId: seller.id,
    type: "CHARGEBACK",
    state: "REVERSED",
    amountMinor: -85000,
    providerRef: "MOYASAR-CB-2026-06-11",
    idempotencyKey: "seed:chargeback-2026-06-11",
    note: "اعتراض بطاقي من بنك المشتري — طلب قديم",
    createdAt: cbDate,
  });
  // §القاعدة 14: لا نسترد من رصيد البائع — صندوق الحماية يعوّضه.
  entries.push({
    userId: seller.id,
    type: "SELLER_PROTECTION",
    state: "AVAILABLE",
    amountMinor: 85000,
    idempotencyKey: "seed:seller-protection-2026-06-11",
    note: "تعويض من صندوق حماية البائع (§CLAUDE.md #14)",
    createdAt: cbDate,
  });

  // ═════════════ الكتابة ═════════════
  const result = await prisma.ledgerEntry.createMany({
    data: entries,
    skipDuplicates: true,
  });
  console.log(
    `✍️  كُتب ${result.count} صف (تخطّي التكرار بـ idempotencyKey).`,
  );

  // ═════════════ عرض الأرصدة ═════════════
  console.log(`\n💰 رصيد ${seller.name}`);
  const rows = await prisma.ledgerEntry.groupBy({
    by: ["state"],
    where: { userId: seller.id },
    _sum: { amountMinor: true },
    _count: { _all: true },
  });
  const order = [
    "IN_ESCROW",
    "PENDING_CLEARANCE",
    "AVAILABLE",
    "WITHDRAWN",
    "REVERSED",
  ];
  for (const s of order) {
    const row = rows.find((r) => r.state === s);
    const minor = row?._sum.amountMinor ?? 0;
    const count = row?._count._all ?? 0;
    console.log(
      `   ${s.padEnd(18)} = ${toSar(minor).padStart(10)} ر.س   (${count} صف)`,
    );
  }

  const byType = await prisma.ledgerEntry.groupBy({
    by: ["type"],
    where: { userId: seller.id },
    _count: { _all: true },
  });
  console.log(`\n📊 عدد الصفوف حسب النوع:`);
  for (const r of byType) {
    console.log(`   ${r.type.padEnd(20)} = ${r._count._all}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
