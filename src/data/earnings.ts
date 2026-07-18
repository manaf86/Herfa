// TODO: تُستبدل ببيانات حقيقية من قاعدة البيانات لاحقاً.
// المرجع: docs/spec/01-order-lifecycle.md — مسار المال:
// ESCROW_HOLD → (بعد القبول) PENDING_CLEARANCE (5 أيام) → AVAILABLE

// ═══════════ أرصدة عليا ═══════════
export const balances = {
  available: { value: 3200, display: "3,200 ر.س" },
  inEscrow: { value: 8450, display: "8,450 ر.س" },
  pendingClearance: { value: 1800, display: "1,800 ر.س" },
  earnedThisMonth: { value: 13450, display: "13,450 ر.س" },
};

// ═══════════ مخطط الأرباح الشهرية (آخر 6 أشهر) ═══════════
export type MonthBar = {
  key: string;
  label: string;
  value: number;
  display: string;
  current?: boolean;
};

export const monthlyEarnings: MonthBar[] = [
  { key: "feb", label: "فبراير", value: 4200, display: "4,200 ر.س" },
  { key: "mar", label: "مارس", value: 6800, display: "6,800 ر.س" },
  { key: "apr", label: "أبريل", value: 5100, display: "5,100 ر.س" },
  { key: "may", label: "مايو", value: 9300, display: "9,300 ر.س" },
  { key: "jun", label: "يونيو", value: 11200, display: "11,200 ر.س" },
  { key: "jul", label: "يوليو", value: 13450, display: "13,450 ر.س", current: true },
];

// ═══════════ سجل المعاملات ═══════════
export type TransactionType =
  | "escrow-deposit"     // إيداع خزنة
  | "milestone-release"  // إفراج
  | "withdrawal"         // سحب
  | "commission";        // عمولة المنصة

export type TransactionStatus = "completed" | "in-escrow" | "processing";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  amount: number;
  amountDisplay: string; // "+2,500 ر.س" أو "-275 ر.س"
  status: TransactionStatus;
};

export const TRANSACTION_TYPE_META: Record<
  TransactionType,
  { label: string; fg: string; bg: string }
> = {
  "escrow-deposit": {
    label: "إيداع خزنة",
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  "milestone-release": {
    label: "إفراج معلم",
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  withdrawal: {
    label: "سحب",
    fg: "var(--info)",
    bg: "var(--info-tint)",
  },
  commission: {
    label: "عمولة",
    fg: "var(--muted)",
    bg: "rgba(148,148,148,0.12)",
  },
};

export const TRANSACTION_STATUS_META: Record<
  TransactionStatus,
  { label: string; fg: string; bg: string }
> = {
  completed: {
    label: "مكتمل",
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  "in-escrow": {
    label: "في الخزنة",
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  processing: {
    label: "قيد المعالجة",
    fg: "var(--info)",
    bg: "var(--info-tint)",
  },
};

export const transactions: Transaction[] = [
  {
    id: "tx-100",
    date: "18 يوليو",
    description: "هوية متجر سنابل — إفراج معلم 2",
    type: "milestone-release",
    amount: 2500,
    amountDisplay: "+2,500 ر.س",
    status: "completed",
  },
  {
    id: "tx-099",
    date: "18 يوليو",
    description: "عمولة حِرفة (11٪) — إفراج معلم سنابل",
    type: "commission",
    amount: -275,
    amountDisplay: "-275 ر.س",
    status: "completed",
  },
  {
    id: "tx-098",
    date: "15 يوليو",
    description: "متجر نون — إيداع خزنة (هوية بصرية)",
    type: "escrow-deposit",
    amount: 3200,
    amountDisplay: "+3,200 ر.س",
    status: "in-escrow",
  },
  {
    id: "tx-097",
    date: "13 يوليو",
    description: "هوية متجر سنابل — إفراج معلم 1",
    type: "milestone-release",
    amount: 1000,
    amountDisplay: "+1,000 ر.س",
    status: "completed",
  },
  {
    id: "tx-096",
    date: "13 يوليو",
    description: "عمولة حِرفة (11٪) — معلم 1",
    type: "commission",
    amount: -110,
    amountDisplay: "-110 ر.س",
    status: "completed",
  },
  {
    id: "tx-095",
    date: "10 يوليو",
    description: "سحب إلى حساب البنك — الأهلي xxxx1234",
    type: "withdrawal",
    amount: -3000,
    amountDisplay: "-3,000 ر.س",
    status: "completed",
  },
  {
    id: "tx-094",
    date: "8 يوليو",
    description: "تصميم شركة نون — إيداع خزنة",
    type: "escrow-deposit",
    amount: 1200,
    amountDisplay: "+1,200 ر.س",
    status: "in-escrow",
  },
  {
    id: "tx-093",
    date: "5 يوليو",
    description: "عيادة نور — إفراج نهائي",
    type: "milestone-release",
    amount: 620,
    amountDisplay: "+620 ر.س",
    status: "completed",
  },
  {
    id: "tx-092",
    date: "5 يوليو",
    description: "عمولة حِرفة (12٪) — عيادة نور",
    type: "commission",
    amount: -74,
    amountDisplay: "-74 ر.س",
    status: "completed",
  },
  {
    id: "tx-091",
    date: "2 يوليو",
    description: "أكاديمية سطر — إفراج نهائي",
    type: "milestone-release",
    amount: 1800,
    amountDisplay: "+1,800 ر.س",
    status: "processing",
  },
];

export const earningsTip = {
  text: "عملاؤك المتكرّرون يخفّضون عمولتك — من 15٪ إلى 10٪ بعد 500 ر.س معهم.",
};
