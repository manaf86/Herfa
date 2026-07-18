// TODO: تُستبدل ببيانات حقيقية من قاعدة البيانات لاحقاً.
// المرجع: docs/spec/01-order-lifecycle.md — الحالات والأحداث.

export type OrderStatus =
  | "active"           // AWAITING_REQUIREMENTS / IN_PROGRESS
  | "awaiting-delivery" // DELIVERED (مشترٍ ينتظر مراجعته)
  | "completed"         // ACCEPTED / COMPLETED
  | "cancelled"         // CANCELLED
  | "disputed";         // DISPUTED

export type MyRole = "buyer" | "seller";

export type Order = {
  id: string;              // #HRF-2026-XXXX
  serviceTitle: string;
  otherParty: string;      // اسم الطرف الآخر (بائع أو مشترٍ)
  myRole: MyRole;
  amount: number;
  amountDisplay: string;
  orderedAt: string;        // نص عرض
  /** ISO لغرض حساب العدّاد. */
  deliveryDueAt: string;
  deliveryLabel: string;
  revisionsLeft: number;
  status: OrderStatus;
};

// لتغذية العدّاد التنازلي بمواعيد مستقبلية دون كسر عرض التواريخ.
// نُنشئها ديناميكياً من "الآن" لتبقى معقولة كلما فتح المستخدم الصفحة.
const now = new Date();
function futureIso(daysAhead: number, hoursAhead = 0): string {
  const d = new Date(now.getTime());
  d.setDate(d.getDate() + daysAhead);
  d.setHours(d.getHours() + hoursAhead);
  return d.toISOString();
}
function pastIso(daysAgo: number): string {
  const d = new Date(now.getTime());
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const orders: Order[] = [
  // ── نشطة (2) ─────────────────────────────────────────
  {
    id: "#HRF-2026-0041",
    serviceTitle: "تصميم هوية بصرية لمتجر سنابل",
    otherParty: "سارة العتيبي",
    myRole: "buyer",
    amount: 900,
    amountDisplay: "900 ر.س",
    orderedAt: "13 يوليو 2026",
    deliveryDueAt: futureIso(2, 6),
    deliveryLabel: "بعد يومين",
    revisionsLeft: 3,
    status: "active",
  },
  {
    id: "#HRF-2026-0040",
    serviceTitle: "تطوير متجر إلكتروني بـ Shopify",
    otherParty: "شركة نون التجارية",
    myRole: "seller",
    amount: 3200,
    amountDisplay: "3,200 ر.س",
    orderedAt: "10 يوليو 2026",
    deliveryDueAt: futureIso(4, 3),
    deliveryLabel: "بعد 4 أيام",
    revisionsLeft: 2,
    status: "active",
  },

  // ── بانتظار التسليم (2) — أنا المشتري وأنتظر البائع يسلّم ─
  {
    id: "#HRF-2026-0039",
    serviceTitle: "كتابة محتوى موقع تسويقي",
    otherParty: "نورة الحربي",
    myRole: "buyer",
    amount: 750,
    amountDisplay: "750 ر.س",
    orderedAt: "8 يوليو 2026",
    deliveryDueAt: pastIso(0),
    deliveryLabel: "سُلّم اليوم",
    revisionsLeft: 4,
    status: "awaiting-delivery",
  },
  {
    id: "#HRF-2026-0038",
    serviceTitle: "تصميم قائمة طعام مطعم السرايا",
    otherParty: "أنس المصري",
    myRole: "buyer",
    amount: 480,
    amountDisplay: "480 ر.س",
    orderedAt: "6 يوليو 2026",
    deliveryDueAt: pastIso(1),
    deliveryLabel: "سُلّم قبل يوم",
    revisionsLeft: 1,
    status: "awaiting-delivery",
  },

  // ── مكتملة (2) ─────────────────────────────────────
  {
    id: "#HRF-2026-0036",
    serviceTitle: "تصميم منشورات إعلامية لعيادة نور",
    otherParty: "ريم العجمي",
    myRole: "buyer",
    amount: 620,
    amountDisplay: "620 ر.س",
    orderedAt: "28 يونيو 2026",
    deliveryDueAt: pastIso(9),
    deliveryLabel: "9 يوليو",
    revisionsLeft: 0,
    status: "completed",
  },
  {
    id: "#HRF-2026-0034",
    serviceTitle: "ترجمة عقد قانوني عربي-إنجليزي",
    otherParty: "مي القحطاني",
    myRole: "buyer",
    amount: 240,
    amountDisplay: "240 ر.س",
    orderedAt: "20 يونيو 2026",
    deliveryDueAt: pastIso(20),
    deliveryLabel: "29 يونيو",
    revisionsLeft: 0,
    status: "completed",
  },

  // ── ملغى (1) ───────────────────────────────────────
  {
    id: "#HRF-2026-0033",
    serviceTitle: "مونتاج فيديو قصير للسوشيال ميديا",
    otherParty: "مروان الأنصاري",
    myRole: "buyer",
    amount: 350,
    amountDisplay: "350 ر.س",
    orderedAt: "18 يونيو 2026",
    deliveryDueAt: pastIso(25),
    deliveryLabel: "أُلغي في 24 يونيو",
    revisionsLeft: 0,
    status: "cancelled",
  },

  // ── نزاع (1) ───────────────────────────────────────
  {
    id: "#HRF-2026-0032",
    serviceTitle: "تطوير صفحة هبوط بـ Next.js",
    otherParty: "لؤي القرشي",
    myRole: "buyer",
    amount: 1450,
    amountDisplay: "1,450 ر.س",
    orderedAt: "12 يونيو 2026",
    deliveryDueAt: pastIso(15),
    deliveryLabel: "4 يوليو",
    revisionsLeft: 0,
    status: "disputed",
  },
];

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; fg: string; bg: string }
> = {
  active: {
    label: "نشط",
    fg: "var(--info)",
    bg: "var(--info-tint)",
  },
  "awaiting-delivery": {
    label: "بانتظار التسليم",
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  completed: {
    label: "مكتمل",
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  cancelled: {
    label: "ملغى",
    fg: "var(--muted)",
    bg: "rgba(148,148,148,0.12)",
  },
  disputed: {
    label: "نزاع",
    fg: "var(--alert)",
    bg: "var(--alert-tint)",
  },
};

export type OrderTab = {
  key: "all" | OrderStatus;
  label: string;
};

export const ORDER_TABS: OrderTab[] = [
  { key: "all", label: "الكل" },
  { key: "active", label: "نشطة" },
  { key: "awaiting-delivery", label: "بانتظار التسليم" },
  { key: "completed", label: "مكتملة" },
  { key: "cancelled", label: "ملغاة" },
  { key: "disputed", label: "نزاع" },
];
