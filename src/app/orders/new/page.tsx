import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import SiteHeader from "../../../components/shared/SiteHeader";
import { services } from "../../../data/services";
import { packages } from "../../../data/gig";

const TIER_LABEL = {
  basic: "الأساسية",
  standard: "القياسية",
  pro: "الاحترافية",
} as const;

type SearchParams = {
  gig?: string;
  package?: string;
};

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { gig, package: tier } = await searchParams;

  const service = gig ? services.find((s) => s.slug === gig) : undefined;
  const gigTitle = service?.title ?? "خدمة غير محدّدة";
  const validTier =
    tier && (tier === "basic" || tier === "standard" || tier === "pro")
      ? (tier as keyof typeof TIER_LABEL)
      : undefined;
  const pkg = validTier
    ? packages.find((p) => p.tier === validTier)
    : undefined;
  const tierLabel = validTier ? TIER_LABEL[validTier] : "—";

  const backHref = gig ? `/gig/${gig}` : "/marketplace";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--ink)" }}
    >
      <SiteHeader variant="app" loggedIn />

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={backHref}
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
          <h1
            className="mt-2 text-2xl font-bold leading-snug sm:text-3xl"
            style={{ color: "var(--heading)" }}
          >
            {gigTitle}
          </h1>

          <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MetaRow label="الباقة" value={pkg?.name ?? `الباقة ${tierLabel}`} />
            {pkg && <MetaRow label="السعر" value={pkg.price} />}
            {pkg && <MetaRow label="مدة التسليم" value={pkg.deliveryDays} />}
            {pkg && <MetaRow label="التعديلات" value={pkg.revisions} />}
          </dl>

          <div
            className="mt-8 rounded-xl p-4"
            style={{
              backgroundColor: "var(--info-tint)",
              border: "1px solid var(--info)",
            }}
          >
            <p
              className="text-sm font-bold"
              style={{ color: "var(--info)" }}
            >
              شات الطلب والدفع قيد الإنشاء
            </p>
            <p
              className="mt-1.5 text-sm leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              ستُفتح هنا محادثة مع المحترف لتحديد المتطلبات. عند اكتمالها يبدأ
              العدّاد وتُحجز أموالك في الخزنة — لا تُصرف حتى تعتمد التسليم.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={backHref}
              className="rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--btn-primary-bg)",
                color: "var(--btn-primary-fg)",
              }}
            >
              العودة للخدمة
            </Link>
            <Link
              href="/marketplace"
              className="rounded-full px-5 py-2.5 text-sm font-bold transition-colors hover:bg-[var(--surface-2)]"
              style={{
                border: "1px solid var(--border)",
                color: "var(--ink)",
              }}
            >
              تصفّح السوق
            </Link>
          </div>
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
        className="mt-1 text-sm font-bold"
        style={{ color: "var(--heading)" }}
      >
        {value}
      </dd>
    </div>
  );
}
