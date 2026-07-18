"use client";

import {
  Wallet,
  Lock,
  Clock,
  TrendingUp,
  Lightbulb,
  ArrowDownRight,
} from "lucide-react";
import {
  balances,
  monthlyEarnings,
  transactions,
  earningsTip,
  TRANSACTION_TYPE_META,
  TRANSACTION_STATUS_META,
} from "../../../data/earnings";

export default function EarningsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6">
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--heading)" }}
        >
          الأرباح
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--muted)" }}>
          رصيدك، المدفوعات المعتمدة، وسجل المعاملات.
        </p>
      </header>

      {/* Balance cards */}
      <BalanceCards />

      {/* Monthly chart */}
      <div className="mt-8">
        <MonthlyChart />
      </div>

      {/* Transactions */}
      <div className="mt-8">
        <TransactionsCard />
      </div>

      {/* Tip */}
      <div className="mt-6">
        <TipCard />
      </div>
    </div>
  );
}

// ═══════════ Balance cards ═══════════
function BalanceCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <BalanceCard
        icon={<Wallet className="h-4 w-4" />}
        label="متاح للسحب"
        value={balances.available.display}
        color="success"
        cta="اسحب الآن"
      />
      <BalanceCard
        icon={<Lock className="h-4 w-4" />}
        label="في الخزنة"
        value={balances.inEscrow.display}
        color="accent"
        hint="يُفرَج بعد الاعتماد"
      />
      <BalanceCard
        icon={<Clock className="h-4 w-4" />}
        label="قيد التصفية"
        value={balances.pendingClearance.display}
        color="info"
        hint="متاح خلال 3 أيام"
      />
      <BalanceCard
        icon={<TrendingUp className="h-4 w-4" />}
        label="مكتسب هذا الشهر"
        value={balances.earnedThisMonth.display}
        color="heading"
        hint="إجمالي إيرادات يوليو"
      />
    </div>
  );
}

function BalanceCard({
  icon,
  label,
  value,
  color,
  cta,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "success" | "accent" | "info" | "heading";
  cta?: string;
  hint?: string;
}) {
  const meta = {
    success: { fg: "var(--success)", bg: "var(--success-tint)" },
    accent: { fg: "var(--accent)", bg: "var(--accent-tint)" },
    info: { fg: "var(--info)", bg: "var(--info-tint)" },
    heading: { fg: "var(--heading)", bg: "rgba(14,58,70,0.08)" },
  }[color];

  return (
    <article
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderInlineStartWidth: "4px",
        borderInlineStartColor: meta.fg,
      }}
    >
      <div className="flex items-start justify-between">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </p>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: meta.bg, color: meta.fg }}
        >
          {icon}
        </span>
      </div>
      <p
        className="mt-3 text-2xl font-bold leading-tight tabular-nums"
        style={{ color: "var(--heading)" }}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
          {hint}
        </p>
      )}
      {cta && (
        <button
          type="button"
          onClick={() => {
            /* TODO: يفتح شات السحب مع الوسيط البنكي */
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: meta.fg, color: "#FFFFFF" }}
        >
          <ArrowDownRight className="h-3.5 w-3.5" />
          {cta}
        </button>
      )}
    </article>
  );
}

// ═══════════ Monthly chart (CSS bars) ═══════════
function MonthlyChart() {
  const max = Math.max(...monthlyEarnings.map((m) => m.value));

  return (
    <section
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--heading)" }}
          >
            الأرباح الشهرية
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            آخر 6 أشهر — الشهر الحالي بلون مميّز.
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp
            className="h-3.5 w-3.5"
            style={{ color: "var(--success)" }}
          />
          <span style={{ color: "var(--success)" }}>+20٪ عن يونيو</span>
        </div>
      </header>

      <div
        className="grid items-end gap-3"
        style={{
          gridTemplateColumns: `repeat(${monthlyEarnings.length}, minmax(0, 1fr))`,
          minHeight: "220px",
        }}
      >
        {monthlyEarnings.map((m) => {
          const heightPct = (m.value / max) * 100;
          return (
            <div key={m.key} className="flex flex-col items-center gap-2">
              {/* Value label */}
              <span
                className="text-xs tabular-nums"
                style={{
                  color: m.current ? "var(--heading)" : "var(--muted)",
                  fontWeight: m.current ? 700 : 500,
                }}
              >
                {m.display}
              </span>
              {/* Bar */}
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${heightPct}%`,
                  minHeight: "12px",
                  backgroundColor: m.current
                    ? "var(--accent)"
                    : "var(--surface-2)",
                  border: `1px solid ${
                    m.current ? "var(--accent)" : "var(--border)"
                  }`,
                }}
                aria-label={`${m.label}: ${m.display}`}
                role="img"
              />
              {/* Month label */}
              <span
                className="text-xs"
                style={{
                  color: m.current ? "var(--heading)" : "var(--muted)",
                  fontWeight: m.current ? 700 : 500,
                }}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ═══════════ Transactions ═══════════
function TransactionsCard() {
  return (
    <section
      className="overflow-hidden rounded-2xl"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <header
        className="flex flex-wrap items-center justify-between gap-3 px-6 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--heading)" }}
          >
            سجل المعاملات
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            آخر 10 معاملات على حسابك.
          </p>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--surface-2)" }}>
              <Th>التاريخ</Th>
              <Th>الوصف</Th>
              <Th>النوع</Th>
              <Th align="end">المبلغ</Th>
              <Th>الحالة</Th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => {
              const type = TRANSACTION_TYPE_META[t.type];
              const status = TRANSACTION_STATUS_META[t.status];
              const isPositive = t.amount > 0;
              return (
                <tr
                  key={t.id}
                  style={{
                    borderTop:
                      i === 0 ? "none" : "1px solid var(--border)",
                  }}
                >
                  <Td muted>{t.date}</Td>
                  <Td>
                    <span style={{ color: "var(--heading)" }}>
                      {t.description}
                    </span>
                  </Td>
                  <Td>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                      style={{ backgroundColor: type.bg, color: type.fg }}
                    >
                      {type.label}
                    </span>
                  </Td>
                  <Td align="end">
                    <span
                      className="font-bold tabular-nums"
                      style={{
                        color: isPositive
                          ? "var(--success)"
                          : "var(--muted)",
                      }}
                    >
                      {t.amountDisplay}
                    </span>
                  </Td>
                  <Td>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                      style={{
                        backgroundColor: status.bg,
                        color: status.fg,
                      }}
                    >
                      {status.label}
                    </span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ═══════════ Tip card ═══════════
function TipCard() {
  return (
    <article
      className="flex items-start gap-3 rounded-2xl p-5"
      style={{
        backgroundColor: "var(--info-tint)",
        border: "1px solid var(--info)",
      }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--info)",
        }}
      >
        <Lightbulb className="h-4 w-4" />
      </span>
      <div>
        <p
          className="text-sm font-bold"
          style={{ color: "var(--info)" }}
        >
          تلميح
        </p>
        <p
          className="mt-1 text-sm leading-relaxed"
          style={{ color: "var(--ink)" }}
        >
          {earningsTip.text}
        </p>
      </div>
    </article>
  );
}

function Th({
  children,
  align = "start",
}: {
  children: React.ReactNode;
  align?: "start" | "end";
}) {
  return (
    <th
      className="px-6 py-3 text-xs font-bold uppercase tracking-wider"
      style={{
        color: "var(--muted)",
        textAlign: align,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "start",
  muted = false,
}: {
  children: React.ReactNode;
  align?: "start" | "end";
  muted?: boolean;
}) {
  return (
    <td
      className="px-6 py-4 text-sm"
      style={{
        color: muted ? "var(--muted)" : "var(--ink)",
        textAlign: align,
      }}
    >
      {children}
    </td>
  );
}
