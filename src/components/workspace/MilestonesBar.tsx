import { CheckCircle2, Lock, Circle, Sparkles } from "lucide-react";
import {
  milestones,
  workspaceOrder,
  type Milestone,
} from "../../data/workspace";

const STATE_META = {
  released: {
    label: "مُفرج عنه",
    Icon: CheckCircle2,
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  "in-escrow": {
    label: "محجوز في الخزنة",
    Icon: Lock,
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  upcoming: {
    label: "قادم",
    Icon: Circle,
    fg: "var(--muted)",
    bg: "rgba(148,148,148,0.10)",
  },
} as const;

export default function MilestonesBar() {
  return (
    <section
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2
            className="text-base font-bold"
            style={{ color: "var(--heading)" }}
          >
            المعالم المالية
          </h2>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            <Sparkles className="h-3 w-3" />
            حصري لـ حِرفة
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            إجمالي المشروع
          </span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: "var(--heading)" }}
          >
            {workspaceOrder.totalDisplay}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {milestones.map((m) => (
          <MilestoneChip key={m.id} m={m} />
        ))}
      </div>

      <p
        className="mt-4 text-xs leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        كل دفعة محفوظة في الخزنة وتُفرَج تلقائياً عند اعتماد المعلم.
      </p>
    </section>
  );
}

function MilestoneChip({ m }: { m: Milestone }) {
  const meta = STATE_META[m.state];
  const Icon = meta.Icon;
  return (
    <div
      className="rounded-xl p-3"
      style={{
        backgroundColor: meta.bg,
        border: `1px solid ${meta.fg}`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-bold"
            style={{ color: "var(--heading)" }}
          >
            {m.name}
          </p>
          <p
            className="mt-0.5 text-lg font-bold tabular-nums"
            style={{ color: "var(--heading)" }}
          >
            {m.amountDisplay}
          </p>
        </div>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--surface)", color: meta.fg }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p
        className="mt-2 text-[11px] font-bold"
        style={{ color: meta.fg }}
      >
        {meta.label}
      </p>
    </div>
  );
}
