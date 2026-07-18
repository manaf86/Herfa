import Link from "next/link";

type Col = { title: string; links: { label: string; href: string }[] };

const COLS: Col[] = [
  {
    title: "المنصة",
    links: [
      { label: "تصفّح المهارات", href: "#categories" },
      { label: "كيف تعمل", href: "#how" },
      { label: "الأسعار", href: "#" },
      { label: "للشركات", href: "#business" },
    ],
  },
  {
    title: "المحترفون",
    links: [
      { label: "انضم كمحترف", href: "#" },
      { label: "مؤشر حِرفة", href: "#" },
      { label: "أكاديمية حِرفة", href: "#" },
      { label: "دليل التسعير", href: "#" },
    ],
  },
  {
    title: "الشركة",
    links: [
      { label: "من نحن", href: "#" },
      { label: "المدوّنة", href: "#" },
      { label: "الوظائف", href: "#" },
      { label: "تواصل", href: "#" },
    ],
  },
  {
    title: "قانوني",
    links: [
      { label: "شروط الاستخدام", href: "#" },
      { label: "سياسة الخصوصية", href: "#" },
      { label: "سياسة النزاعات", href: "#" },
      { label: "الامتثال الشرعي", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--surface-2)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold"
                style={{ backgroundColor: "var(--accent)", color: "#0E3A46" }}
              >
                ح
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--heading)" }}
              >
                حِرفة
              </span>
            </Link>
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              سوق الخدمات المهنية العربي — الأول عربياً، القادر عالمياً.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p
                className="mb-4 text-sm font-bold"
                style={{ color: "var(--heading)" }}
              >
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm transition-colors hover:text-[var(--accent)]"
                      style={{ color: "var(--muted)" }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <p>© ٢٠٢٦ حِرفة. جميع الحقوق محفوظة.</p>
          <p>صُنعت بحرفية في الرياض · دبي · القاهرة</p>
        </div>
      </div>
    </footer>
  );
}
