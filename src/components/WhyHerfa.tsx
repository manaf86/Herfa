import {
  Scale,
  TrendingDown,
  Languages,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    icon: Scale,
    title: "عدالة إجرائية",
    desc: "قرارات النزاع مفسّرة كتابياً، مع حق استئناف حقيقي — لا حظر تلقائي ولا صندوق أسود.",
  },
  {
    icon: TrendingDown,
    title: "عمولة متدرّجة",
    desc: "تبدأ من 15٪ وتنخفض تدريجياً حتى 6٪ مع تراكم أعمالك. كلما أنجزت أكثر، دفعت أقل.",
  },
  {
    icon: Languages,
    title: "جسر لغوي",
    desc: "ترجمة فورية داخل المحادثة بين العربية والإنجليزية. اعمل مع من تريد، بلغة تتقنها.",
  },
  {
    icon: LayoutDashboard,
    title: "مساحة عمل كاملة",
    desc: "ملفات، مهام، ومحادثة في مكان واحد. لا حاجة لأدوات خارجية — كل مشروع منظّم من البداية.",
  },
];

export default function WhyHerfa() {
  return (
    <section
      id="why"
      className="py-20 sm:py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">لماذا حِرفة؟</h2>
            <p
              className="mt-3 text-base"
              style={{ color: "var(--muted)" }}
            >
              نبني منصة يشعر فيها كل طرف بأن قواعد اللعبة عادلة — من اليوم الأول.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 80}>
                <article
                  className="h-full rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "rgba(14,58,70,0.08)",
                      color: "var(--heading)",
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {f.desc}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
