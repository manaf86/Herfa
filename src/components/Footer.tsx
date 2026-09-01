import Link from "next/link";

type Col = { title: string; links: { label: string; href: string }[] };

const COLS: Col[] = [
  {
    title: "المنصة",
    links: [
      { label: "تصفّح المهارات", href: "/marketplace" },
      { label: "كيف يعمل", href: "#how" },
      { label: "الأسعار والعمولة", href: "#" },
      { label: "للشركات", href: "#business" },
    ],
  },
  {
    title: "السياسات",
    links: [
      { label: "الشروط والأحكام", href: "#" },
      { label: "سياسة الخصوصية", href: "#" },
      { label: "سياسة النزاعات", href: "#" },
      { label: "حق الاستئناف", href: "#" },
    ],
  },
  {
    title: "الامتثال",
    links: [
      { label: "الامتثال التنظيمي", href: "#" },
      { label: "المراجعة الشرعية", href: "#" },
      { label: "الأمان وحماية الدفع", href: "#" },
    ],
  },
  {
    title: "الشركة",
    links: [
      { label: "عن حِرفة", href: "#" },
      { label: "الوظائف", href: "#" },
      { label: "المدوّنة", href: "#" },
      { label: "تواصل معنا", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--surface)",
        borderBlockStart: "1px solid var(--border)",
        paddingBlock: "56px 28px",
        paddingInline: 24,
      }}
    >
      <div style={{ maxWidth: 1180, marginInline: "auto" }}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32 }}>
          <div style={{ minWidth: 200 }}>
            <Link href="/" className="flex items-center gap-2.5 font-bold" style={{ fontSize: 20, color: "var(--heading)" }}>
              <span
                className="grid place-items-center font-extrabold"
                style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "var(--accent)", color: "#0E3A46" }}
              >
                ح
              </span>
              حِرفة
            </Link>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, margin: "14px 0 0", maxWidth: 260 }}>
              سوق الخدمات المهنية العربي — مالك مضمون، وقواعدك واضحة، ولغتك ليست عائقاً.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="font-semibold" style={{ color: "var(--heading)", fontSize: 15, marginBlockEnd: 12 }}>
                {col.title}
              </div>
              {col.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="block transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--muted)", fontSize: 14, paddingBlock: 6 }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-3"
          style={{
            borderBlockStart: "1px solid var(--border)",
            marginBlockStart: 40,
            paddingBlockStart: 24,
            color: "var(--muted)",
            fontSize: 13,
          }}
        >
          <div>© 2026 حِرفة — جميع الحقوق محفوظة.</div>
          <div className="flex items-center gap-4">
            <span>العربية</span>
            <span>·</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
