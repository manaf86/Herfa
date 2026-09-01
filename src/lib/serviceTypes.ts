import type { CategorySlug } from "./categories";

// أنواع فرعية لكل فئة — تظهر كقائمة منسدلة بعد اختيار الفئة في الخطوة الأولى
// من معالج إنشاء الخدمة. القيم أدلة عرض فقط (تُخزَّن كنص حرّ في Gig.serviceType).
export const SERVICE_TYPES: Record<CategorySlug, { value: string; label: string }[]> = {
  design: [
    { value: "logo", label: "تصميم شعار" },
    { value: "brand-identity", label: "هوية بصرية كاملة" },
    { value: "social-media", label: "تصاميم سوشيال ميديا" },
    { value: "print", label: "تصميم مطبوعات" },
    { value: "ui-ux", label: "تصميم واجهات UI/UX" },
  ],
  programming: [
    { value: "web-app", label: "تطوير تطبيق ويب" },
    { value: "mobile-app", label: "تطوير تطبيق جوال" },
    { value: "wordpress", label: "ووردبريس" },
    { value: "bugfix", label: "إصلاح أخطاء برمجية" },
    { value: "automation", label: "أتمتة وسكربتات" },
  ],
  marketing: [
    { value: "social-ads", label: "إدارة إعلانات ممولة" },
    { value: "seo", label: "تحسين محركات البحث SEO" },
    { value: "social-management", label: "إدارة حسابات التواصل" },
    { value: "email-marketing", label: "التسويق عبر البريد" },
  ],
  writing: [
    { value: "article", label: "كتابة مقالات" },
    { value: "translation", label: "ترجمة" },
    { value: "copywriting", label: "صياغة إعلانية" },
    { value: "proofreading", label: "تدقيق لغوي" },
  ],
  video: [
    { value: "editing", label: "مونتاج فيديو" },
    { value: "motion-graphics", label: "موشن جرافيك" },
    { value: "animation", label: "أنيميشن" },
    { value: "intro", label: "مقدمات فيديو" },
  ],
  music: [
    { value: "voiceover", label: "تعليق صوتي" },
    { value: "mixing", label: "مكساج وماسترينج" },
    { value: "composing", label: "تلحين وإنتاج موسيقي" },
    { value: "jingles", label: "جينغل إعلاني" },
  ],
  ai: [
    { value: "chatbot", label: "بناء روبوت محادثة" },
    { value: "automation", label: "أتمتة بالذكاء الاصطناعي" },
    { value: "content-ai", label: "توليد محتوى بالذكاء الاصطناعي" },
    { value: "data-ai", label: "تحليل بيانات بالذكاء الاصطناعي" },
  ],
  business: [
    { value: "business-plan", label: "خطة عمل" },
    { value: "market-research", label: "دراسة سوق" },
    { value: "presentation", label: "عرض تقديمي" },
  ],
  consulting: [
    { value: "strategy", label: "استشارة استراتيجية" },
    { value: "hr", label: "استشارة موارد بشرية" },
    { value: "legal", label: "استشارة قانونية" },
  ],
  data: [
    { value: "data-entry", label: "إدخال بيانات" },
    { value: "data-analysis", label: "تحليل بيانات" },
    { value: "dashboard", label: "لوحات معلومات" },
  ],
  finance: [
    { value: "bookkeeping", label: "مسك دفاتر" },
    { value: "financial-modeling", label: "نمذجة مالية" },
    { value: "tax", label: "استشارة ضريبية" },
  ],
  photo: [
    { value: "product-photo", label: "تصوير منتجات" },
    { value: "retouch", label: "تعديل وريتاتش" },
    { value: "event-photo", label: "تصوير فعاليات" },
  ],
  personal: [
    { value: "coaching", label: "تدريب شخصي" },
    { value: "career", label: "استشارة مهنية" },
    { value: "language", label: "تعليم لغة" },
  ],
};
