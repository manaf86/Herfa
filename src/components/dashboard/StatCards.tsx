import {
  Activity,
  Clock,
  AlertTriangle,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { stats, type Stat, type StatColor } from "../../data/dashboard";

const ICON: Record<Stat["icon"], LucideIcon> = {
  activity: Activity,
  clock: Clock,
  alert: AlertTriangle,
  wallet: Wallet,
};

const COLOR: Record<
  StatColor,
  { fg: string; tint: string; label: string }
> = {
  heading: {
    fg: "var(--heading)",
    tint: "rgba(14,58,70,0.08)",
    label: "أساسي",
  },
  accent: {
    fg: "var(--accent)",
    tint: "var(--accent-tint)",
    label: "تنبيه",
  },
  alert: {
    fg: "var(--alert)",
    tint: "var(--alert-tint)",
    label: "خطأ",
  },
  success: {
    fg: "var(--success)",
    tint: "var(--success-tint)",
    label: "نجاح",
  },
  info: {
    fg: "var(--info)",
    tint: "var(--info-tint)",
    label: "معلومة",
  },
};

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => {
        const Icon = ICON[s.icon];
        const color = COLOR[s.color];
        return (
          <article
            key={s.key}
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderInlineStartWidth: "4px",
              borderInlineStartColor: color.fg,
            }}
          >
            <div className="flex items-start justify-between">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--muted)" }}
              >
                {s.label}
              </p>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: color.tint, color: color.fg }}
              >
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p
              className="mt-3 text-3xl font-bold leading-tight"
              style={{ color: "var(--heading)" }}
            >
              {s.value}
            </p>
            <p
              className="mt-1.5 text-xs"
              style={{ color: "var(--muted)" }}
            >
              {s.note}
            </p>
          </article>
        );
      })}
    </div>
  );
}
