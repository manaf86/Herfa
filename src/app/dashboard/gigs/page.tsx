"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, Loader2, AlertCircle } from "lucide-react";
import { CATEGORY_LABELS, type CategorySlug } from "@/lib/categories";

type Tier = "BASIC" | "STANDARD" | "PREMIUM";
type Status = "DRAFT" | "PUBLISHED" | "PAUSED";

type PackageSummary = {
  tier: Tier;
  priceMinor: number;
  currency: string;
  deliveryDays: number;
};

type Gig = {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  status: Status;
  seller: { id: string; name: string; avatarLetter: string };
  packages: PackageSummary[];
  _count: { packages: number };
};

const STATUS_META: Record<
  Status,
  { label: string; fg: string; bg: string }
> = {
  DRAFT: {
    label: "مسودة",
    fg: "var(--muted)",
    bg: "rgba(148,148,148,0.12)",
  },
  PUBLISHED: {
    label: "منشورة",
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  PAUSED: {
    label: "موقوفة",
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
};

export default function MyGigsPage() {
  const [gigs, setGigs] = useState<Gig[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const res = await fetch("/api/gigs?seller=me", {
        credentials: "same-origin",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "تعذّر جلب خدماتك");
      }
      const data: { gigs: Gig[] } = await res.json();
      setGigs(data.gigs);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
      setGigs([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const changeStatus = async (slug: string, next: Status) => {
    setBusyId(slug);
    try {
      const res = await fetch(`/api/gigs/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "تعذّر تحديث الحالة");
      }
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
    } finally {
      setBusyId(null);
    }
  };

  const loading = gigs === null;
  const empty = gigs !== null && gigs.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold sm:text-3xl"
            style={{ color: "var(--heading)" }}
          >
            خدماتي
            {gigs && (
              <span
                className="ms-2 rounded-full px-2 py-0.5 text-sm tabular-nums"
                style={{
                  backgroundColor: "var(--surface-2)",
                  color: "var(--muted)",
                }}
              >
                {gigs.length}
              </span>
            )}
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: "var(--muted)" }}>
            كل خدماتك المنشورة والمسودات في مكان واحد.
          </p>
        </div>
        <Link
          href="/dashboard/gigs/new"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--btn-primary-bg)",
            color: "var(--btn-primary-fg)",
          }}
        >
          <Plus className="h-4 w-4" />
          أنشئ خدمة جديدة
        </Link>
      </header>

      {err && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 rounded-xl p-3 text-sm"
          style={{
            backgroundColor: "var(--alert-tint)",
            border: "1px solid var(--alert)",
            color: "var(--alert)",
          }}
        >
          <AlertCircle className="h-4 w-4" />
          {err}
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : empty ? (
        <EmptyState />
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {gigs!.map((g) => (
            <GigMgmtCard
              key={g.id}
              gig={g}
              busy={busyId === g.slug}
              onChangeStatus={changeStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════ Card ═══════════

function GigMgmtCard({
  gig,
  busy,
  onChangeStatus,
}: {
  gig: Gig;
  busy: boolean;
  onChangeStatus: (slug: string, next: Status) => void;
}) {
  const status = STATUS_META[gig.status];
  const cheapest = gig.packages[0];
  const categoryLabel =
    CATEGORY_LABELS[gig.categoryId as CategorySlug] ?? gig.categoryId;

  return (
    <article
      className="flex flex-col rounded-2xl p-5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: status.bg, color: status.fg }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: status.fg }}
          />
          {status.label}
        </span>
        <span
          className="text-[10px]"
          style={{ color: "var(--muted)" }}
        >
          {categoryLabel}
        </span>
      </div>

      <h3
        className="text-sm font-bold leading-snug"
        style={{
          color: "var(--heading)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "2.6rem",
        }}
      >
        {gig.title}
      </h3>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <MetaLine label="أقل سعر">
          {cheapest
            ? `${(cheapest.priceMinor / 100).toLocaleString("en-US")} ر.س`
            : "—"}
        </MetaLine>
        <MetaLine label="الطلبات">0</MetaLine>
      </dl>

      <div
        className="mt-4 flex gap-2 border-t pt-3"
        style={{ borderColor: "var(--border)" }}
      >
        <Link
          href={`/gig/${gig.slug}`}
          className="flex-1 rounded-full px-3 py-1.5 text-center text-xs font-medium transition-colors hover:bg-[var(--surface-2)]"
          style={{
            border: "1px solid var(--border)",
            color: "var(--ink)",
          }}
        >
          عرض
        </Link>
        {gig.status === "DRAFT" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChangeStatus(gig.slug, "PUBLISHED")}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            style={{
              backgroundColor: "var(--success)",
              color: "#FFFFFF",
            }}
          >
            {busy && <Loader2 className="h-3 w-3 animate-spin" />}
            نشر
          </button>
        )}
        {gig.status === "PUBLISHED" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChangeStatus(gig.slug, "PAUSED")}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            style={{
              backgroundColor: "var(--accent)",
              color: "#0E3A46",
            }}
          >
            {busy && <Loader2 className="h-3 w-3 animate-spin" />}
            إيقاف
          </button>
        )}
        {gig.status === "PAUSED" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChangeStatus(gig.slug, "PUBLISHED")}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            style={{
              backgroundColor: "var(--success)",
              color: "#FFFFFF",
            }}
          >
            {busy && <Loader2 className="h-3 w-3 animate-spin" />}
            استئناف
          </button>
        )}
      </div>
    </article>
  );
}

function MetaLine({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg px-2.5 py-2"
      style={{ backgroundColor: "var(--surface-2)" }}
    >
      <dt className="text-[10px]" style={{ color: "var(--muted)" }}>
        {label}
      </dt>
      <dd
        className="mt-0.5 text-sm font-bold tabular-nums"
        style={{ color: "var(--heading)" }}
      >
        {children}
      </dd>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-2xl px-6 py-14 text-center"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px dashed var(--border)",
      }}
    >
      <Loader2
        className="h-6 w-6 animate-spin"
        style={{ color: "var(--muted)" }}
      />
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        جارٍ جلب خدماتك…
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl px-6 py-14 text-center"
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
        <LayoutGrid className="h-6 w-6" />
      </div>
      <div>
        <p
          className="text-base font-bold"
          style={{ color: "var(--heading)" }}
        >
          لم تنشر أي خدمة بعد
        </p>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          ابدأ بإنشاء خدمتك الأولى لتبدأ الطلبات بالوصول.
        </p>
      </div>
      <Link
        href="/dashboard/gigs/new"
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--btn-primary-bg)",
          color: "var(--btn-primary-fg)",
        }}
      >
        <Plus className="h-4 w-4" />
        أنشئ خدمتك الأولى
      </Link>
    </div>
  );
}
