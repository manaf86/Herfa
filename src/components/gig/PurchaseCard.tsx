"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Clock, RefreshCcw, Check, Loader2, MessageCircle } from "lucide-react";
import { packages, trustSignals, type PackageTier } from "../../data/gig";

type ApiGigLite = { id: string; slug: string; seller: { id: string } };

export default function PurchaseCard() {
  const [tier, setTier] = useState<PackageTier>("standard");
  const active = packages.find((p) => p.tier === tier)!;
  const params = useParams<{ slug?: string }>();
  const router = useRouter();
  // useParams قد يُعيد المقطع مُرمَّزاً (percent-encoded) بدل فكّه — decodeURIComponent
  // هنا آمن ولا-عملي (no-op) على أي سلسلة عربية غير مُرمَّزة أصلاً.
  const slug = decodeURIComponent(params?.slug ?? "");

  const [contactBusy, setContactBusy] = useState(false);
  const [contactErr, setContactErr] = useState<string | null>(null);

  const handleOrderNow = () => {
    router.push(`/orders/new?gig=${encodeURIComponent(slug)}&package=${tier}`);
  };

  // "تواصل مع المحترف": يفتح محادثة قبل الشراء بدل الذهاب مباشرة لصفحة الطلب —
  // يتفق الطرفان على التفاصيل أولاً، تماماً كما تنصّ docs/spec/site-flow.md.
  const handleContact = async () => {
    if (contactBusy) return;
    setContactErr(null);
    setContactBusy(true);
    try {
      const gigRes = await fetch(`/api/gigs/${encodeURIComponent(slug)}`, {
        credentials: "same-origin",
      });
      if (!gigRes.ok) {
        throw new Error("تعذّر جلب بيانات الخدمة.");
      }
      const gigData: { gig: ApiGigLite } = await gigRes.json();

      const convRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: gigData.gig.seller.id,
          gigId: gigData.gig.id,
        }),
        credentials: "same-origin",
      });

      if (convRes.status === 401) {
        router.push(`/login?next=${encodeURIComponent(`/gig/${slug}`)}`);
        return;
      }

      const convData = await convRes.json().catch(() => ({}));
      if (!convRes.ok) {
        throw new Error(convData.error ?? "تعذّر بدء المحادثة.");
      }

      router.push(`/dashboard/messages/${convData.conversationId}`);
    } catch (e) {
      setContactErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
      setContactBusy(false);
    }
  };

  return (
    <aside
      className="rounded-2xl"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Tier tabs */}
      <div
        role="tablist"
        aria-label="اختر الباقة"
        className="grid grid-cols-3 gap-1 p-2"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {packages.map((p) => {
          const isActive = p.tier === tier;
          return (
            <button
              key={p.tier}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTier(p.tier)}
              className="relative rounded-lg py-2 text-xs font-medium transition-all"
              style={{
                backgroundColor: isActive ? "var(--surface-2)" : "transparent",
                color: isActive ? "var(--heading)" : "var(--muted)",
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {tierShortLabel(p.tier)}
              {p.isFeatured && (
                <span
                  className="absolute -top-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{
                    insetInlineEnd: "-4px",
                    backgroundColor: "var(--accent)",
                    color: "#0E3A46",
                  }}
                >
                  الأكثر طلباً
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-6">
        {/* Name + price */}
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className="text-base font-bold"
            style={{ color: "var(--heading)" }}
          >
            {active.name}
          </h3>
          <p
            className="text-2xl font-bold tabular-nums"
            style={{ color: "var(--heading)" }}
          >
            {active.price}
          </p>
        </div>

        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {active.description}
        </p>

        {/* Meta: delivery + revisions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <MetaChip icon={<Clock className="h-3.5 w-3.5" />} label={active.deliveryDays} />
          <MetaChip icon={<RefreshCcw className="h-3.5 w-3.5" />} label={active.revisions} />
        </div>

        {/* Features */}
        <ul className="mt-5 space-y-2.5">
          {active.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "var(--success-tint)",
                  color: "var(--success)",
                }}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* تواصل أولاً (محادثة قبل الشراء) */}
        <button
          type="button"
          onClick={handleContact}
          disabled={contactBusy}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          style={{
            backgroundColor: "var(--btn-primary-bg)",
            color: "var(--btn-primary-fg)",
          }}
        >
          {contactBusy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <MessageCircle className="h-4 w-4" aria-hidden />
          )}
          تواصل مع المحترف
        </button>

        {contactErr && (
          <p
            role="alert"
            className="mt-2 text-center text-xs"
            style={{ color: "var(--alert)" }}
          >
            {contactErr}
          </p>
        )}

        {/* طلب مباشر — لمن يريد الشراء دون محادثة مسبقة */}
        <button
          type="button"
          onClick={handleOrderNow}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors hover:bg-[var(--surface-2)]"
          style={{
            border: "1px solid var(--border)",
            color: "var(--ink)",
          }}
        >
          اطلب الخدمة الآن
        </button>

        <p
          className="mt-2 text-center text-xs"
          style={{ color: "var(--muted)" }}
        >
          الاتفاق على المتطلبات أولاً — ثم الدفع.
        </p>

        {/* Escrow guarantee — core promise */}
        <div
          className="mt-5 rounded-xl p-4"
          style={{
            backgroundColor: "var(--success-tint)",
            border: "1px solid var(--success)",
          }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <ShieldCheck
              className="h-4 w-4"
              style={{ color: "var(--success)" }}
            />
            <p
              className="text-sm font-bold"
              style={{ color: "var(--success)" }}
            >
              مضمون بالخزنة
            </p>
          </div>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--ink)" }}
          >
            لن يُدفع للمصمّمة حتى تستلم وتعتمد العمل.
          </p>
        </div>

        {/* Trust signals */}
        <div
          className="mt-4 flex flex-col gap-1.5 border-t pt-4 text-xs"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <div className="flex items-center justify-between">
            <span>{trustSignals.onTimeDelivery}</span>
            <span style={{ color: "var(--success)" }}>●</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{trustSignals.responseTime}</span>
            <span style={{ color: "var(--success)" }}>●</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{trustSignals.herfaIndex}</span>
            <span style={{ color: "var(--accent)" }}>●</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MetaChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
      style={{
        backgroundColor: "var(--surface-2)",
        color: "var(--ink)",
      }}
    >
      {icon}
      {label}
    </span>
  );
}

function tierShortLabel(t: PackageTier): string {
  return t === "basic" ? "أساسية" : t === "standard" ? "قياسية" : "احترافية";
}
