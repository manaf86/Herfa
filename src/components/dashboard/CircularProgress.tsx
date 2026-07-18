type Props = {
  value: number;
  outOf?: number;
  size?: number;
  stroke?: number;
  label?: string;
};

export default function CircularProgress({
  value,
  outOf = 100,
  size = 148,
  stroke = 12,
  label,
}: Props) {
  const pct = Math.max(0, Math.min(100, (value / outOf) * 100));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const c = size / 2;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? "قيمة"} ${value} من ${outOf}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="var(--surface-2)"
        />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="var(--accent)"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${c} ${c})`}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-bold leading-none"
          style={{ color: "var(--heading)" }}
        >
          {toArabicDigits(value)}
        </span>
        <span
          className="mt-1 text-xs"
          style={{ color: "var(--muted)" }}
        >
          من {toArabicDigits(outOf)}
        </span>
      </div>
    </div>
  );
}

function toArabicDigits(n: number): string {
  const map = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}
