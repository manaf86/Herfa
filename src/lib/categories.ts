// المصدر الوحيد لقائمة الـ 13 فئة — يُستخدم في الـ API (Zod) والواجهة.

export const CATEGORY_SLUGS = [
  "design",
  "programming",
  "marketing",
  "writing",
  "video",
  "music",
  "ai",
  "business",
  "consulting",
  "data",
  "finance",
  "photo",
  "personal",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  design: "التصميم والجرافيك",
  programming: "البرمجة والتقنية",
  marketing: "التسويق الرقمي",
  writing: "الكتابة والترجمة",
  video: "الفيديو والأنيميشن",
  music: "الموسيقى والصوتيات",
  ai: "خدمات الذكاء الاصطناعي",
  business: "الأعمال",
  consulting: "الاستشارات",
  data: "البيانات",
  finance: "التمويل",
  photo: "التصوير",
  personal: "التطوير الشخصي",
};

export function isCategorySlug(v: unknown): v is CategorySlug {
  return typeof v === "string" && (CATEGORY_SLUGS as readonly string[]).includes(v);
}
