"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";

const TIER_LABEL: Record<"BASIC" | "STANDARD" | "PREMIUM", string> = {
  BASIC: "الأساسية",
  STANDARD: "القياسية",
  PREMIUM: "الاحترافية",
};

type ApiGigDetail = {
  id: string;
  slug: string;
  title: string;
  packages: {
    id: string;
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    title: string;
    priceMinor: number;
    deliveryDays: number;
    revisions: number;
  }[];
};

export default function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gigSlug = searchParams.get("gig") ?? "";
  const tier = searchParams.get("package") ?? "";
  const nextUrl = `/orders/new?gig=${encodeURIComponent(
    gigSlug,
  )}&package=${encodeURIComponent(tier)}`;

  const [gig, setGig] = useState<ApiGigDetail | null>(null);
  const [pkgId, setPkgId] = useState<string | null>(null);
  const [pkgSummary, setPkgSummary] = useState<
    { title: string; priceMinor: number; deliveryDays: number; revisions: number } | null
  >(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submittedRef = useRef(false);

  // 1) نجلب الخدمة بالـ slug ونعثر على الباقة بالـ tier.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!gigSlug || !tier) {
        setLoadErr("الرابط غير مكتمل — رجاءً ابدأ من صفحة الخدمة.");
        return;
      }
      try {
        const res = await fetch(`/api/gigs/${encodeURIComponent(gigSlug)}`, {
          credentials: "same-origin",
        });
        if (!res.ok) {
          throw new Error("الخدمة غير موجودة أو غير منشورة.");
        }
        const data: { gig: ApiGigDetail } = await res.json();
        if (cancelled) return;
        const p = data.gig.packages.find((x) => x.tier === tier);
        if (!p) {
          throw new Error("الباقة المطلوبة غير موجودة في هذه الخدمة.");
        }
        setGig(data.gig);
        setPkgId(p.id);
        setPkgSummary({
          title: p.title,
          priceMinor: p.priceMinor,
          deliveryDays: p.deliveryDays,
          revisions: p.revisions,
        });
      } catch (e) {
        if (!cancelled) {
          setLoadErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gigSlug, tier]);

  const confirm = async () => {
    if (!gig || !pkgId || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId: gig.id, packageId: pkgId }),
        credentials: "same-origin",
      });
      if (res.status === 401) {
        router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "تعذّر إنشاء الطلب");
      }
      router.replace(`/orders/${data.orderId}`);
    } catch (e) {
      submittedRef.current = false; // اسمح بإعادة المحاولة
      setSubmitErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--ink)" }}
    >
      <SiteHeader variant="app" loggedIn />

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={gigSlug ? `/gig/${gigSlug}` : "/marketplace"}
          className="mb-6 inline-flex items-center gap-1.5 text-sm transition-colors hover:underline"
          style={{ color: "var(--muted)" }}
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Link>

        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            <MessageSquare className="h-7 w-7" />
          </div>

          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            بدء طلب
          </p>

          {loadErr ? (
            <ErrorBox message={loadErr} />
          ) : !gig || !pkgSummary ? (
            <LoadingBox />
          ) : (
            <>
              <h1
                className="mt-2 text-2xl font-bold leading-snug sm:text-3xl"
                style={{ color: "var(--heading)" }}
              >
                {gig.title}
              </h1>

              <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MetaRow
                  label="الباقة"
                  value={
                    TIER_LABEL[tier as keyof typeof TIER_LABEL] ??
                    tier
                  }
                />
                <MetaRow
                  label="السعر"
                  value={`${(pkgSummary.priceMinor / 100).toLocaleString(
                    "en-US",
                  )} ر.س`}
                />
                <MetaRow
                  label="مدة التسليم"
                  value={`${pkgSummary.deliveryDays} أيام`}
                />
                <MetaRow
                  label="التعديلات"
                  value={String(pkgSummary.revisions)}
                />
              </dl>

              {/* ضمان الخزنة */}
              <div
                className="mt-6 flex items-start gap-2 rounded-xl p-4"
                style={{
                  backgroundColor: "var(--success-tint)",
                  border: "1px solid var(--success)",
                }}
              >
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--success)" }}
                />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--success)" }}
                  >
                    مضمون بالخزنة
                  </p>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: "var(--ink)" }}
                  >
                    ستُفتح محادثة مع البائع لتحديد المتطلبات. العدّاد يبدأ عند
                    اكتمال المتطلبات — لا عند الدفع. ولن تُصرف الأموال حتى
                    تعتمد التسليم.
                  </p>
                </div>
              </div>

              {submitErr && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-xl p-3 text-sm"
                  style={{
                    backgroundColor: "var(--alert-tint)",
                    border: "1px solid var(--alert)",
                    color: "var(--alert)",
                  }}
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{submitErr}</span>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={confirm}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--btn-primary-bg)",
                    color: "var(--btn-primary-fg)",
                  }}
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  تأكيد وفتح المحادثة
                </button>
                <Link
                  href={`/gig/${gig.slug}`}
                  className="inline-flex items-center gap-1 rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--ink)",
                  }}
                >
                  إلغاء
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        backgroundColor: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}
    >
      <dt
        className="text-[11px] font-medium uppercase tracking-wide"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </dt>
      <dd
        className="mt-1 text-sm font-bold tabular-nums"
        style={{ color: "var(--heading)" }}
      >
        {value}
      </dd>
    </div>
  );
}

function LoadingBox() {
  return (
    <div className="mt-6 flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
      <Loader2 className="h-4 w-4 animate-spin" />
      جارٍ التحقّق من الخدمة والباقة…
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="mt-4 flex items-start gap-2 rounded-xl p-3 text-sm"
      style={{
        backgroundColor: "var(--alert-tint)",
        border: "1px solid var(--alert)",
        color: "var(--alert)",
      }}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
