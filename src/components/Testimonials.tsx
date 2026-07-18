import { Star } from "lucide-react";
import Reveal from "./Reveal";

type Story = {
  name: string;
  role: string;
  quote: string;
  metric: string;
  metricLabel: string;
  initial: string;
};

const STORIES: Story[] = [
  {
    name: "سارة العتيبي",
    role: "مصممة هوية بصرية",
    quote:
      "خلال ستة أشهر، تحوّلت من مشاريع متفرقة إلى دخل شهري ثابت. مساحة العمل ساعدتني أنظم كل شيء.",
    metric: "3×",
    metricLabel: "نمو الدخل",
    initial: "س",
  },
  {
    name: "خالد منصور",
    role: "مطوّر ويب",
    quote:
      "الخزنة أزالت التوتر تماماً. أبدأ العمل وأنا أعلم أن المال محجوز — أركّز على الكود فقط.",
    metric: "47",
    metricLabel: "مشروعاً منجزاً",
    initial: "خ",
  },
  {
    name: "نورة الحربي",
    role: "كاتبة محتوى",
    quote:
      "الجسر اللغوي فتح لي أبواب عملاء عالميين. أراسلهم بالعربية، تصل الرسالة بالإنجليزية، والعكس.",
    metric: "98٪",
    metricLabel: "معدّل رضا العملاء",
    initial: "ن",
  },
];

export default function Testimonials() {
  return (
    <section
      className="py-20 sm:py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">قصص نجاح حقيقية</h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
              محترفون بنَوا مسيرتهم على حِرفة — بأرقامهم وكلماتهم.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STORIES.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <article
                className="flex h-full flex-col rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                    style={{
                      backgroundColor: "rgba(212,162,76,0.15)",
                      color: "var(--accent)",
                    }}
                  >
                    {s.initial}
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--heading)" }}
                    >
                      {s.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {s.role}
                    </p>
                  </div>
                </div>

                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star
                      key={k}
                      className="h-4 w-4"
                      fill="var(--accent)"
                      style={{ color: "var(--accent)" }}
                    />
                  ))}
                </div>

                <p
                  className="flex-1 text-sm leading-relaxed"
                  style={{ color: "var(--ink)" }}
                >
                  &ldquo;{s.quote}&rdquo;
                </p>

                <div
                  className="mt-5 flex items-baseline gap-2 border-t pt-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {s.metric}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {s.metricLabel}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
