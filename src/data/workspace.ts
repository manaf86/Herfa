// TODO: تُستبدل ببيانات حقيقية من قاعدة البيانات لاحقاً.
// نموذج مساحة العمل — رؤية المرحلة الثانية (كانبان + معالم مالية مربوطة بالخزنة).
// المرجع: docs/spec/site-flow.md + docs/spec/01-order-lifecycle.md

export type TaskStatus = "requirements" | "in-progress" | "review" | "approved";

export const TASK_COLUMNS: {
  key: TaskStatus;
  label: string;
  description: string;
}[] = [
  {
    key: "requirements",
    label: "المتطلبات",
    description: "معلومات ينتظرها المحترف من العميل",
  },
  {
    key: "in-progress",
    label: "قيد التنفيذ",
    description: "المحترف يعمل عليها الآن",
  },
  {
    key: "review",
    label: "مراجعة العميل",
    description: "بانتظار رأيك واعتمادك",
  },
  {
    key: "approved",
    label: "معتمد",
    description: "انتهى ولا يحتاج المزيد",
  },
];

export type TaskAssignee = "buyer" | "seller";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: TaskAssignee;
  milestoneId: string;
  dueDate?: string;
};

export type Milestone = {
  id: string;
  name: string;
  amountValue: number;
  amount: string;
  percent: number;
  taskIds: string[];
  /** هل أفرج المشتري عن دفعة هذا المعلم؟ يُشتق منه released/escrow-held. */
  released: boolean;
};

export type WorkspaceOrder = {
  id: string;
  title: string;
  buyer: { name: string; initial: string; company: string };
  seller: { name: string; initial: string; role: string };
  totalValue: number;
  totalDisplay: string;
  startDate: string;
  dueDate: string;
  /** حالة الطلب من دورة الحياة الرسمية (01-order-lifecycle.md). */
  status: "AWAITING_REQUIREMENTS" | "IN_PROGRESS" | "DELIVERED" | "ACCEPTED";
  statusLabel: string;
  daysRemaining: number;
};

export const workspaceOrder: WorkspaceOrder = {
  id: "ord-2081",
  title: "تصميم هوية بصرية — الباقة القياسية",
  buyer: {
    name: "أحمد الغامدي",
    initial: "أ",
    company: "متجر ألبان سنابل",
  },
  seller: {
    name: "سارة العتيبي",
    initial: "س",
    role: "مصمّمة هوية بصرية",
  },
  totalValue: 900,
  totalDisplay: "٩٠٠ ر.س",
  startDate: "١٣ يوليو ٢٠٢٦",
  dueDate: "١٨ يوليو ٢٠٢٦",
  status: "IN_PROGRESS",
  statusLabel: "قيد التنفيذ",
  daysRemaining: 3,
};

// ثلاثة معالم مالية تُغطّي كامل قيمة الطلب (35% + 40% + 25% = 100%).
// كل معلم = مجموعة مهام + دفعة من الخزنة تُفرَج عند اعتماد كل مهامه.
export const milestones: Milestone[] = [
  {
    id: "m1",
    name: "البحث والمفهوم",
    amountValue: 315,
    amount: "٣١٥ ر.س",
    percent: 35,
    taskIds: ["t1", "t2", "t3"],
    released: true,
  },
  {
    id: "m2",
    name: "التصميم الأولي",
    amountValue: 360,
    amount: "٣٦٠ ر.س",
    percent: 40,
    taskIds: ["t4", "t5", "t6"],
    released: false,
  },
  {
    id: "m3",
    name: "التسليم النهائي وملفات المصدر",
    amountValue: 225,
    amount: "٢٢٥ ر.س",
    percent: 25,
    taskIds: ["t7", "t8", "t9"],
    released: false,
  },
];

export const tasks: Task[] = [
  // — المعلم ١: كله معتمد (لأنه أُفرج عنه فعلاً)
  {
    id: "t1",
    title: "بحث سوق العلامة والمنافسين",
    description: "تحليل ٥ علامات محلية منافسة في منتجات الألبان.",
    status: "approved",
    assignee: "seller",
    milestoneId: "m1",
    dueDate: "١٤ يوليو",
  },
  {
    id: "t2",
    title: "لوحة إلهام مبدئية (Mood Board)",
    description: "٢٠ مرجعاً بصرياً موافقاً لهوية طبيعية دافئة.",
    status: "approved",
    assignee: "seller",
    milestoneId: "m1",
    dueDate: "١٤ يوليو",
  },
  {
    id: "t3",
    title: "توثيق التوجّه البصري",
    description: "مستند من صفحتين يشرح الاتجاه المقترح ونطاق الألوان.",
    status: "approved",
    assignee: "seller",
    milestoneId: "m1",
    dueDate: "١٥ يوليو",
  },

  // — المعلم ٢: قيد التنفيذ (خليط حالات)
  {
    id: "t4",
    title: "تصميم ٣ مفاهيم للشعار",
    description: "مقترحات مختلفة تعرض تنوّع الاتجاه دون تكرار.",
    status: "review",
    assignee: "seller",
    milestoneId: "m2",
    dueDate: "١٧ يوليو",
  },
  {
    id: "t5",
    title: "تطوير نظام الألوان الأساسي والثانوي",
    status: "in-progress",
    assignee: "seller",
    milestoneId: "m2",
    dueDate: "١٧ يوليو",
  },
  {
    id: "t6",
    title: "اختيار الخطوط الأساسية عربي + لاتيني",
    status: "in-progress",
    assignee: "seller",
    milestoneId: "m2",
    dueDate: "١٧ يوليو",
  },

  // — المعلم ٣: مقفل (المهام في المتطلبات)
  {
    id: "t7",
    title: "تسليم ملفات المصدر AI + PSD",
    description: "طبقات منظّمة ومسمّاة، جاهزة للتحرير المستقبلي.",
    status: "requirements",
    assignee: "seller",
    milestoneId: "m3",
    dueDate: "١٨ يوليو",
  },
  {
    id: "t8",
    title: "دليل الهوية البصرية (PDF)",
    description: "قواعد استخدام الشعار والألوان والمسافات الآمنة.",
    status: "requirements",
    assignee: "seller",
    milestoneId: "m3",
    dueDate: "١٨ يوليو",
  },
  {
    id: "t9",
    title: "صيغ التصدير للطباعة والويب",
    description: "PNG · SVG · PDF بأحجام متعدّدة.",
    status: "requirements",
    assignee: "seller",
    milestoneId: "m3",
    dueDate: "١٨ يوليو",
  },
];
