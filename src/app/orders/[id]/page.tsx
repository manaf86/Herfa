"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  ShieldCheck,
  Send,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";

type Status =
  | "PENDING_PAYMENT"
  | "AWAITING_REQUIREMENTS"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "REVISION_REQUESTED"
  | "ACCEPTED"
  | "COMPLETED"
  | "CANCELLED";

type Party = { id: string; name: string; avatarLetter: string };

type Message = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  sender: Party;
};

type Order = {
  id: string;
  reference: string;
  status: Status;
  amountMinor: number;
  currency: string;
  requirements: string | null;
  timerStartedAt: string | null;
  dueAt: string | null;
  deliveredAt: string | null;
  acceptedAt: string | null;
  buyerId: string;
  sellerId: string;
  gig: { id: string; slug: string; title: string; categoryId: string };
  package: {
    id: string;
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    title: string;
    description: string;
    deliveryDays: number;
    revisions: number;
  };
  buyer: Party;
  seller: Party;
  messages: Message[];
};

const STATUS_META: Record<Status, { label: string; fg: string; bg: string }> = {
  PENDING_PAYMENT: {
    label: "بانتظار الدفع",
    fg: "var(--muted)",
    bg: "rgba(148,148,148,0.12)",
  },
  AWAITING_REQUIREMENTS: {
    label: "بانتظار المتطلبات",
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  IN_PROGRESS: {
    label: "قيد التنفيذ",
    fg: "var(--info)",
    bg: "var(--info-tint)",
  },
  DELIVERED: {
    label: "سُلّم — بانتظار الاعتماد",
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  REVISION_REQUESTED: {
    label: "تعديل مطلوب",
    fg: "var(--warn)",
    bg: "var(--warn-tint)",
  },
  ACCEPTED: {
    label: "معتمد",
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  COMPLETED: {
    label: "مكتمل",
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  CANCELLED: {
    label: "ملغى",
    fg: "var(--alert)",
    bg: "var(--alert-tint)",
  },
};

const TIER_LABEL: Record<Order["package"]["tier"], string> = {
  BASIC: "الأساسية",
  STANDARD: "القياسية",
  PREMIUM: "الاحترافية",
};

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id ?? "";

  const [order, setOrder] = useState<Order | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!orderId) return;
      if (!silent) setErr(null);
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          credentials: "same-origin",
        });
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = `/login?next=/orders/${orderId}`;
            return;
          }
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error ?? "تعذّر جلب الطلب");
        }
        const data: { order: Order } = await res.json();
        setOrder(data.order);
      } catch (e) {
        if (!silent) {
          setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
        }
      }
    },
    [orderId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  // Polling للرسائل كل 5 ثوانٍ (بدل WebSocket مؤقتاً).
  useEffect(() => {
    if (!order) return;
    if (order.status === "CANCELLED" || order.status === "COMPLETED") return;
    const id = setInterval(() => void load(true), 5000);
    return () => clearInterval(id);
  }, [order, load]);

  if (err && !order) {
    return (
      <PageShell>
        <div
          className="mx-auto mt-10 max-w-md rounded-2xl p-6 text-center"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--alert)",
          }}
        >
          <AlertCircle
            className="mx-auto mb-3 h-8 w-8"
            style={{ color: "var(--alert)" }}
          />
          <p className="text-sm" style={{ color: "var(--alert)" }}>
            {err}
          </p>
          <Link
            href="/dashboard/orders"
            className="mt-4 inline-flex items-center gap-1 text-sm hover:underline"
            style={{ color: "var(--muted)" }}
          >
            <ArrowRight className="h-4 w-4" />
            العودة للطلبات
          </Link>
        </div>
      </PageShell>
    );
  }

  if (!order) {
    return (
      <PageShell>
        <div className="mx-auto flex max-w-md flex-col items-center gap-2 py-16 text-center">
          <Loader2
            className="h-6 w-6 animate-spin"
            style={{ color: "var(--muted)" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            جارٍ جلب الطلب…
          </p>
        </div>
      </PageShell>
    );
  }

  const status = STATUS_META[order.status];
  const amountSar = (order.amountMinor / 100).toLocaleString("en-US");

  return (
    <PageShell>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        {/* ═══ اليمين: تفاصيل الطلب + المتطلبات/العدّاد ═══ */}
        <main className="min-w-0 space-y-6">
          <section
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: "var(--muted)" }}
              >
                {order.reference}
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
            </div>

            <h1
              className="text-xl font-bold leading-snug sm:text-2xl"
              style={{ color: "var(--heading)" }}
            >
              {order.gig.title}
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--muted)" }}
            >
              الباقة {TIER_LABEL[order.package.tier]} · {order.package.title} ·{" "}
              <span
                className="font-bold tabular-nums"
                style={{ color: "var(--heading)" }}
              >
                {amountSar} ر.س
              </span>
            </p>

            {/* شارة الخزنة */}
            <div
              className="mt-5 flex items-start gap-2 rounded-xl p-3 text-sm"
              style={{
                backgroundColor: "var(--success-tint)",
                border: "1px solid var(--success)",
              }}
            >
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--success)" }}
              />
              <span style={{ color: "var(--ink)" }}>
                <span
                  className="font-bold"
                  style={{ color: "var(--success)" }}
                >
                  مضمون بالخزنة —
                </span>{" "}
                المال محفوظ حتى اعتمادك للعمل.
              </span>
            </div>
          </section>

          {/* الحالة النشطة */}
          {order.status === "AWAITING_REQUIREMENTS" && (
            <RequirementsForm
              orderId={order.id}
              deliveryDays={order.package.deliveryDays}
              isBuyer={order.buyerId === order.buyer.id}
              onSubmitted={() => void load()}
            />
          )}

          {order.status === "IN_PROGRESS" && order.dueAt && (
            <Countdown dueAtIso={order.dueAt} />
          )}

          {(order.status === "IN_PROGRESS" || order.status === "DELIVERED") &&
            order.requirements && (
              <ReadOnlyReqs requirements={order.requirements} />
            )}
        </main>

        {/* ═══ اليسار: الشات ═══ */}
        <ChatPanel
          orderId={order.id}
          messages={order.messages}
          buyer={order.buyer}
          seller={order.seller}
          closed={
            order.status === "CANCELLED" || order.status === "COMPLETED"
          }
          onSent={() => void load(true)}
        />
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--ink)" }}
    >
      <SiteHeader variant="app" loggedIn />
      {children}
    </div>
  );
}

// ═══════════ نموذج المتطلبات ═══════════

function RequirementsForm({
  orderId,
  deliveryDays,
  onSubmitted,
}: {
  orderId: string;
  deliveryDays: number;
  isBuyer: boolean;
  onSubmitted: () => void;
}) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/requirements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements: value.trim() }),
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "تعذّر إرسال المتطلبات");
      onSubmitted();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h2
        className="text-lg font-bold"
        style={{ color: "var(--heading)" }}
      >
        أرسل متطلبات المشروع
      </h2>
      <p
        className="mt-1 text-sm leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        العدّاد يبدأ لحظة إرسالك المتطلبات — لا عند الدفع. المدة{" "}
        <span
          className="font-bold tabular-nums"
          style={{ color: "var(--heading)" }}
        >
          {deliveryDays} أيام
        </span>
        {" "}من الآن.
      </p>

      <form onSubmit={submit} className="mt-4">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={6}
          minLength={20}
          maxLength={10000}
          placeholder="اكتب متطلباتك بوضوح: النطاق، الأمثلة، المصادر، أي مواعيد حرجة…"
          className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
          }}
        />
        {err && (
          <p
            role="alert"
            className="mt-2 flex items-center gap-1.5 text-xs"
            style={{ color: "var(--alert)" }}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {err}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || value.trim().length < 20}
          className="mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          style={{
            backgroundColor: "var(--btn-primary-bg)",
            color: "var(--btn-primary-fg)",
          }}
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          ابدأ العمل
        </button>
      </form>
    </section>
  );
}

// ═══════════ العدّاد التنازلي ═══════════

function Countdown({ dueAtIso }: { dueAtIso: string }) {
  const [now, setNow] = useState(() => Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(dueAtIso).getTime();
  const diff = target - now;
  const overdue = diff < 0;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((abs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));

  if (!mounted) return null;

  return (
    <section
      className="rounded-2xl p-6"
      style={{
        backgroundColor: overdue ? "var(--alert-tint)" : "var(--info-tint)",
        border: `1px solid ${overdue ? "var(--alert)" : "var(--info)"}`,
      }}
    >
      <div className="flex items-center gap-2">
        <Clock
          className="h-4 w-4"
          style={{ color: overdue ? "var(--alert)" : "var(--info)" }}
        />
        <p
          className="text-sm font-bold"
          style={{ color: overdue ? "var(--alert)" : "var(--info)" }}
        >
          {overdue ? "متأخّر منذ" : "الوقت المتبقّي للتسليم"}
        </p>
      </div>
      <div
        className="mt-2 flex items-baseline gap-3 tabular-nums"
        style={{ color: "var(--heading)" }}
        aria-live="polite"
      >
        <TimeCell v={days} l="يوم" />
        <span style={{ color: "var(--muted)" }}>·</span>
        <TimeCell v={hrs} l="ساعة" />
        <span style={{ color: "var(--muted)" }}>·</span>
        <TimeCell v={mins} l="دقيقة" />
      </div>
    </section>
  );
}

function TimeCell({ v, l }: { v: number; l: string }) {
  return (
    <span>
      <span className="text-2xl font-bold">{String(v).padStart(2, "0")}</span>
      <span className="ms-1 text-xs" style={{ color: "var(--muted)" }}>
        {l}
      </span>
    </span>
  );
}

function ReadOnlyReqs({ requirements }: { requirements: string }) {
  return (
    <section
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <CheckCircle2
          className="h-4 w-4"
          style={{ color: "var(--success)" }}
        />
        <h3
          className="text-sm font-bold"
          style={{ color: "var(--heading)" }}
        >
          المتطلبات المرسلة
        </h3>
      </div>
      <p
        className="whitespace-pre-wrap text-sm leading-relaxed"
        style={{ color: "var(--ink)" }}
      >
        {requirements}
      </p>
    </section>
  );
}

// ═══════════ الشات ═══════════

function ChatPanel({
  orderId,
  messages,
  buyer,
  seller,
  closed,
  onSent,
}: {
  orderId: string;
  messages: Message[];
  buyer: Party;
  seller: Party;
  closed: boolean;
  onSent: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
        credentials: "same-origin",
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error ?? "تعذّر إرسال الرسالة");
      setDraft("");
      onSent();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside
      className="flex h-fit min-h-[500px] flex-col rounded-2xl lg:sticky lg:top-24"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        maxHeight: "calc(100dvh - 8rem)",
      }}
    >
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h2
          className="text-sm font-bold"
          style={{ color: "var(--heading)" }}
        >
          محادثة الطلب
        </h2>
        <span
          className="text-[10px]"
          style={{ color: "var(--muted)" }}
        >
          {buyer.name} · {seller.name}
        </span>
      </header>

      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto p-4"
      >
        {messages.length === 0 && (
          <p
            className="mt-6 text-center text-xs"
            style={{ color: "var(--muted)" }}
          >
            لا رسائل بعد — ابدأ الحوار.
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} m={m} />
        ))}
      </div>

      <form
        onSubmit={send}
        className="border-t p-3"
        style={{ borderColor: "var(--border)" }}
      >
        {err && (
          <p
            role="alert"
            className="mb-2 flex items-center gap-1.5 text-xs"
            style={{ color: "var(--alert)" }}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {err}
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={closed || busy}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(e as unknown as React.FormEvent);
              }
            }}
            placeholder={
              closed ? "الطلب مغلق" : "اكتب رسالة… (Enter للإرسال)"
            }
            rows={2}
            className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none disabled:opacity-60"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--ink)",
              border: "1px solid var(--border)",
            }}
          />
          <button
            type="submit"
            aria-label="إرسال"
            disabled={closed || busy || !draft.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ backgroundColor: "var(--btn-primary-bg)" }}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </aside>
  );
}

function MessageBubble({ m }: { m: Message }) {
  const time = new Date(m.createdAt).toLocaleTimeString("ar-SA-u-nu-latn", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <article className="flex gap-2">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          backgroundColor: "rgba(212,162,76,0.18)",
          color: "var(--accent)",
        }}
      >
        {m.sender.avatarLetter}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p
            className="text-xs font-bold"
            style={{ color: "var(--heading)" }}
          >
            {m.sender.name}
          </p>
          <span
            className="text-[10px] tabular-nums"
            style={{ color: "var(--muted)" }}
          >
            {time}
          </span>
        </div>
        <p
          className="mt-1 whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-relaxed"
          style={{
            backgroundColor: "var(--surface-2)",
            color: "var(--ink)",
          }}
        >
          {m.body}
        </p>
      </div>
    </article>
  );
}
