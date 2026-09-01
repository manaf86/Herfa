import Link from "next/link";
import { Search, ArrowLeft, TrendingUp, Lock, ShieldCheck, Languages, Flag, Check } from "lucide-react";
import Reveal from "./Reveal";
import AnimatedRing from "./shared/AnimatedRing";
import FlowLine from "./shared/FlowLine";

const POPULAR_TAGS = [
  "تصميم شعار",
  "كتابة محتوى",
  "مونتاج فيديو",
  "تطوير متجر",
  "ترجمة معتمدة",
];

export default function Hero() {
  return (
    <section
      style={{
        paddingBlock: "clamp(52px, 8vw, 104px)",
        paddingInline: 24,
      }}
    >
      <div style={{ maxWidth: 820, marginInline: "auto", textAlign: "center" }}>
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
          style={{
            border: "1px solid var(--border)",
            color: "var(--muted)",
            backgroundColor: "var(--surface)",
          }}
        >
          سوق الخدمات المهنية العربي — الأول عربياً، القادر عالمياً
        </span>

        <h1
          className="font-bold"
          style={{
            fontSize: "clamp(32px, 6vw, 60px)",
            lineHeight: 1.14,
            color: "var(--heading)",
            margin: "22px 0 0",
            letterSpacing: "-0.5px",
          }}
        >
          أنجز أعمالك مع نخبة المحترفين في العالم العربي
        </h1>

        <p
          style={{
            fontSize: "clamp(17px, 2.4vw, 22px)",
            color: "var(--muted)",
            lineHeight: 1.6,
            margin: "20px auto 0",
            maxWidth: 620,
          }}
        >
          <strong style={{ color: "var(--ink)" }}>مالك مضمون.</strong>{" "}
          <strong style={{ color: "var(--ink)" }}>قواعدك واضحة.</strong>{" "}
          <strong style={{ color: "var(--ink)" }}>لغتك ليست عائقاً.</strong>
        </p>

        <div
          className="flex items-center gap-2 shadow-lg"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "8px 8px 8px 16px",
            maxWidth: 620,
            marginInline: "auto",
            marginBlockStart: 30,
          }}
        >
          <Search className="h-5 w-5 shrink-0" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="ابحث عن مهارة… تصميم شعار، تطوير موقع، ترجمة"
            className="flex-1 bg-transparent px-2 py-2 text-base outline-none"
            style={{ color: "var(--ink)", minWidth: 0 }}
          />
          <Link
            href="/marketplace"
            className="shrink-0 rounded-lg px-5 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: "var(--btn-primary-bg)", color: "var(--btn-primary-fg)" }}
          >
            ابحث
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2" style={{ marginBlockStart: 16 }}>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            شائع:
          </span>
          {POPULAR_TAGS.map((t) => (
            <Link
              key={t}
              href="/marketplace"
              className="rounded-full px-3.5 py-1.5 text-sm transition-colors hover:text-[var(--accent)]"
              style={{ border: "1px solid var(--border)", color: "var(--ink)", backgroundColor: "var(--surface)" }}
            >
              {t}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3.5" style={{ marginBlockStart: 32 }}>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--btn-primary-bg)",
              color: "var(--btn-primary-fg)",
              padding: "15px 28px",
            }}
          >
            ابدأ مشروعك
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2.5 rounded-xl text-sm font-bold transition-colors hover:border-[var(--heading)]"
            style={{
              color: "var(--heading)",
              padding: "15px 28px",
              border: "1.5px solid var(--border)",
            }}
          >
            انضم كمحترف
          </Link>
        </div>
      </div>

      <Reveal className="relative" style={{ maxWidth: 1000, marginInline: "auto", marginBlockStart: "clamp(44px, 6vw, 64px)" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            insetBlockStart: "-8%",
            insetInline: "12%",
            height: "72%",
            background:
              "radial-gradient(ellipse at center, rgba(212,162,76,0.2), transparent 70%)",
            filter: "blur(34px)",
            zIndex: 0,
          }}
        />

        <div
          className="relative z-10 flex flex-wrap items-start justify-center gap-4.5"
          style={{ gap: 18 }}
        >
          {/* بطاقة ١: مؤشر حِرفة */}
          <div
            className="float-a flex items-center gap-3.5 shadow-2xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: "18px 20px",
              width: 222,
              textAlign: "start",
            }}
          >
            <div className="relative shrink-0" style={{ width: 70, height: 70 }}>
              <AnimatedRing pct={94} size={70} stroke={8} />
              <div
                className="absolute inset-0 grid place-items-center font-bold"
                style={{ fontSize: 20, color: "var(--heading)" }}
              >
                94
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                مؤشر حِرفة
              </div>
              <div
                className="inline-flex items-center gap-1"
                style={{ fontSize: 12.5, color: "var(--success)", marginBlockStart: 3 }}
              >
                <TrendingUp className="h-3.5 w-3.5" /> أداء ممتاز
              </div>
            </div>
          </div>

          {/* بطاقة ٢: الخزنة */}
          <div
            className="float-b shadow-2xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 18,
              width: 232,
              textAlign: "start",
              marginBlockStart: 38,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="pulse-ring grid shrink-0 place-items-center"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: "rgba(27,127,90,0.14)",
                  color: "var(--success)",
                }}
              >
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  محجوز في الخزنة
                </div>
                <div className="font-bold" style={{ color: "var(--heading)", fontSize: 19 }}>
                  4,500{" "}
                  <span className="font-semibold" style={{ fontSize: 12, color: "var(--muted)" }}>
                    ر.س
                  </span>
                </div>
              </div>
            </div>
            <div
              className="overflow-hidden"
              style={{
                height: 6,
                borderRadius: 4,
                backgroundColor: "var(--surface-2)",
                marginBlockStart: 14,
              }}
            >
              <FlowLine style={{ height: "100%", width: "100%", backgroundColor: "var(--success)", borderRadius: 4 }} delay={0.3} />
            </div>
            <div
              className="inline-flex items-center gap-1.5"
              style={{ fontSize: 11.5, color: "var(--muted)", marginBlockStart: 9 }}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> يُفرج عند اعتماد التسليم
            </div>
          </div>

          {/* بطاقة ٣: الجسر اللغوي */}
          <div
            className="float-c shadow-2xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 16,
              width: 240,
              textAlign: "start",
              marginBlockStart: 10,
            }}
          >
            <div
              className="inline-flex items-center gap-2 font-semibold"
              style={{ fontSize: 12, color: "var(--accent)", marginBlockEnd: 11 }}
            >
              <Languages className="h-3.5 w-3.5" /> جسر لغوي فوري
            </div>
            <div
              style={{
                backgroundColor: "var(--surface-2)",
                borderRadius: 10,
                padding: "9px 12px",
                fontSize: 13.5,
                color: "var(--ink)",
                marginBlockEnd: 9,
              }}
            >
              أحتاج تصميم شعار لمتجري
            </div>
            <div
              className="flex items-center gap-1.5"
              style={{ color: "var(--muted)", fontSize: 11, marginBlockEnd: 9 }}
            >
              ↓ ترجمة تلقائية
            </div>
            <div
              style={{
                backgroundColor: "rgba(212,162,76,0.12)",
                borderRadius: 10,
                padding: "9px 12px",
                fontSize: 13.5,
                color: "var(--heading)",
                direction: "ltr",
                textAlign: "left",
              }}
            >
              I need a logo for my store
            </div>
          </div>

          {/* بطاقة ٤: معلم مالي */}
          <div
            className="float-a inline-flex items-center gap-2.5 shadow-2xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "12px 16px",
              marginBlockStart: 48,
            }}
          >
            <span
              className="grid shrink-0 place-items-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "rgba(212,162,76,0.16)",
                color: "var(--accent)",
              }}
            >
              <Flag className="h-4 w-4" />
            </span>
            <div style={{ textAlign: "start" }}>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>معلم مالي</div>
              <div
                className="inline-flex items-center gap-1.5 font-semibold"
                style={{ color: "var(--heading)", fontSize: 13.5 }}
              >
                المرحلة 2 مُفرج عنها
                <Check className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
