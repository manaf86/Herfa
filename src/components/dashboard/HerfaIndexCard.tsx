import { Info, TrendingUp } from "lucide-react";
import { herfaIndex } from "../../data/dashboard";
import CircularProgress from "./CircularProgress";

function toArabicDigits(n: number): string {
  const map = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}

export default function HerfaIndexCard() {
  return (
    <article
      className="rounded-2xl p-6 sm:p-7"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--heading)" }}
          >
            مؤشر حِرفة
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            كلما ارتفع مؤشرك زادت ظهور خدماتك وتفاضلت عمولتك.
          </p>
        </div>
        <span
          className="hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-flex sm:items-center sm:gap-1.5"
          style={{
            backgroundColor: "var(--success-tint)",
            color: "var(--success)",
          }}
        >
          <TrendingUp className="h-3 w-3" />
          ممتاز
        </span>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr] md:items-start">
        {/* Ring */}
        <div className="flex flex-col items-center gap-3">
          <CircularProgress
            value={herfaIndex.score}
            outOf={herfaIndex.outOf}
            size={160}
            stroke={14}
            label="مؤشر حِرفة"
          />
          <p
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            مؤشرك الحالي
          </p>
        </div>

        {/* Components */}
        <div className="space-y-3.5">
          {herfaIndex.components.map((c) => (
            <div key={c.name}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    {c.name}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    وزن {toArabicDigits(c.weight)}٪
                  </span>
                </div>
                <span
                  className="font-bold tabular-nums"
                  style={{ color: "var(--heading)" }}
                >
                  {toArabicDigits(c.value)}٪
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--surface-2)" }}
                role="progressbar"
                aria-valuenow={c.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={c.name}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${c.value}%`,
                    backgroundColor:
                      c.value >= 90
                        ? "var(--success)"
                        : c.value >= 80
                        ? "var(--accent)"
                        : "var(--alert)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparency box — the product's core promise */}
      <div
        className="mt-6 rounded-xl p-4"
        style={{
          backgroundColor: "var(--info-tint)",
          border: "1px solid var(--info)",
        }}
      >
        <div className="mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" style={{ color: "var(--info)" }} />
          <p
            className="text-sm font-bold"
            style={{ color: "var(--info)" }}
          >
            لماذا تغيّر مؤشرك؟
          </p>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--ink)" }}
        >
          {herfaIndex.changeReason}
        </p>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--ink)" }}
        >
          <span
            className="font-bold"
            style={{ color: "var(--success)" }}
          >
            إرشاد:
          </span>{" "}
          {herfaIndex.guidance}
        </p>
      </div>
    </article>
  );
}
