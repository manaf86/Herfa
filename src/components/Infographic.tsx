import { BarChart3, Lock, Hourglass, Wallet, Star } from "lucide-react";
import Reveal from "./Reveal";
import AnimatedNumber from "./shared/AnimatedNumber";
import FlowLine from "./shared/FlowLine";

type Stat = { target: number; decimals?: number; suffix?: React.ReactNode; label: string };

const STATS: Stat[] = [
  { target: 4.2, decimals: 1, suffix: <span style={{ fontSize: 18, color: "var(--accent)", fontWeight: 700 }}> مليون</span>, label: "ريال صُرفت للمحترفين هذا الشهر" },
  { target: 98, suffix: <span style={{ color: "var(--accent)" }}>٪</span>, label: "نسبة التسليم في الموعد" },
  { target: 1200, suffix: <span style={{ color: "var(--accent)" }}>+</span>, label: "محترف معتمد ونشط" },
  {
    target: 4.9,
    decimals: 1,
    suffix: (
      <span style={{ color: "var(--accent)", display: "inline-flex", fontSize: 22 }}>
        <Star className="h-5 w-5" fill="var(--accent)" />
      </span>
    ),
    label: "متوسط تقييم المحترفين",
  },
];

const STAGES = [
  { icon: Lock, title: "في الخزنة", desc: "يُحجز المبلغ فور الشراء ولا يصل البائع", border: "var(--border)", color: "var(--heading)" },
  { icon: Hourglass, title: "التصفية", desc: "خمسة أيام حماية بعد اعتماد التسليم", border: "var(--accent)", color: "var(--accent)" },
  { icon: Wallet, title: "قابل للسحب", desc: "رصيد جاهز للتحويل إلى حسابك", border: "var(--success)", color: "var(--success)" },
];

export default function Infographic() {
  return (
    <section
      style={{
        backgroundColor: "var(--surface)",
        borderBlock: "1px solid var(--border)",
        paddingBlock: "clamp(56px, 8vw, 96px)",
        paddingInline: 24,
      }}
    >
      <div style={{ maxWidth: 1180, marginInline: "auto" }}>
        <Reveal style={{ textAlign: "center", maxWidth: 660, marginInline: "auto", marginBlockEnd: "clamp(40px, 5vw, 56px)" }}>
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
            style={{ border: "1px solid var(--accent)", color: "var(--heading)", backgroundColor: "rgba(212,162,76,0.12)" }}
          >
            <BarChart3 className="h-3.5 w-3.5" /> شفافية بالأرقام
          </span>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(26px, 4vw, 40px)", color: "var(--heading)", margin: "18px 0 12px", lineHeight: 1.2 }}
          >
            رحلة مالك، مكشوفة بالكامل
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 17, margin: 0, lineHeight: 1.6 }}>
            من أول ريال في الخزنة إلى آخر دفعة في حسابك — كل خطوة واضحة.
          </p>
        </Reveal>

        <Reveal
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 18,
            marginBlockEnd: "clamp(40px, 5vw, 60px)",
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "26px 22px",
                textAlign: "center",
              }}
            >
              <div
                className="font-bold"
                style={{ fontSize: "clamp(30px, 4vw, 40px)", color: "var(--heading)", lineHeight: 1, display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <AnimatedNumber target={s.target} decimals={s.decimals} />
                {s.suffix}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 14, marginBlockStart: 10, lineHeight: 1.5 }}>
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal
          style={{
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "clamp(24px, 4vw, 40px)",
          }}
        >
          <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--muted)", marginBlockEnd: 30 }}>
            مسار المال داخل حِرفة
          </div>

          <div className="relative" style={{ paddingBlock: "6px 4px" }}>
            <div
              aria-hidden
              className="absolute"
              style={{ insetBlockStart: 34, insetInline: "16%", height: 3, backgroundColor: "var(--border)", borderRadius: 2 }}
            />
            <FlowLine
              className="absolute"
              style={{ insetBlockStart: 34, insetInline: "16%", height: 3, backgroundColor: "var(--accent)", borderRadius: 2 }}
              delay={0.2}
            />
            <div className="relative grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {STAGES.map((st) => {
                const Icon = st.icon;
                return (
                  <div key={st.title} className="flex flex-col items-center gap-2.5" style={{ textAlign: "center" }}>
                    <span
                      className="grid place-items-center shrink-0"
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        backgroundColor: "var(--surface)",
                        border: `2px solid ${st.border}`,
                        color: st.color,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="font-semibold" style={{ color: "var(--ink)", fontSize: 15 }}>
                      {st.title}
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: 12.5, lineHeight: 1.5, maxWidth: 180 }}>
                      {st.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBlockStart: 36, paddingBlockStart: 28, borderBlockStart: "1px solid var(--border)" }}>
            <div className="flex justify-between font-semibold" style={{ fontSize: 13.5, color: "var(--muted)", marginBlockEnd: 9 }}>
              <span>العمولة تبدأ 15٪</span>
              <span>وتنخفض إلى 6٪</span>
            </div>
            <div
              className="overflow-hidden"
              style={{ height: 12, borderRadius: 8, backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <FlowLine
                style={{
                  height: "100%",
                  width: "100%",
                  background: "linear-gradient(90deg, var(--accent), var(--success))",
                }}
                delay={0.25}
              />
            </div>
            <div style={{ textAlign: "center", fontSize: 14, color: "var(--ink)", marginBlockStart: 14 }}>
              كلما نميت، قلّت العمولة — <strong style={{ color: "var(--heading)" }}>صفر عمولة على الإكراميات.</strong>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
