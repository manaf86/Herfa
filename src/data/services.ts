// TODO: تُستبدل ببيانات حقيقية من قاعدة البيانات لاحقاً.
// بيانات وهمية توضيحية لسوق الخدمات (٣٦ خدمة موزّعة على ١٣ فئة).

export type CategorySlug =
  | "design"
  | "programming"
  | "marketing"
  | "writing"
  | "video"
  | "music"
  | "ai"
  | "business"
  | "consulting"
  | "data"
  | "finance"
  | "photo"
  | "personal";

export type CategoryIcon =
  | "palette"
  | "code"
  | "megaphone"
  | "languages"
  | "clapperboard"
  | "music"
  | "bot"
  | "briefcase"
  | "lightbulb"
  | "database"
  | "wallet"
  | "camera"
  | "sparkles";

export type Category = {
  slug: CategorySlug;
  label: string;
  icon: CategoryIcon;
  gradientFrom: string;
  gradientTo: string;
};

// لون تدرّج ثابت لكل فئة → الشبكة تبدو منظّمة بصرياً.
export const categories: Category[] = [
  { slug: "design", label: "التصميم والجرافيك", icon: "palette", gradientFrom: "#0E3A46", gradientTo: "#D4A24C" },
  { slug: "programming", label: "البرمجة والتقنية", icon: "code", gradientFrom: "#123F4C", gradientTo: "#2A6F9E" },
  { slug: "marketing", label: "التسويق الرقمي", icon: "megaphone", gradientFrom: "#B76E00", gradientTo: "#D4A24C" },
  { slug: "writing", label: "الكتابة والترجمة", icon: "languages", gradientFrom: "#0E3A46", gradientTo: "#1B7F5A" },
  { slug: "video", label: "الفيديو والأنيميشن", icon: "clapperboard", gradientFrom: "#5B2A3E", gradientTo: "#D4A24C" },
  { slug: "music", label: "الموسيقى والصوتيات", icon: "music", gradientFrom: "#3B1F5E", gradientTo: "#2A6F9E" },
  { slug: "ai", label: "خدمات الذكاء الاصطناعي", icon: "bot", gradientFrom: "#0E3A46", gradientTo: "#6BAEDB" },
  { slug: "business", label: "الأعمال", icon: "briefcase", gradientFrom: "#1B7F5A", gradientTo: "#0E3A46" },
  { slug: "consulting", label: "الاستشارات", icon: "lightbulb", gradientFrom: "#B76E00", gradientTo: "#0E3A46" },
  { slug: "data", label: "البيانات", icon: "database", gradientFrom: "#2A6F9E", gradientTo: "#0E3A46" },
  { slug: "finance", label: "التمويل", icon: "wallet", gradientFrom: "#1B7F5A", gradientTo: "#D4A24C" },
  { slug: "photo", label: "التصوير", icon: "camera", gradientFrom: "#0E3A46", gradientTo: "#B76E00" },
  { slug: "personal", label: "التطوير الشخصي", icon: "sparkles", gradientFrom: "#D4A24C", gradientTo: "#1B7F5A" },
];

export type BadgeKind = "featured" | "top-seller" | "rising" | null;

export type Service = {
  id: string;
  slug: string;
  title: string;
  category: CategorySlug;
  seller: {
    name: string;
    initial: string;
    avatarBg: string; // من ألوان النظام
    country: string;
  };
  badge: BadgeKind;
  rating: number;
  ratingDisplay: string;
  ratingCount: number;
  ratingCountDisplay: string;
  startingPrice: string;
  priceValue: number;
  deliveryDays?: string;
  ordersInQueue?: number;
};

// نموذج ألوان أفاتار (كلها من متغيّرات النظام أو ملامستها).
const AVATAR_BGS = [
  "rgba(212,162,76,0.18)",  // accent
  "rgba(27,127,90,0.16)",   // success
  "rgba(42,111,158,0.16)",  // info
  "rgba(183,110,0,0.16)",   // warn
  "rgba(14,58,70,0.14)",    // heading
];

function ar(n: number | string): string {
  const map = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}

function priceAr(v: number): string {
  const s = v.toLocaleString("en-US").replace(/,/g, "٬");
  return `${ar(s)} ر.س`;
}

function ratingAr(r: number): string {
  return ar(r.toFixed(1).replace(".", "٫"));
}

type Raw = Omit<
  Service,
  "ratingDisplay" | "ratingCountDisplay" | "startingPrice" | "seller"
> & {
  seller: { name: string; country: string };
};

// ٣٦ خدمة — عناوين مختلفة الأطوال، أسماء متنوّعة، أسعار متفاوتة، ~٣٠٪ فقط بشارة.
const RAW: Raw[] = [
  // ── التصميم والجرافيك (4) ─────────────────────────────────────────
  {
    id: "s-101",
    slug: "logo-brand-identity",
    title: "سأصمّم لك هوية بصرية احترافية تعكس روح علامتك التجارية",
    category: "design",
    seller: { name: "سارة العتيبي", country: "الرياض" },
    badge: "top-seller",
    rating: 4.9,
    ratingCount: 213,
    priceValue: 450,
    deliveryDays: "٥ أيام",
    ordersInQueue: 6,
  },
  {
    id: "s-102",
    slug: "pitch-deck-design",
    title: "سأصمّم عرضك التقديمي بأسلوب يبهر المستثمرين",
    category: "design",
    seller: { name: "ريم العجمي", country: "دبي" },
    badge: "featured",
    rating: 4.8,
    ratingCount: 178,
    priceValue: 380,
    deliveryDays: "٣ أيام",
  },
  {
    id: "s-103",
    slug: "social-media-templates",
    title: "سأصمّم قوالب سوشيال ميديا ٢٠ منشوراً بتصميم متسق",
    category: "design",
    seller: { name: "دانة الكندري", country: "الكويت" },
    badge: null,
    rating: 4.7,
    ratingCount: 92,
    priceValue: 220,
    deliveryDays: "٤ أيام",
  },
  {
    id: "s-104",
    slug: "menu-design-restaurants",
    title: "سأصمّم قائمة طعام مطعمك بتفاصيل تفتح الشهية",
    category: "design",
    seller: { name: "أنس المصري", country: "القاهرة" },
    badge: null,
    rating: 4.6,
    ratingCount: 47,
    priceValue: 175,
    deliveryDays: "٦ أيام",
  },

  // ── البرمجة والتقنية (4) ──────────────────────────────────────────
  {
    id: "s-201",
    slug: "ecommerce-store-development",
    title: "سأطوّر متجرك الإلكتروني بالكامل جاهزاً للبيع في أسبوعين",
    category: "programming",
    seller: { name: "خالد منصور", country: "الرياض" },
    badge: "featured",
    rating: 4.9,
    ratingCount: 264,
    priceValue: 1200,
    deliveryDays: "١٤ يوماً",
    ordersInQueue: 4,
  },
  {
    id: "s-202",
    slug: "react-native-mobile-app",
    title: "سأبني لك تطبيقك للجوال بـ React Native لأندرويد و iOS",
    category: "programming",
    seller: { name: "عمر الشمري", country: "جدة" },
    badge: "top-seller",
    rating: 4.9,
    ratingCount: 186,
    priceValue: 2750,
    deliveryDays: "٢١ يوماً",
  },
  {
    id: "s-203",
    slug: "wordpress-site-fix",
    title: "سأصلح مشاكل ووردبريس خلال يوم واحد",
    category: "programming",
    seller: { name: "ياسر الحداد", country: "بيروت" },
    badge: null,
    rating: 4.7,
    ratingCount: 348,
    priceValue: 90,
    deliveryDays: "يوم واحد",
  },
  {
    id: "s-204",
    slug: "api-integration-service",
    title: "سأربط لك أي API بموقعك أو تطبيقك بأمان وسرعة",
    category: "programming",
    seller: { name: "لؤي القرشي", country: "الدمام" },
    badge: null,
    rating: 4.8,
    ratingCount: 71,
    priceValue: 640,
    deliveryDays: "٥ أيام",
  },

  // ── التسويق الرقمي (3) ─────────────────────────────────────────────
  {
    id: "s-301",
    slug: "social-media-ads-management",
    title: "سأدير حملاتك الإعلانية على منصات التواصل بميزانية ذكية",
    category: "marketing",
    seller: { name: "لينا فارس", country: "عمّان" },
    badge: "featured",
    rating: 4.8,
    ratingCount: 164,
    priceValue: 620,
    deliveryDays: "أسبوع",
  },
  {
    id: "s-302",
    slug: "seo-technical-audit",
    title: "سأدقّق موقعك من ناحية SEO وأسلّمك خطة عملية للتحسين",
    category: "marketing",
    seller: { name: "بدر السبيعي", country: "الخبر" },
    badge: null,
    rating: 4.7,
    ratingCount: 89,
    priceValue: 450,
    deliveryDays: "٤ أيام",
  },
  {
    id: "s-303",
    slug: "influencer-marketing-strategy",
    title: "سأبني لك خطة تسويق مع المؤثّرين مناسبة لسوقك",
    category: "marketing",
    seller: { name: "شهد الدوسري", country: "الرياض" },
    badge: "rising",
    rating: 4.9,
    ratingCount: 34,
    priceValue: 950,
    deliveryDays: "٧ أيام",
  },

  // ── الكتابة (2) ───────────────────────────────────────────────────
  {
    id: "s-401",
    slug: "marketing-copywriting",
    title: "سأكتب لك محتوى تسويقياً يبيع منتجك ويشدّ انتباه عميلك",
    category: "writing",
    seller: { name: "نورة الحربي", country: "المدينة" },
    badge: "top-seller",
    rating: 5.0,
    ratingCount: 298,
    priceValue: 140,
    deliveryDays: "٣ أيام",
  },
  {
    id: "s-402",
    slug: "linkedin-profile-optimization",
    title: "سأحرّر ملفّك في LinkedIn ليجذب فرصك القادمة",
    category: "writing",
    seller: { name: "طارق النجّار", country: "الرباط", },
    badge: null,
    rating: 4.7,
    ratingCount: 62,
    priceValue: 195,
    deliveryDays: "يومان",
  },
  {
    id: "s-403",
    slug: "arabic-english-translation",
    title: "سأترجم مستنداتك عربي-إنجليزي بدقّة لغوية وأسلوب طبيعي",
    category: "writing",
    seller: { name: "مي القحطاني", country: "الطائف" },
    badge: null,
    rating: 4.9,
    ratingCount: 209,
    priceValue: 115,
    deliveryDays: "يومان",
  },

  // ── الفيديو (3) ───────────────────────────────────────────────────
  {
    id: "s-501",
    slug: "60-second-promo-video",
    title: "سأنتج فيديو ترويجياً ٦٠ ثانية بجودة سينمائية",
    category: "video",
    seller: { name: "فيصل التركي", country: "الرياض" },
    badge: "featured",
    rating: 4.8,
    ratingCount: 137,
    priceValue: 890,
    deliveryDays: "٧ أيام",
  },
  {
    id: "s-502",
    slug: "youtube-video-editing",
    title: "سأحرّر لك حلقتك على يوتيوب مع مقدّمة ومؤثّرات",
    category: "video",
    seller: { name: "مروان الأنصاري", country: "الشارقة" },
    badge: null,
    rating: 4.6,
    ratingCount: 58,
    priceValue: 320,
    deliveryDays: "٤ أيام",
  },
  {
    id: "s-503",
    slug: "2d-motion-graphics",
    title: "سأصمّم لك فيديو موشن جرافيك ثنائي الأبعاد تشرح فيه فكرتك",
    category: "video",
    seller: { name: "روان بلقيس", country: "صنعاء" },
    badge: null,
    rating: 4.9,
    ratingCount: 41,
    priceValue: 750,
    deliveryDays: "١٠ أيام",
  },

  // ── الموسيقى والصوتيات (2) ────────────────────────────────────────
  {
    id: "s-601",
    slug: "original-background-music",
    title: "سأنتج لك موسيقى تصويرية أصلية تناسب هويّة عملك",
    category: "music",
    seller: { name: "هدى النعيمي", country: "الدوحة" },
    badge: null,
    rating: 4.9,
    ratingCount: 37,
    priceValue: 425,
    deliveryDays: "٦ أيام",
  },
  {
    id: "s-602",
    slug: "arabic-voiceover-pro",
    title: "سأسجّل لك صوتاً احترافياً باللغة العربية الفصحى",
    category: "music",
    seller: { name: "سلطان الغانم", country: "المنامة" },
    badge: "top-seller",
    rating: 5.0,
    ratingCount: 156,
    priceValue: 180,
    deliveryDays: "٣ أيام",
  },

  // ── الذكاء الاصطناعي (3) ─────────────────────────────────────────
  {
    id: "s-701",
    slug: "ai-chatbot-for-your-website",
    title: "سأبني لك روبوت محادثة ذكياً لموقعك يجيب عملاءك ٢٤/٧",
    category: "ai",
    seller: { name: "عبدالله الرشيدي", country: "الأحساء" },
    badge: "rising",
    rating: 4.9,
    ratingCount: 63,
    priceValue: 1450,
    deliveryDays: "٩ أيام",
  },
  {
    id: "s-702",
    slug: "custom-gpt-agents",
    title: "سأصمّم لك عميل GPT مخصّصاً لسير عمل شركتك",
    category: "ai",
    seller: { name: "إياد الفاسي", country: "الدار البيضاء" },
    badge: null,
    rating: 4.8,
    ratingCount: 28,
    priceValue: 1150,
    deliveryDays: "٧ أيام",
  },
  {
    id: "s-703",
    slug: "prompt-engineering-workshop",
    title: "سأدرّب فريقك على هندسة الأوامر لتحقيق أفضل نتائج من الذكاء الاصطناعي",
    category: "ai",
    seller: { name: "غادة السويلم", country: "الرياض" },
    badge: null,
    rating: 4.7,
    ratingCount: 19,
    priceValue: 1850,
    deliveryDays: "أسبوعان",
  },

  // ── الأعمال (2) ───────────────────────────────────────────────────
  {
    id: "s-801",
    slug: "business-plan-writing",
    title: "سأكتب لك خطّة عمل قابلة للتمويل خلال أسبوعين",
    category: "business",
    seller: { name: "بشار العلي", country: "دمشق" },
    badge: null,
    rating: 4.8,
    ratingCount: 74,
    priceValue: 1350,
    deliveryDays: "١٤ يوماً",
  },
  {
    id: "s-802",
    slug: "vat-registration-help",
    title: "سأساعدك في تسجيل الضريبة والاشتراطات النظامية لمنشأتك",
    category: "business",
    seller: { name: "أفنان بارك", country: "الرياض" },
    badge: null,
    rating: 4.9,
    ratingCount: 112,
    priceValue: 690,
    deliveryDays: "٥ أيام",
  },

  // ── الاستشارات (3) ────────────────────────────────────────────────
  {
    id: "s-901",
    slug: "startup-pitch-coaching",
    title: "سأدرّبك على تقديم فكرتك أمام المستثمرين — جلستان مكثّفتان",
    category: "consulting",
    seller: { name: "خديجة النصر", country: "أبوظبي" },
    badge: "featured",
    rating: 4.9,
    ratingCount: 46,
    priceValue: 1400,
    deliveryDays: "٥ أيام",
  },
  {
    id: "s-902",
    slug: "product-strategy-session",
    title: "سأجري معك جلسة استراتيجية منتج مدّتها ٩٠ دقيقة",
    category: "consulting",
    seller: { name: "زياد بلبيسي", country: "عمّان" },
    badge: null,
    rating: 4.8,
    ratingCount: 31,
    priceValue: 890,
    deliveryDays: "٣ أيام",
  },
  {
    id: "s-903",
    slug: "career-coaching",
    title: "سأساعدك على رسم مسارك المهني القادم بجلستين",
    category: "consulting",
    seller: { name: "ريان الشلهوب", country: "الرياض" },
    badge: null,
    rating: 4.6,
    ratingCount: 22,
    priceValue: 550,
    deliveryDays: "أسبوع",
  },

  // ── البيانات (2) ──────────────────────────────────────────────────
  {
    id: "s-1001",
    slug: "power-bi-dashboards",
    title: "سأحلّل بياناتك وأصمّم لك لوحات Power BI تفاعلية ومقروءة",
    category: "data",
    seller: { name: "طارق العمري", country: "المنامة" },
    badge: null,
    rating: 4.8,
    ratingCount: 55,
    priceValue: 780,
    deliveryDays: "٧ أيام",
  },
  {
    id: "s-1002",
    slug: "excel-automation-macros",
    title: "سأتمتم عملك على إكسل بـ Macros و VBA يوفّر ساعاتك",
    category: "data",
    seller: { name: "منال الغزّي", country: "بغداد" },
    badge: null,
    rating: 4.7,
    ratingCount: 143,
    priceValue: 235,
    deliveryDays: "٤ أيام",
  },

  // ── التمويل (2) ───────────────────────────────────────────────────
  {
    id: "s-1101",
    slug: "financial-model-startup",
    title: "سأبني لك نموذجاً مالياً مفصّلاً لشركتك الناشئة",
    category: "finance",
    seller: { name: "وسام الزهراني", country: "جدة" },
    badge: null,
    rating: 4.8,
    ratingCount: 38,
    priceValue: 1650,
    deliveryDays: "١٠ أيام",
  },
  {
    id: "s-1102",
    slug: "monthly-bookkeeping",
    title: "سأمسك دفاترك المحاسبية الشهرية بدقّة والتزام",
    category: "finance",
    seller: { name: "منى العنزي", country: "حائل" },
    badge: null,
    rating: 4.9,
    ratingCount: 87,
    priceValue: 480,
    deliveryDays: "١٤ يوماً",
  },

  // ── التصوير (2) ───────────────────────────────────────────────────
  {
    id: "s-1201",
    slug: "product-photography",
    title: "سأصوّر منتجاتك بجودة احترافية جاهزة لمتجرك ومنصاتك",
    category: "photo",
    seller: { name: "أحمد الشهري", country: "أبها" },
    badge: null,
    rating: 4.7,
    ratingCount: 91,
    priceValue: 260,
    deliveryDays: "٤ أيام",
  },
  {
    id: "s-1202",
    slug: "food-photography-restaurants",
    title: "سأصوّر أطباق مطعمك بإضاءة تفتح الشهية للمنشورات والقائمة",
    category: "photo",
    seller: { name: "لطيفة العُذبي", country: "مسقط" },
    badge: "rising",
    rating: 4.9,
    ratingCount: 26,
    priceValue: 425,
    deliveryDays: "٥ أيام",
  },

  // ── التطوير الشخصي (2) ────────────────────────────────────────────
  {
    id: "s-1301",
    slug: "arabic-public-speaking",
    title: "سأدرّبك على الإلقاء والتحدّث أمام الجمهور بثقة",
    category: "personal",
    seller: { name: "محمود عبد الحق", country: "طنجة" },
    badge: null,
    rating: 4.8,
    ratingCount: 44,
    priceValue: 320,
    deliveryDays: "٧ أيام",
  },
  {
    id: "s-1302",
    slug: "time-management-coaching",
    title: "سأساعدك على إدارة وقتك بمنهج عملي في جلستين",
    category: "personal",
    seller: { name: "أروى بشير", country: "الخرطوم" },
    badge: null,
    rating: 4.6,
    ratingCount: 17,
    priceValue: 190,
    deliveryDays: "٥ أيام",
  },
  {
    id: "s-1303",
    slug: "arabic-cv-review",
    title: "سأراجع سيرتك الذاتية بالعربية والإنجليزية وأقدّم تحسينات عملية",
    category: "personal",
    seller: { name: "خلود اليوسف", country: "الرياض" },
    badge: null,
    rating: 4.8,
    ratingCount: 128,
    priceValue: 145,
    deliveryDays: "يومان",
  },
];

export const services: Service[] = RAW.map((r, i) => ({
  ...r,
  seller: {
    name: r.seller.name,
    country: r.seller.country,
    initial: r.seller.name.charAt(0),
    avatarBg: AVATAR_BGS[i % AVATAR_BGS.length],
  },
  ratingDisplay: ratingAr(r.rating),
  ratingCountDisplay: ar(r.ratingCount),
  startingPrice: priceAr(r.priceValue),
}));

export const marketplaceUser = {
  name: "أحمد الغامدي",
  initial: "أ",
};

export const sortOptions = [
  { key: "newest", label: "الأحدث" },
  { key: "top-rated", label: "الأعلى تقييماً" },
  { key: "cheapest", label: "الأقل سعراً" },
];
