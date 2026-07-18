"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Clock, RefreshCcw, Check } from "lucide-react";
import { packages, trustSignals, type PackageTier } from "../../data/gig";

export default function PurchaseCard() {
  const [tier, setTier] = useState<PackageTier>("standard");
  const active = packages.find((p) => p.tier === tier)!;
  const params = useParams<{ slug?: string }>();
  const router = useRouter();

  const handleContact = () => {
    // TODO: لاحقاً — تحقّق من الجلسة، ثم إنشاء طلب حقيقي وفتح شات المتطلبات.
    // في حِرفة: العدّاد يبدأ عند اكتمال المتطلبات، لا عند الدفع.
    const slug = params?.slug ?? "";
    router.push(`/orders/new?gig=${encodeURIComponent(slug)}&package=${tier}`);
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

        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleContact}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-transform hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--btn-primary-bg)",
            color: "var(--btn-primary-fg)",
          }}
        >
          تواصل مع المصمّمة
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
