import { Search, ShieldCheck, Languages, Wallet } from "lucide-react";

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
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0E3A46" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(212,162,76,0.25), transparent 45%), radial-gradient(circle at 15% 80%, rgba(212,162,76,0.15), transparent 40%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-28">
        <div className="lg:col-span-7">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/90"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            سوق الخدمات المهنية العربي
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            الأول عربياً،
            <br />
            القادر عالمياً
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            مالك مضمون. قواعدك واضحة. لغتك ليست عائقاً.
          </p>

          <div
            className="mt-8 flex items-center gap-2 rounded-2xl p-2 shadow-lg"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Search
              className="h-5 w-5 shrink-0"
              style={{ color: "var(--muted)", marginInlineStart: "0.5rem" }}
            />
            <input
              type="text"
              placeholder="ابحث عن مهارة، محترف، أو خدمة…"
              className="flex-1 bg-transparent px-2 py-2 text-base outline-none placeholder:text-slate-400"
              style={{ color: "#101828" }}
            />
            <button
              type="button"
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#0E3A46" }}
            >
              ابحث
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/60">شائع:</span>
            {POPULAR_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                className="rounded-full px-3 py-1 text-xs text-white/85 transition-colors hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.18)" }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full px-6 py-3 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--accent)", color: "#0E3A46" }}
            >
              ابدأ مشروعك
            </button>
            <button
              type="button"
              className="rounded-full border px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              انضم كمحترف
            </button>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative mx-auto h-[420px] w-full max-w-md">
            {/* Card 1: Herfa Index */}
            <div
              className="float-a absolute top-0 rounded-2xl p-5 shadow-2xl"
              style={{
                insetInlineEnd: "0",
                width: "220px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                مؤشر حِرفة
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div
                  className="pulse-ring flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold"
                  style={{
                    backgroundColor: "rgba(212,162,76,0.15)",
                    color: "var(--accent)",
                    border: "3px solid var(--accent)",
                  }}
                >
                  ٩٢
                </div>
                <div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--success)" }}
                  >
                    ممتاز
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    ثقة عالية
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Escrow */}
            <div
              className="float-b absolute rounded-2xl p-5 shadow-2xl"
              style={{
                top: "160px",
                insetInlineStart: "0",
                width: "260px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "rgba(27,127,90,0.12)",
                    color: "var(--success)",
                  }}
                >
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    محجوز في الخزنة
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--ink)" }}
                  >
                    ٤٬٥٠٠ ر.س
                  </p>
                </div>
              </div>
              <div
                className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                style={{
                  backgroundColor: "var(--surface-2)",
                  color: "var(--muted)",
                }}
              >
                <ShieldCheck className="h-4 w-4" style={{ color: "var(--success)" }} />
                يُفرج عنه عند القبول
              </div>
            </div>

            {/* Card 3: Language Bridge */}
            <div
              className="float-c absolute rounded-2xl p-5 shadow-2xl"
              style={{
                top: "290px",
                insetInlineEnd: "20px",
                width: "240px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "rgba(212,162,76,0.15)",
                    color: "var(--accent)",
                  }}
                >
                  <Languages className="h-4 w-4" />
                </div>
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--ink)" }}
                >
                  جسر لغوي فوري
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
                &ldquo;Please deliver the logo in vector format.&rdquo;
              </p>
              <div
                className="mt-2 rounded-lg p-2 text-xs"
                style={{
                  backgroundColor: "var(--surface-2)",
                  color: "var(--muted)",
                }}
              >
                يرجى تسليم الشعار بصيغة متجهية.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
