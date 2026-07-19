"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Calendar,
  RefreshCcw,
  Wallet,
  User,
  Package as PackageIcon,
  Info,
  Loader2,
} from "lucide-react";
import {
  orders,
  ORDER_TABS,
  ORDER_STATUS_META,
  type Order,
  type OrderStatus,
} from "../../../data/orders";
import RealOrderCard, {
  type RealOrder,
} from "@/components/dashboard/RealOrderCard";

type TabKey = "all" | OrderStatus;

export default function OrdersPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [realOrders, setRealOrders] = useState<RealOrder[] | null>(null);
  const [meId, setMeId] = useState<string | null>(null);

  // اجلب طلباتي الحقيقية + مُعرّف المستخدم الحالي (لتحديد "أنا مشترٍ أم بائع").
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meRes, ordersRes] = await Promise.all([
          fetch("/api/auth/me", { credentials: "same-origin" }),
          fetch("/api/orders", { credentials: "same-origin" }),
        ]);
        if (!cancelled && meRes.ok) {
          const d = await meRes.json();
          setMeId(d.user?.id ?? null);
        }
        if (!cancelled && ordersRes.ok) {
          const d = await ordersRes.json();
          setRealOrders(d.orders ?? []);
        } else if (!cancelled) {
          setRealOrders([]);
        }
      } catch {
        if (!cancelled) setRealOrders([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (tab === "all" ? orders : orders.filter((o) => o.status === tab)),
    [tab]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6">
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--heading)" }}
        >
          الطلبات
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--muted)" }}>
          كل طلباتك النشطة والمكتملة في مكان واحد.
        </p>
      </header>

      {/* ═══ الطلبات الحقيقية من قاعدة البيانات ═══ */}
      <section className="mb-8">
        <div className="mb-3 flex items-baseline gap-2">
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--heading)" }}
          >
            طلباتك
          </h2>
          {realOrders && (
            <span
              className="text-xs"
              style={{ color: "var(--muted)" }}
            >
              {realOrders.length} طلب حقيقي
            </span>
          )}
        </div>

        {realOrders === null ? (
          <div
            className="flex items-center gap-2 rounded-2xl p-6 text-sm"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px dashed var(--border)",
              color: "var(--muted)",
            }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            جارٍ جلب طلباتك…
          </div>
        ) : realOrders.length === 0 ? (
          <div
            className="rounded-2xl p-6 text-sm"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px dashed var(--border)",
              color: "var(--muted)",
            }}
          >
            ليس لديك طلبات بعد. عندما تبدأ طلباً من صفحة خدمة، سيظهر هنا.
          </div>
        ) : (
          <div className="space-y-3">
            {realOrders.map((o) => (
              <RealOrderCard key={o.id} order={o} meId={meId ?? ""} />
            ))}
          </div>
        )}
      </section>

      {/* ═══ أمثلة توضيحية — بيانات وهمية للاستعراض ═══ */}
      {/*
        ملاحظة: هذا القسم مؤقّت لعرض تصميم كل حالات دورة الحياة قبل امتلاء
        قاعدة البيانات. سيختفي حين تصبح الطلبات الحقيقية كافية.
      */}
      <div
        className="mb-4 flex items-start gap-2 rounded-xl p-3 text-sm"
        style={{
          backgroundColor: "var(--info-tint)",
          border: "1px solid var(--info)",
          color: "var(--ink)",
        }}
      >
        <Info
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ color: "var(--info)" }}
        />
        <span className="leading-relaxed">
          <span
            className="font-bold"
            style={{ color: "var(--info)" }}
          >
            أمثلة توضيحية —
          </span>{" "}
          البطاقات أدناه بيانات عرض لكل حالات الطلب. ستختفي حين تصبح لديك
          طلبات حقيقية كافية.
        </span>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="فلترة الطلبات"
        className="mb-6 flex flex-wrap gap-1.5 rounded-full p-1"
        style={{
          backgroundColor: "var(--surface-2)",
          border: "1px solid var(--border)",
          width: "fit-content",
        }}
      >
        {ORDER_TABS.map((t) => {
          const active = tab === t.key;
          const count =
            t.key === "all"
              ? orders.length
              : orders.filter((o) => o.status === t.key).length;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                backgroundColor: active ? "var(--surface)" : "transparent",
                color: active ? "var(--heading)" : "var(--muted)",
                fontWeight: active ? 700 : 500,
                boxShadow: active ? "var(--shadow-sm)" : "none",
              }}
            >
              {t.label}
              <span
                className="mx-1.5 rounded-full px-1.5 text-[10px]"
                style={{
                  backgroundColor: active
                    ? "var(--accent-tint)"
                    : "rgba(148,148,148,0.15)",
                  color: active ? "var(--accent)" : "var(--muted)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

// ═══════════ Order Card ═══════════
function OrderCard({ order }: { order: Order }) {
  const status = ORDER_STATUS_META[order.status];
  const isActive = order.status === "active";
  const partyLabel = order.myRole === "buyer" ? "البائع" : "العميل";

  return (
    <article
      className="rounded-2xl p-5 sm:p-6"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Row 1 — id + status + date */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: "var(--muted)" }}
        >
          {order.id}
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ backgroundColor: status.bg, color: status.fg }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: status.fg }}
          />
          {status.label}
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--muted)" }}
        >
          طُلب في {order.orderedAt}
        </span>
      </div>

      {/* Row 2 — title + party */}
      <h2
        className="text-lg font-bold leading-snug"
        style={{ color: "var(--heading)" }}
      >
        {order.serviceTitle}
      </h2>
      <p
        className="mt-1 flex items-center gap-1.5 text-sm"
        style={{ color: "var(--muted)" }}
      >
        <User className="h-3.5 w-3.5" />
        {partyLabel}: {order.otherParty}
      </p>

      {/* Row 3 — value + revisions + delivery */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetaChip
          icon={<Wallet className="h-3.5 w-3.5" />}
          label="القيمة"
          value={order.amountDisplay}
        />
        <MetaChip
          icon={<RefreshCcw className="h-3.5 w-3.5" />}
          label="تعديلات متبقّية"
          value={String(order.revisionsLeft)}
        />
        <MetaChip
          icon={<Calendar className="h-3.5 w-3.5" />}
          label="التسليم"
          value={order.deliveryLabel}
        />
      </div>

      {/* Countdown for active orders */}
      {isActive && <Countdown deliveryIso={order.deliveryDueAt} />}

      {/* Actions */}
      <div
        className="mt-5 flex flex-wrap gap-2 border-t pt-4"
        style={{ borderColor: "var(--border)" }}
      >
        <OrderActions order={order} />
      </div>
    </article>
  );
}

// ═══════════ Real-time Countdown ═══════════
function Countdown({ deliveryIso }: { deliveryIso: string }) {
  const [now, setNow] = useState(() => Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(deliveryIso).getTime();
  const diff = target - now;
  const overdue = diff < 0;
  const absDiff = Math.abs(diff);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (!mounted) {
    return (
      <div
        className="mt-4 rounded-xl p-3"
        style={{ backgroundColor: "var(--surface-2)" }}
      />
    );
  }

  return (
    <div
      className="mt-4 flex items-center gap-3 rounded-xl p-3"
      style={{
        backgroundColor: overdue ? "var(--alert-tint)" : "var(--info-tint)",
        border: `1px solid ${overdue ? "var(--alert)" : "var(--info)"}`,
      }}
    >
      <Clock
        className="h-4 w-4 shrink-0"
        style={{ color: overdue ? "var(--alert)" : "var(--info)" }}
      />
      <div className="flex-1">
        <p
          className="text-xs"
          style={{ color: overdue ? "var(--alert)" : "var(--info)", fontWeight: 700 }}
        >
          {overdue ? "متأخّر منذ" : "الوقت المتبقّي للتسليم"}
        </p>
        <div
          className="mt-0.5 flex items-baseline gap-2 tabular-nums"
          style={{ color: "var(--heading)" }}
          aria-live="polite"
        >
          <TimeCell v={days} label="يوم" />
          <span style={{ color: "var(--muted)" }}>·</span>
          <TimeCell v={hours} label="ساعة" />
          <span style={{ color: "var(--muted)" }}>·</span>
          <TimeCell v={mins} label="دقيقة" />
        </div>
      </div>
    </div>
  );
}

function TimeCell({ v, label }: { v: number; label: string }) {
  return (
    <span>
      <span className="text-lg font-bold">{String(v).padStart(2, "0")}</span>
      <span className="ms-1 text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </span>
    </span>
  );
}

// ═══════════ Action buttons per status ═══════════
function OrderActions({ order }: { order: Order }) {
  const noop = () => {}; // TODO: ربط بمنطق الإجراء الحقيقي

  switch (order.status) {
    case "active":
      if (order.myRole === "seller") {
        return (
          <>
            <PrimaryBtn onClick={noop}>سلّم العمل</PrimaryBtn>
            <GhostBtn onClick={noop}>اقترح تمديد</GhostBtn>
          </>
        );
      }
      return (
        <>
          <GhostBtn onClick={noop}>عرض المتطلبات</GhostBtn>
          <GhostBtn onClick={noop}>افتح المحادثة</GhostBtn>
        </>
      );
    case "awaiting-delivery":
      return (
        <>
          <PrimaryBtn onClick={noop}>اعتمد العمل</PrimaryBtn>
          <GhostBtn onClick={noop}>اطلب تعديل</GhostBtn>
          <GhostBtn onClick={noop} tone="alert">افتح نزاع</GhostBtn>
        </>
      );
    case "completed":
      return (
        <>
          <PrimaryBtn onClick={noop}>اعرض التسليم</PrimaryBtn>
          <GhostBtn onClick={noop}>كرّر الطلب</GhostBtn>
        </>
      );
    case "cancelled":
      return (
        <GhostBtn onClick={noop}>عرض سجل الطلب</GhostBtn>
      );
    case "disputed":
      return (
        <PrimaryBtn onClick={noop} tone="alert">
          عرض تفاصيل النزاع
        </PrimaryBtn>
      );
  }
}

function PrimaryBtn({
  onClick,
  children,
  tone,
}: {
  onClick: () => void;
  children: React.ReactNode;
  tone?: "alert";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
      style={{
        backgroundColor:
          tone === "alert" ? "var(--alert)" : "var(--btn-primary-bg)",
        color: tone === "alert" ? "#FFFFFF" : "var(--btn-primary-fg)",
      }}
    >
      {children}
    </button>
  );
}

function GhostBtn({
  onClick,
  children,
  tone,
}: {
  onClick: () => void;
  children: React.ReactNode;
  tone?: "alert";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
      style={{
        border: `1px solid ${tone === "alert" ? "var(--alert)" : "var(--border)"}`,
        color: tone === "alert" ? "var(--alert)" : "var(--ink)",
      }}
    >
      {children}
    </button>
  );
}

function MetaChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{
        backgroundColor: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="flex items-center gap-1.5 text-[11px]"
        style={{ color: "var(--muted)" }}
      >
        {icon}
        {label}
      </div>
      <p
        className="mt-0.5 text-sm font-bold tabular-nums"
        style={{ color: "var(--heading)" }}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px dashed var(--border)",
      }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: "var(--accent-tint)",
          color: "var(--accent)",
        }}
      >
        <PackageIcon className="h-6 w-6" />
      </div>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        لا توجد طلبات في هذا التصنيف بعد.
      </p>
    </div>
  );
}
