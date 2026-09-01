"use client";

// لوحة مراجعة الإدارة — خدمات قيد المراجعة (PENDING_REVIEW) فقط.
// TODO: قيّد هذه الصفحة بدور ADMIN حين يُضاف نظام الأدوار.
// مؤقتاً: أي مستخدم مسجّل يصل إليها (غير مربوطة بشريط التنقّل الجانبي عمداً).

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Loader2,
  AlertCircle,
  Check,
  X,
  Clock,
} from "lucide-react";
import { CATEGORY_LABELS, type CategorySlug } from "@/lib/categories";
import { SERVICE_TYPES } from "@/lib/serviceTypes";

type Tier = "BASIC" | "STANDARD" | "PREMIUM";

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
  serviceType: string | null;
  coverImage: string | null;
  createdAt: string;
  seller: { id: string; name: string; avatarLetter: string };
  packages: PackageSummary[];
};

export default function AdminGigsReviewPage() {
  const [gigs, setGigs] = useState<Gig[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [rejectingSlug, setRejectingSlug] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const res = await fetch("/api/gigs?status=PENDING_REVIEW", {
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "تعذّر جلب الخدمات");
      setGigs(data.gigs);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
      setGigs([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const review = async (slug: string, action: "approve" | "reject", note?: string) => {
    setBusySlug(slug);
    setErr(null);
    try {
      const res = await fetch(`/api/gigs/${slug}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "تعذّر تنفيذ الإجراء");
      setRejectingSlug(null);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
    } finally {
      setBusySlug(null);
    }
  };

  const loading = gigs === null;
  const empty = gigs !== null && gigs.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6 flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "var(--accent-tint)", color: "var(--accent)" }}
        >
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--heading)" }}>
            مراجعة الخدمات
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            الخدمات المرسلة من المحترفين وبانتظار الاعتماد أو الرفض.
          </p>
        </div>
      </header>

      {err && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 rounded-xl p-3 text-sm"
          style={{ backgroundColor: "var(--alert-tint)", border: "1px solid var(--alert)", color: "var(--alert)" }}
        >
          <AlertCircle className="h-4 w-4" />
          {err}
        </div>
      )}

      {loading ? (
        <div
          className="flex items-center gap-2 rounded-2xl p-6 text-sm"
          style={{ backgroundColor: "var(--surface)", border: "1px dashed var(--border)", color: "var(--muted)" }}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          جارٍ جلب الخدمات قيد المراجعة…
        </div>
      ) : empty ? (
        <div
          className="flex flex-col items-center gap-2 rounded-2xl px-6 py-14 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px dashed var(--border)" }}
        >
          <Clock className="h-8 w-8" style={{ color: "var(--muted)" }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            لا خدمات قيد المراجعة حالياً.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {gigs!.map((g) => (
            <GigReviewCard
              key={g.id}
              gig={g}
              busy={busySlug === g.slug}
              rejecting={rejectingSlug === g.slug}
              onStartReject={() => setRejectingSlug(g.slug)}
              onCancelReject={() => setRejectingSlug(null)}
              onApprove={() => review(g.slug, "approve")}
              onReject={(note) => review(g.slug, "reject", note)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GigReviewCard({
  gig,
  busy,
  rejecting,
  onStartReject,
  onCancelReject,
  onApprove,
  onReject,
}: {
  gig: Gig;
  busy: boolean;
  rejecting: boolean;
  onStartReject: () => void;
  onCancelReject: () => void;
  onApprove: () => void;
  onReject: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const cheapest = gig.packages[0];
  const categorySlug = gig.categoryId as CategorySlug;
  const categoryLabel = CATEGORY_LABELS[categorySlug] ?? gig.categoryId;
  const serviceTypeLabel = gig.serviceType
    ? SERVICE_TYPES[categorySlug]?.find((t) => t.value === gig.serviceType)?.label ??
      gig.serviceType
    : null;

  return (
    <article
      className="rounded-2xl p-5"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex flex-wrap gap-4">
        {gig.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gig.coverImage}
            alt=""
            className="h-24 w-32 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div
            className="flex h-24 w-32 shrink-0 items-center justify-center rounded-xl text-xs"
            style={{ backgroundColor: "var(--surface-2)", color: "var(--muted)" }}
          >
            بلا صورة
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
            <span>{categoryLabel}</span>
            {serviceTypeLabel && <span>· {serviceTypeLabel}</span>}
          </div>
          <Link
            href={`/gig/${gig.slug}`}
            target="_blank"
            className="mt-1 block text-sm font-bold leading-snug hover:underline"
            style={{ color: "var(--heading)" }}
          >
            {gig.title}
          </Link>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            البائع: {gig.seller.name}
            {cheapest && ` · يبدأ من ${(cheapest.priceMinor / 100).toLocaleString("en-US")} ر.س`}
          </p>
        </div>
      </div>

      {rejecting ? (
        <div className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="سبب الرفض (سيراه البائع)…"
            rows={2}
            minLength={5}
            maxLength={500}
            className="w-full resize-y rounded-xl px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--border)" }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy || note.trim().length < 5}
              onClick={() => onReject(note.trim())}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "var(--alert)", color: "#FFFFFF" }}
            >
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              تأكيد الرفض
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onCancelReject}
              className="rounded-full px-4 py-2 text-xs font-medium transition-colors hover:bg-[var(--surface-2)]"
              style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
            >
              تراجع
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            disabled={busy}
            onClick={onApprove}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "var(--success)", color: "#FFFFFF" }}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            اعتماد
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onStartReject}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ border: "1px solid var(--alert)", color: "var(--alert)" }}
          >
            <X className="h-3.5 w-3.5" />
            رفض
          </button>
        </div>
      )}
    </article>
  );
}
