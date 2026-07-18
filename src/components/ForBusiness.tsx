import {
  FileText,
  Clock,
  Users,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

type Feat = { icon: LucideIcon; title: string; desc: string };

const FEATS: Feat[] = [
  {
    icon: FileText,
    title: "فواتير نظامية",
    desc: "فواتير ضريبية معتمدة تحمل شعارك، جاهزة للمحاسبة والامتثال.",
  },
  {
    icon: Clock,
    title: "دفع آجل",
    desc: "نت-٣٠ أو نت-٦٠ للشركات المؤهّلة. المحترف يقبض فوراً، وأنت تدفع لاحقاً.",
  },
  {
    icon: Users,
    title: "فرق وصلاحيات",
    desc: "أعضاء متعدّدون بأدوار مختلفة — مدير مشروع، مراجع، محاسب — بصلاحيات دقيقة.",
  },
  {
    icon: UserCheck,
    title: "مدير حساب مخصّص",
    desc: "شخص واحد يعرف حسابك، يتابع مشاريعك، ويستجيب خلال ساعات لا أيام.",
  },
];

export default function ForBusiness() {
  return (
    <section
      id="business"
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ backgroundColor: "#0E3A46" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 30%, rgba(212,162,76,0.25), transparent 40%), radial-gradient(circle at 10% 90%, rgba(212,162,76,0.15), transparent 40%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white/90"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
              حِرفة للشركات
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              فريق مرن يعمل معك، على مقاسك
            </h2>
            <p className="mt-3 text-base text-white/80">
              أدوات مؤسسية لإدارة الاستقلاليين على نطاق واسع — بامتثال محلي كامل.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATS.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 80}>
                <article
                  className="h-full rounded-2xl p-6"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <span
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "rgba(212,162,76,0.18)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {f.desc}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              className="rounded-full px-8 py-3.5 text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--accent)", color: "#0E3A46" }}
            >
              تواصل مع المبيعات
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
