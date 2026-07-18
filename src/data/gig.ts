// TODO: تُستبدل ببيانات حقيقية من قاعدة البيانات لاحقاً.
// بيانات وهمية توضيحية لصفحة خدمة (Gig) واحدة.

export type PackageTier = "basic" | "standard" | "pro";

export type Package = {
  tier: PackageTier;
  name: string;
  price: string;
  priceValue: number;
  description: string;
  deliveryDays: string;
  revisions: string;
  features: string[];
  isFeatured?: boolean;
};

export type Review = {
  id: string;
  name: string;
  initial: string;
  role: string;
  timeAgo: string;
  rating: number;
  text: string;
};

export const gigSeller = {
  name: "سارة العتيبي",
  initial: "س",
  role: "مصمّمة هوية بصرية",
  city: "الرياض",
  rating: 4.9,
  ratingCount: 213,
  herfaIndex: 94,
  isFeatured: true,
  bio: "أساعد رواد الأعمال وأصحاب الشركات على بناء هويّات بصرية تعكس روحهم، بعيداً عن القوالب الجاهزة. أعمل بمنهج بحثي أفهم فيه علامتك قبل أن أرسمها.",
  metrics: {
    onTimeDelivery: 98,
    responseTime: "أقل من ساعة",
    completedOrders: 312,
    avgRating: 4.9,
  },
};

export const breadcrumb = [
  { label: "التصميم والجرافيك", href: "/#categories" },
  { label: "تصميم الشعارات والهوية", href: "/#categories" },
];

export const gigTitle =
  "سأصمّم لك هوية بصرية وشعاراً احترافياً يعكس روح علامتك التجارية";

export const quickBadges = [
  { key: "delivery", label: "التسليم خلال 5 أيام" },
  { key: "revisions", label: "4 تعديلات" },
  { key: "rights", label: "حقوق ملكية كاملة" },
  { key: "formats", label: "صيغ متعددة" },
];

export const aboutParagraphs = [
  "أعمل معك بمنهج واضح يبدأ بفهم علامتك وجمهورك، ثم رسم مفاهيم أوّلية، ثم تطويرها إلى نظام بصري متكامل: شعار، ألوان، خطوط، وقواعد استخدام. النتيجة ليست صورة جميلة فقط، بل هوية تعمل عبر كل نقطة تواصل — من بطاقة العمل إلى واجهة تطبيقك.",
  "لدي أكثر من 7 سنوات من الخبرة في تصميم الهويات لأكثر من 300 علامة تجارية في السعودية والخليج، من متاجر صغيرة إلى شركات ناشئة مموّلة. كل هوية تخرج من عندي جاهزة للنشر، بملفات مصدرية مفتوحة وأدلّة استخدام واضحة.",
];

export const deliverables = [
  "شعار متجاوب يعمل في كل الأحجام",
  "نظام ألوان وخطوط متكامل",
  "ملفات مصدرية قابلة للتعديل (AI, PSD, Figma)",
  "صيغ جاهزة للطباعة والويب (PDF, PNG, SVG)",
  "دليل استخدام مختصر بالعربية والإنجليزية",
  "حقوق ملكية كاملة — التصميم ملكك",
];

export const packages: Package[] = [
  {
    tier: "basic",
    name: "الباقة الأساسية",
    price: "450 ر.س",
    priceValue: 450,
    description:
      "شعار احترافي بمفهوم واحد، مناسب للمشاريع الصغيرة والانطلاقات السريعة.",
    deliveryDays: "3 أيام",
    revisions: "تعديلات محدودة",
    features: [
      "مفهوم تصميم واحد",
      "شعار بصيغة PNG و SVG",
      "ألوان الشعار",
      "تسليم في 3 أيام",
    ],
  },
  {
    tier: "standard",
    name: "الباقة القياسية",
    price: "900 ر.س",
    priceValue: 900,
    description:
      "ثلاثة مفاهيم تصميم لتختار الأنسب، مع دليل ألوان لبدء تطبيق هويّتك.",
    deliveryDays: "5 أيام",
    revisions: "4 تعديلات",
    features: [
      "3 مفاهيم تصميم",
      "4 جولات تعديل",
      "ملفات مصدرية (AI + PSD)",
      "دليل ألوان أساسي",
      "تسليم في 5 أيام",
    ],
    isFeatured: true,
  },
  {
    tier: "pro",
    name: "الباقة الاحترافية",
    price: "1,800 ر.س",
    priceValue: 1800,
    description:
      "هوية بصرية متكاملة مع دليل استخدام كامل، لعلامات جاهزة للنمو.",
    deliveryDays: "7 أيام",
    revisions: "تعديلات غير محدودة",
    features: [
      "5 مفاهيم تصميم",
      "تعديلات غير محدودة",
      "دليل هوية بصرية كامل",
      "كل صيغ التصدير (Print + Web)",
      "بطاقات أعمال وقوالب أساسية",
      "تسليم في 7 أيام",
    ],
  },
];

export type ComparisonRow = {
  label: string;
  basic: string;
  standard: string;
  pro: string;
};

export const comparisonRows: ComparisonRow[] = [
  {
    label: "المفاهيم المبدئية",
    basic: "مفهوم واحد",
    standard: "3 مفاهيم",
    pro: "5 مفاهيم",
  },
  {
    label: "عدد التعديلات",
    basic: "محدودة",
    standard: "4 تعديلات",
    pro: "غير محدودة",
  },
  {
    label: "مدة التسليم",
    basic: "3 أيام",
    standard: "5 أيام",
    pro: "7 أيام",
  },
  {
    label: "دليل الهوية",
    basic: "—",
    standard: "دليل ألوان",
    pro: "دليل هوية كامل",
  },
  {
    label: "صيغ التصدير",
    basic: "PNG + SVG",
    standard: "AI + PSD + PNG",
    pro: "كل الصيغ (Print + Web)",
  },
  {
    label: "السعر",
    basic: "450 ر.س",
    standard: "900 ر.س",
    pro: "1,800 ر.س",
  },
];

export const ratingDistribution = [
  { stars: 5, percent: 92 },
  { stars: 4, percent: 6 },
  { stars: 3, percent: 1 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 0 },
];

export const reviews: Review[] = [
  {
    id: "r-1",
    name: "فهد العنزي",
    initial: "ف",
    role: "متجر تجزئة",
    timeAgo: "قبل 6 أيام",
    rating: 5,
    text: "سارة فهمت طبيعة عملي من أوّل مكالمة. الشعار جاء أفضل ممّا تخيّلته، والتسليم كان قبل الموعد بيوم. سأتعامل معها في المشروع القادم بلا تردّد.",
  },
  {
    id: "r-2",
    name: "نورة الحربي",
    initial: "ن",
    role: "مقهى مختص",
    timeAgo: "قبل أسبوعين",
    rating: 5,
    text: "احترافية عالية من البداية للنهاية. الملفات المصدرية منظّمة، ودليل الهوية جعل تطبيق العلامة على الأكواب واللافتات سهلاً جداً. الفريق يشكرها من قلبه.",
  },
  {
    id: "r-3",
    name: "محمد القحطاني",
    initial: "م",
    role: "شركة تقنية",
    timeAgo: "قبل شهر",
    rating: 5,
    text: "استعنّا بسارة لإعادة تصميم هويّتنا بعد أن كبرت شركتنا. النتيجة عكست تماماً المكانة الجديدة التي نطمح لها. تعاملها راقٍ وتلتزم بالمواعيد.",
  },
];

export const trustSignals = {
  onTimeDelivery: "98٪ تسليم بالموعد",
  responseTime: "الرد أقل من ساعة",
  herfaIndex: "مؤشر حِرفة 94",
};
