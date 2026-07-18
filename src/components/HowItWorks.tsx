import Reveal from "./Reveal";

type Step = { num: string; title: string; desc: string };

const BUYER: Step[] = [
  {
    num: "1",
    title: "اطرح مشروعك",
    desc: "اشرح ما تحتاج بلغتك، وحدّد الميزانية والمدة. سنقترح عليك محترفين مناسبين تلقائياً.",
  },
  {
    num: "2",
    title: "اختر وادفع بأمان",
    desc: "قارن العروض وسير الأعمال، ثم ادفع إلى الخزنة. المال لا يصل المحترف إلا بعد قبولك.",
  },
  {
    num: "3",
    title: "استلم واعتمد",
    desc: "راجع التسليم، اطلب تعديلات إن لزم، ثم اعتمد النتيجة. تُنشر الأموال عند الاعتماد.",
  },
];

const PRO: Step[] = [
  {
    num: "1",
    title: "أنشئ ملفك المهني",
    desc: "اعرض أعمالك وشهاداتك، ووثّق هويتك مرة واحدة. مؤشر حِرفة يعكس أداءك عبر الوقت.",
  },
  {
    num: "2",
    title: "قدّم عروضك",
    desc: "اقرأ متطلبات المشروع بلغتك، وقدّم عرضاً واضحاً بسعر ومدة ونطاق مضبوط.",
  },
  {
    num: "3",
    title: "اعمل واقبض",
    desc: "أنجز داخل مساحة عمل المشروع، وسلّم بثقة. تُفرج الأموال تلقائياً عند القبول.",
  },
];

function Column({ title, steps, accent }: { title: string; steps: Step[]; accent: string }) {
  return (
    <Reveal className="rounded-3xl p-8" >
      <div
        className="rounded-3xl p-8"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="mb-6 flex items-center gap-3">
          <span
            className="h-2 w-10 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <ol className="space-y-6">
          {steps.map((s) => (
            <li key={s.num} className="flex gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                style={{
                  backgroundColor: "rgba(212,162,76,0.14)",
                  color: "var(--accent)",
                }}
              >
                {s.num}
              </span>
              <div>
                <p
                  className="text-base font-bold"
                  style={{ color: "var(--heading)" }}
                >
                  {s.title}
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="py-20 sm:py-24"
      style={{ backgroundColor: "var(--surface-2)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">كيف تعمل حِرفة؟</h2>
            <p
              className="mt-3 text-base"
              style={{ color: "var(--muted)" }}
            >
              ثلاث خطوات لكل طرف — بلا تعقيد.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Column title="للمشتري" steps={BUYER} accent="var(--accent)" />
          <Column title="للمحترف" steps={PRO} accent="var(--success)" />
        </div>
      </div>
    </section>
  );
}
