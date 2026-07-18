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
    value: "12",
    note: "+2 عن الأسبوع الماضي",
    color: "heading",
    icon: "activity",
  },
  {
    key: "action",
    label: "تحتاج إجراءً منك",
    value: "3",
    note: "ردود ومراجعات معلّقة",
    color: "accent",
    icon: "clock",
  },
  {
    key: "late",
    label: "متأخرة",
    value: "1",
    note: "طلب تجاوز موعده",
    color: "alert",
    icon: "alert",
  },
  {
    key: "earnings",
    label: "الأرباح في الخزنة",
    value: "8,450 ر.س",
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
  changeReason: "انخفض 3 نقاط لأن طلباً سُلّم متأخراً يوم 12 يوليو.",
  guidance:
    "سلّم طلباتك القادمة في موعدها لاستعادة النقاط خلال أسبوعين.",
};

export const funnel = {
  stages: [
    { label: "ظهور", display: "2,400", value: 2400 },
    { label: "نقرة", display: "720", value: 720 },
    { label: "محادثة", display: "210", value: 210 },
    { label: "طلب", display: "32", value: 32 },
  ] as FunnelStage[],
  diagnosis:
    "تفقد 70٪ من الزوار عند صفحة الخدمة قبل النقرة. جرّب صورة غلاف أوضح وعنواناً أقصر.",
};

export const recentOrders: Order[] = [
  {
    id: "o-1024",
    title: "تصميم هوية بصرية",
    client: "متجر ألبان سنابل",
    amount: "2,500 ر.س",
    delivery: "قيد التنفيذ",
    status: "in-progress",
  },
  {
    id: "o-1023",
    title: "كتابة محتوى موقع",
    client: "شركة نون",
    amount: "1,200 ر.س",
    delivery: "13 يوليو",
    status: "awaiting-approval",
  },
  {
    id: "o-1022",
    title: "تصميم قائمة طعام",
    client: "مطعم السرايا",
    amount: "3,400 ر.س",
    delivery: "12 يوليو",
    status: "late",
  },
  {
    id: "o-1021",
    title: "تصميم منشورات إعلامية",
    client: "عيادة نور",
    amount: "900 ر.س",
    delivery: "10 يوليو",
    status: "completed",
  },
  {
    id: "o-1020",
    title: "مونتاج فيديو تعليمي",
    client: "أكاديمية سطر",
    amount: "1,800 ر.س",
    delivery: "8 يوليو",
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
