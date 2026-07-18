// TODO: تُستبدل ببيانات حقيقية من قاعدة البيانات لاحقاً.
// مساحة العمل — رؤية المرحلة الثانية (كانبان + معالم مالية مربوطة بالخزنة).
// المرجع: docs/spec/site-flow.md + docs/spec/01-order-lifecycle.md

// ═══════════ الطلب المفتوح ═══════════
export type WorkspaceOrder = {
  id: string;
  title: string;
  client: string;
  seller: { name: string; initial: string };
  totalValue: number;
  totalDisplay: string;
};

export const workspaceOrder: WorkspaceOrder = {
  id: "HRF-2026-0041",
  title: "هوية متجر سنابل — التصميم والتطوير الكامل",
  client: "متجر ألبان سنابل",
  seller: { name: "سارة العتيبي", initial: "س" },
  totalValue: 9000,
  totalDisplay: "9,000 ر.س",
};

// ═══════════ المعالم المالية (4) ═══════════
export type MilestoneState = "released" | "in-escrow" | "upcoming";

export type Milestone = {
  id: string;
  name: string;
  amount: number;
  amountDisplay: string;
  state: MilestoneState;
};

export const milestones: Milestone[] = [
  {
    id: "m1",
    name: "المخطط الأولي",
    amount: 1000,
    amountDisplay: "1,000 ر.س",
    state: "released",
  },
  {
    id: "m2",
    name: "مرحلة التصميم",
    amount: 2500,
    amountDisplay: "2,500 ر.س",
    state: "released",
  },
  {
    id: "m3",
    name: "مرحلة التطوير",
    amount: 3500,
    amountDisplay: "3,500 ر.س",
    state: "in-escrow",
  },
  {
    id: "m4",
    name: "التسليم النهائي",
    amount: 2000,
    amountDisplay: "2,000 ر.س",
    state: "upcoming",
  },
];

// ═══════════ الكانبان: 4 أعمدة ═══════════
export type ColumnKey = "in-progress" | "review" | "revisions" | "done";

export const KANBAN_COLUMNS: {
  key: ColumnKey;
  label: string;
  /** حدّ العمل الجاري (WIP) — إرشادي لتفادي التكدّس. */
  wipLimit: number;
}[] = [
  { key: "in-progress", label: "قيد التنفيذ", wipLimit: 4 },
  { key: "review", label: "مراجعة العميل", wipLimit: 3 },
  { key: "revisions", label: "تعديلات", wipLimit: 2 },
  { key: "done", label: "مكتمل", wipLimit: 999 },
];

// ═══════════ الفئات + الأولويّات ═══════════
export type TaskCategory = "design" | "web" | "content" | "video";
export type TaskPriority = "high" | "medium" | "low";

export const CATEGORY_META: Record<
  TaskCategory,
  { label: string; fg: string; bg: string }
> = {
  design: { label: "تصميم", fg: "var(--accent)", bg: "var(--accent-tint)" },
  web: { label: "ويب", fg: "var(--info)", bg: "var(--info-tint)" },
  content: { label: "محتوى", fg: "var(--success)", bg: "var(--success-tint)" },
  video: { label: "فيديو", fg: "var(--warn)", bg: "var(--warn-tint)" },
};

export const PRIORITY_META: Record<
  TaskPriority,
  { label: string; color: string }
> = {
  high: { label: "عالية", color: "var(--alert)" },
  medium: { label: "متوسطة", color: "var(--accent)" },
  low: { label: "منخفضة", color: "var(--muted)" },
};

// ═══════════ المهام + المهام الفرعية + التعليقات + الملفات ═══════════
export type Subtask = { id: string; label: string; done: boolean };
export type FileVersion = {
  id: string;
  name: string;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
};
export type Comment = {
  id: string;
  author: string;
  initial: string;
  text: string;
  timeAgo: string;
};

export type Task = {
  id: string;
  title: string;
  column: ColumnKey;
  category: TaskCategory;
  priority: TaskPriority;
  assignee: { name: string; initial: string };
  dueDate: string;   // نص عرض
  milestoneId: string;
  subtasks: Subtask[];
  files: FileVersion[];
  comments: Comment[];
};

// عشر مهام موزّعة على الأعمدة الأربعة.
export const tasks: Task[] = [
  // ── قيد التنفيذ (4) ───────────────────────────────────
  {
    id: "task-1",
    title: "تطوير صفحة المنتجات على المتجر",
    column: "in-progress",
    category: "web",
    priority: "high",
    assignee: { name: "خالد منصور", initial: "خ" },
    dueDate: "22 يوليو",
    milestoneId: "m3",
    subtasks: [
      { id: "st1a", label: "بناء شبكة عرض المنتجات", done: true },
      { id: "st1b", label: "تفاصيل المنتج والصور المكبّرة", done: true },
      { id: "st1c", label: "زر الإضافة للسلة + تنبيه", done: false },
      { id: "st1d", label: "تجربة على 3 مقاسات شاشة", done: false },
    ],
    files: [
      {
        id: "f1",
        name: "products-v1.zip",
        version: "v1",
        uploadedBy: "خالد منصور",
        uploadedAt: "18 يوليو",
      },
      {
        id: "f2",
        name: "products-v2.zip",
        version: "v2",
        uploadedBy: "خالد منصور",
        uploadedAt: "19 يوليو",
      },
    ],
    comments: [
      {
        id: "c1",
        author: "أحمد الغامدي",
        initial: "أ",
        text: "هل تفاصيل المنتج تدعم أكثر من صورة؟",
        timeAgo: "قبل يومين",
      },
      {
        id: "c2",
        author: "خالد منصور",
        initial: "خ",
        text: "نعم، معرض بمصغّرات + زووم عند النقر.",
        timeAgo: "قبل يومين",
      },
    ],
  },
  {
    id: "task-2",
    title: "كتابة نصوص صفحة الرئيسية والفوتر",
    column: "in-progress",
    category: "content",
    priority: "medium",
    assignee: { name: "نورة الحربي", initial: "ن" },
    dueDate: "21 يوليو",
    milestoneId: "m3",
    subtasks: [
      { id: "st2a", label: "الترحيب والوعد الأساسي", done: true },
      { id: "st2b", label: "أقسام الميزات الثلاث", done: false },
      { id: "st2c", label: "دعوة للتواصل في الفوتر", done: false },
    ],
    files: [
      {
        id: "f3",
        name: "homepage-copy-draft.docx",
        version: "v1",
        uploadedBy: "نورة الحربي",
        uploadedAt: "17 يوليو",
      },
    ],
    comments: [
      {
        id: "c3",
        author: "نورة الحربي",
        initial: "ن",
        text: "أول مسودّة للترحيب مرفقة. رأيك بالنبرة؟",
        timeAgo: "قبل 3 أيام",
      },
    ],
  },
  {
    id: "task-3",
    title: "إعداد قاعدة بيانات المنتجات على Supabase",
    column: "in-progress",
    category: "web",
    priority: "high",
    assignee: { name: "لؤي القرشي", initial: "ل" },
    dueDate: "20 يوليو",
    milestoneId: "m3",
    subtasks: [
      { id: "st3a", label: "مخطط الجداول (products, orders)", done: true },
      { id: "st3b", label: "سياسات RLS للأمان", done: false },
      { id: "st3c", label: "تعبئة 20 منتجاً تجريبياً", done: false },
    ],
    files: [],
    comments: [],
  },
  {
    id: "task-4",
    title: "فيديو ترويجي قصير للمنتجات (15 ثانية)",
    column: "in-progress",
    category: "video",
    priority: "low",
    assignee: { name: "فيصل التركي", initial: "ف" },
    dueDate: "25 يوليو",
    milestoneId: "m4",
    subtasks: [
      { id: "st4a", label: "سيناريو + storyboard", done: false },
      { id: "st4b", label: "التصوير الميداني", done: false },
    ],
    files: [],
    comments: [],
  },

  // ── مراجعة العميل (2) ─────────────────────────────────
  {
    id: "task-5",
    title: "الشعار النهائي بصيغ متعدّدة",
    column: "review",
    category: "design",
    priority: "high",
    assignee: { name: "سارة العتيبي", initial: "س" },
    dueDate: "18 يوليو",
    milestoneId: "m2",
    subtasks: [
      { id: "st5a", label: "SVG + PNG + PDF", done: true },
      { id: "st5b", label: "نسخة أحادية اللون", done: true },
      { id: "st5c", label: "دليل الاستخدام (صفحتان)", done: true },
    ],
    files: [
      {
        id: "f4",
        name: "logo-final-package.zip",
        version: "v3",
        uploadedBy: "سارة العتيبي",
        uploadedAt: "17 يوليو",
      },
    ],
    comments: [
      {
        id: "c4",
        author: "سارة العتيبي",
        initial: "س",
        text: "الحزمة النهائية جاهزة للاعتماد.",
        timeAgo: "قبل يوم",
      },
      {
        id: "c5",
        author: "أحمد الغامدي",
        initial: "أ",
        text: "أراجع الليلة وأعتمد أو أطلب تعديلاً بسيطاً.",
        timeAgo: "قبل 12 ساعة",
      },
    ],
  },
  {
    id: "task-6",
    title: "نظام الألوان + الخطوط الرسمية",
    column: "review",
    category: "design",
    priority: "medium",
    assignee: { name: "سارة العتيبي", initial: "س" },
    dueDate: "18 يوليو",
    milestoneId: "m2",
    subtasks: [
      { id: "st6a", label: "لوحة الألوان الأساسية والثانوية", done: true },
      { id: "st6b", label: "أحجام الخطوط + الاستخدام", done: true },
    ],
    files: [
      {
        id: "f5",
        name: "brand-system.pdf",
        version: "v2",
        uploadedBy: "سارة العتيبي",
        uploadedAt: "16 يوليو",
      },
    ],
    comments: [
      {
        id: "c6",
        author: "سارة العتيبي",
        initial: "س",
        text: "زدت خطاً بديلاً للنصوص الطويلة.",
        timeAgo: "قبل يومين",
      },
    ],
  },

  // ── تعديلات (2) ───────────────────────────────────────
  {
    id: "task-7",
    title: "تعديل ألوان القالب لتقارب ذوق المنتج",
    column: "revisions",
    category: "design",
    priority: "medium",
    assignee: { name: "سارة العتيبي", initial: "س" },
    dueDate: "19 يوليو",
    milestoneId: "m2",
    subtasks: [
      { id: "st7a", label: "تخفيف حدة الأصفر", done: true },
      { id: "st7b", label: "تجربة تباين أعلى للأزرار", done: false },
    ],
    files: [
      {
        id: "f6",
        name: "colors-round-2.pdf",
        version: "v2",
        uploadedBy: "سارة العتيبي",
        uploadedAt: "18 يوليو",
      },
    ],
    comments: [
      {
        id: "c7",
        author: "أحمد الغامدي",
        initial: "أ",
        text: "الأصفر لسّه فاتح، ممكن نجرّبه أدفأ شويّة؟",
        timeAgo: "قبل يوم",
      },
    ],
  },
  {
    id: "task-8",
    title: "إعادة صياغة عنوان الصفحة الرئيسية",
    column: "revisions",
    category: "content",
    priority: "low",
    assignee: { name: "نورة الحربي", initial: "ن" },
    dueDate: "20 يوليو",
    milestoneId: "m3",
    subtasks: [
      { id: "st8a", label: "3 اقتراحات بديلة", done: false },
    ],
    files: [],
    comments: [
      {
        id: "c8",
        author: "أحمد الغامدي",
        initial: "أ",
        text: "العنوان الحالي طويل. نحتاج أقصر ومباشر.",
        timeAgo: "قبل 3 أيام",
      },
    ],
  },

  // ── مكتمل (2) ────────────────────────────────────────
  {
    id: "task-9",
    title: "بحث السوق والعلامات المنافسة",
    column: "done",
    category: "content",
    priority: "medium",
    assignee: { name: "سارة العتيبي", initial: "س" },
    dueDate: "13 يوليو",
    milestoneId: "m1",
    subtasks: [
      { id: "st9a", label: "تحليل 5 منافسين محلّيين", done: true },
      { id: "st9b", label: "تلخيص الفجوات في السوق", done: true },
    ],
    files: [
      {
        id: "f7",
        name: "market-research.pdf",
        version: "v1",
        uploadedBy: "سارة العتيبي",
        uploadedAt: "13 يوليو",
      },
    ],
    comments: [],
  },
  {
    id: "task-10",
    title: "لوحة إلهام + التوجّه البصري النهائي",
    column: "done",
    category: "design",
    priority: "medium",
    assignee: { name: "سارة العتيبي", initial: "س" },
    dueDate: "14 يوليو",
    milestoneId: "m1",
    subtasks: [
      { id: "st10a", label: "20 مرجعاً بصرياً منتقىً", done: true },
      { id: "st10b", label: "الاتجاه المُقترح موثّق", done: true },
    ],
    files: [
      {
        id: "f8",
        name: "moodboard-final.pdf",
        version: "v1",
        uploadedBy: "سارة العتيبي",
        uploadedAt: "14 يوليو",
      },
    ],
    comments: [
      {
        id: "c9",
        author: "أحمد الغامدي",
        initial: "أ",
        text: "معتمد. الاتجاه واضح ومناسب.",
        timeAgo: "قبل أسبوع",
      },
    ],
  },
];

// ═══════════ عرض المخطط الزمني (تبويب) ═══════════
export const TIMELINE_WEEKS = [
  { key: "w1", label: "يوليو الأسبوع 1", startDay: 1, endDay: 7 },
  { key: "w2", label: "يوليو الأسبوع 2", startDay: 8, endDay: 14 },
  { key: "w3", label: "يوليو الأسبوع 3", startDay: 15, endDay: 21 },
  { key: "w4", label: "يوليو الأسبوع 4", startDay: 22, endDay: 31 },
];

/** يحدّد الأسبوع الذي تقع فيه مهمة اعتماداً على رقم اليوم من dueDate. */
export function taskWeekIndex(task: Task): number {
  const m = task.dueDate.match(/^(\d+)/);
  if (!m) return 0;
  const day = Number(m[1]);
  if (day <= 7) return 0;
  if (day <= 14) return 1;
  if (day <= 21) return 2;
  return 3;
}

/** يستخرج رقم اليوم من dueDate (مثل "17 يوليو" → 17). */
export function taskDayNumber(task: Task): number | null {
  const m = task.dueDate.match(/^(\d+)/);
  return m ? Number(m[1]) : null;
}
