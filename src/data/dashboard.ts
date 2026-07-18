// TODO: تُستبدل ببيانات حقيقية من قاعدة البيانات لاحقاً.
// هذه بيانات وهمية توضيحية للواجهة فقط.

export type StatColor = "heading" | "accent" | "alert" | "success" | "info";

export type Stat = {
  key: string;
  label: string;
  value: string;
  note: string;
  color: StatColor;
  icon: "activity" | "clock" | "alert" | "wallet";
};

export type IndexComponent = {
  name: string;
  weight: number;
  value: number;
};

export type FunnelStage = {
  label: string;
  display: string;
  value: number;
};

export type OrderStatus =
  | "in-progress"
  | "awaiting-approval"
  | "late"
  | "completed";

export type Order = {
  id: string;
  title: string;
  client: string;
  amount: string;
  delivery: string;
  status: OrderStatus;
};

export const dashboardUser = {
  name: "أحمد الغامدي",
  initial: "أ",
  herfaIndex: 87,
};

export const stats: Stat[] = [
  {
    key: "active",
    label: "طلبات نشطة",
    value: "١٢",
    note: "+٢ عن الأسبوع الماضي",
    color: "heading",
    icon: "activity",
  },
  {
    key: "action",
    label: "تحتاج إجراءً منك",
    value: "٣",
    note: "ردود ومراجعات معلّقة",
    color: "accent",
    icon: "clock",
  },
  {
    key: "late",
    label: "متأخرة",
    value: "١",
    note: "طلب تجاوز موعده",
    color: "alert",
    icon: "alert",
  },
  {
    key: "earnings",
    label: "الأرباح في الخزنة",
    value: "٨٬٤٥٠ ر.س",
    note: "قابلة للسحب بعد الاعتماد",
    color: "success",
    icon: "wallet",
  },
];

export const herfaIndex = {
  score: 87,
  outOf: 100,
  components: [
    { name: "التسليم في الموعد", weight: 30, value: 92 },
    { name: "رضا العملاء", weight: 30, value: 96 },
    { name: "سرعة الرد", weight: 20, value: 88 },
    { name: "الاعتماد من أول مرة", weight: 20, value: 79 },
  ] as IndexComponent[],
  changeReason: "انخفض ٣ نقاط لأن طلباً سُلّم متأخراً يوم ١٢ يوليو.",
  guidance:
    "سلّم طلباتك القادمة في موعدها لاستعادة النقاط خلال أسبوعين.",
};

export const funnel = {
  stages: [
    { label: "ظهور", display: "٢٬٤٠٠", value: 2400 },
    { label: "نقرة", display: "٧٢٠", value: 720 },
    { label: "محادثة", display: "٢١٠", value: 210 },
    { label: "طلب", display: "٣٢", value: 32 },
  ] as FunnelStage[],
  diagnosis:
    "تفقد ٧٠٪ من الزوار عند صفحة الخدمة قبل النقرة. جرّب صورة غلاف أوضح وعنواناً أقصر.",
};

export const recentOrders: Order[] = [
  {
    id: "o-1024",
    title: "تصميم هوية بصرية",
    client: "متجر ألبان سنابل",
    amount: "٢٬٥٠٠ ر.س",
    delivery: "قيد التنفيذ",
    status: "in-progress",
  },
  {
    id: "o-1023",
    title: "كتابة محتوى موقع",
    client: "شركة نون",
    amount: "١٬٢٠٠ ر.س",
    delivery: "١٣ يوليو",
    status: "awaiting-approval",
  },
  {
    id: "o-1022",
    title: "تصميم قائمة طعام",
    client: "مطعم السرايا",
    amount: "٣٬٤٠٠ ر.س",
    delivery: "١٢ يوليو",
    status: "late",
  },
  {
    id: "o-1021",
    title: "تصميم منشورات إعلامية",
    client: "عيادة نور",
    amount: "٩٠٠ ر.س",
    delivery: "١٠ يوليو",
    status: "completed",
  },
  {
    id: "o-1020",
    title: "مونتاج فيديو تعليمي",
    client: "أكاديمية سطر",
    amount: "١٬٨٠٠ ر.س",
    delivery: "٨ يوليو",
    status: "completed",
  },
];

export const orderStatusLabels: Record<OrderStatus, string> = {
  "in-progress": "قيد التنفيذ",
  "awaiting-approval": "بانتظار الاعتماد",
  late: "متأخر",
  completed: "مكتمل",
};

export type NavItem = {
  label: string;
  href: string;
  icon:
    | "dashboard"
    | "orders"
    | "workspace"
    | "messages"
    | "services"
    | "earnings"
    | "reports"
    | "settings";
};

export const dashboardNav: NavItem[] = [
  { label: "لوحة القيادة", href: "/dashboard", icon: "dashboard" },
  { label: "الطلبات", href: "/dashboard/orders", icon: "orders" },
  { label: "مساحة العمل", href: "/dashboard/workspace", icon: "workspace" },
  { label: "الرسائل", href: "/dashboard/messages", icon: "messages" },
  { label: "خدماتي", href: "/dashboard/gigs", icon: "services" },
  { label: "الأرباح", href: "/dashboard/earnings", icon: "earnings" },
  { label: "التقارير", href: "/dashboard/reports", icon: "reports" },
  { label: "الإعدادات", href: "/dashboard/settings", icon: "settings" },
];
