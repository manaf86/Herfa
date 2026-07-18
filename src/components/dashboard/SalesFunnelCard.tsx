import { Filter, Lightbulb } from "lucide-react";
import { funnel } from "../../data/dashboard";

export default function SalesFunnelCard() {
  const max = Math.max(...funnel.stages.map((s) => s.value));

  return (
    <article
      className="rounded-2xl p-6 sm:p-7"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--heading)" }}
          >
            قمع المبيعات
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            رحلة الزائر من صفحة خدمتك حتى الطلب.
          </p>
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: "var(--accent-tint)",
            color: "var(--accent)",
          }}
        >
          <Filter className="h-4 w-4" />
        </span>
      </header>

      <div className="space-y-2.5">
        {funnel.stages.map((s, i) => {
          const width = (s.value / max) * 100;
          const opacity = 1 - i * 0.16;
          return (
            <div
              key={s.label}
              className="flex justify-center"
            >
              <div
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all"
                style={{
                  width: `${Math.max(width, 22)}%`,
                  minWidth: "160px",
                  backgroundColor: `rgba(212,162,76,${0.10 + opacity * 0.08})`,
                  border: `1px solid var(--accent)`,
                  color: "var(--heading)",
                }}
              >
                <span className="font-medium">{s.label}</span>
                <span className="font-bold tabular-nums">{s.display}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Diagnosis box */}
      <div
        className="mt-6 rounded-xl p-4"
        style={{
          backgroundColor: "var(--info-tint)",
          border: "1px solid var(--info)",
        }}
      >
        <div className="mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4" style={{ color: "var(--info)" }} />
          <p
            className="text-sm font-bold"
            style={{ color: "var(--info)" }}
          >
            تشخيص
          </p>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--ink)" }}
        >
          {funnel.diagnosis}
        </p>
      </div>
    </article>
  );
}
