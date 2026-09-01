import Reveal from "./Reveal";

type Story = {
  initial: string;
  name: string;
  role: string;
  metric: string;
  quote: string;
  imgLabel: string;
};

const STORIES: Story[] = [
  {
    initial: "س",
    name: "سارة العتيبي",
    role: "مصمّمة هوية بصرية",
    metric: "3× نموّ الدخل",
    quote: "«خلال ستة أشهر ضاعفت دخلي ثلاث مرات. الخزنة أعطتني الثقة للتعامل مع عملاء جدد دون قلق.»",
    imgLabel: "صورة العميلة",
  },
  {
    initial: "خ",
    name: "خالد منصور",
    role: "مطوّر واجهات",
    metric: "47 مشروعاً",
    quote: "«أنجزت 47 مشروعاً بتقييم 5 من 5. مساحة العمل المدمجة وفّرت عليّ عناء الأدوات المتفرقة.»",
    imgLabel: "صورة العميل",
  },
  {
    initial: "ل",
    name: "ليلى حدّاد",
    role: "مترجمة معتمدة",
    metric: "أول عميل دولي",
    quote: "«الجسر اللغوي فتح لي سوقاً عالمياً. حصلت على أول عميل دولي خلال أسبوع من انضمامي.»",
    imgLabel: "صورة العميلة",
  },
];

export default function Testimonials() {
  return (
    <section
      style={{
        paddingBlock: "clamp(56px, 8vw, 96px)",
        paddingInline: 24,
      }}
    >
      <div style={{ maxWidth: 1180, marginInline: "auto" }}>
        <Reveal style={{ textAlign: "center", maxWidth: 640, marginInline: "auto", marginBlockEnd: 44 }}>
          <h2 className="font-bold" style={{ fontSize: "clamp(26px, 4vw, 40px)", color: "var(--heading)", margin: "0 0 12px", lineHeight: 1.2 }}>
            قصص نجاح
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 17, margin: 0, lineHeight: 1.6 }}>
            محترفون بنوا مسارهم المهني على حِرفة.
          </p>
        </Reveal>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {STORIES.map((st, i) => (
            <Reveal key={st.name} delay={i * 100} className="flex flex-col overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16 }}>
              <div
                aria-hidden
                className="grid place-items-center"
                style={{
                  height: 170,
                  backgroundImage:
                    "repeating-linear-gradient(135deg, var(--surface-2), var(--surface-2) 10px, var(--bg) 10px, var(--bg) 20px)",
                  color: "var(--muted)",
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 12,
                  letterSpacing: "0.05em",
                }}
              >
                {st.imgLabel}
              </div>
              <div className="flex flex-1 flex-col gap-3.5" style={{ padding: 24 }}>
                <div className="font-bold" style={{ fontSize: 28, color: "var(--accent)" }}>
                  {st.metric}
                </div>
                <p className="flex-1" style={{ margin: 0, color: "var(--ink)", lineHeight: 1.7 }}>
                  {st.quote}
                </p>
                <div className="flex items-center gap-3" style={{ borderBlockStart: "1px solid var(--border)", paddingBlockStart: 16 }}>
                  <span
                    className="grid shrink-0 place-items-center font-bold"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "rgba(212,162,76,0.18)",
                      color: "var(--heading)",
                    }}
                  >
                    {st.initial}
                  </span>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--ink)" }}>
                      {st.name}
                    </div>
                    <div className="text-sm" style={{ color: "var(--muted)" }}>
                      {st.role}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
