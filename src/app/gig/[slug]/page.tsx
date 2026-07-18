import Link from "next/link";
import {
  Star,
  Check,
  ChevronLeft,
  ImageIcon,
  Award,
  MapPin,
} from "lucide-react";
import Header from "../../../components/Header";
import PurchaseCard from "../../../components/gig/PurchaseCard";
import {
  gigSeller,
  gigTitle,
  breadcrumb,
  quickBadges,
  aboutParagraphs,
  deliverables,
  comparisonRows,
  packages,
  ratingDistribution,
  reviews,
} from "../../../data/gig";

function toArabicDigits(n: number | string): string {
  const map = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}

export default function GigPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--ink)" }}>
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="مسار التنقّل"
          className="mb-4 flex items-center gap-1 text-xs sm:text-sm"
          style={{ color: "var(--muted)" }}
        >
          {breadcrumb.map((b, i) => (
            <span key={b.label} className="flex items-center gap-1">
              <Link
                href={b.href}
                className="transition-colors hover:text-[var(--heading)]"
              >
                {b.label}
              </Link>
              {i < breadcrumb.length - 1 && (
                <ChevronLeft className="h-3.5 w-3.5 rotate-180" aria-hidden />
              )}
            </span>
          ))}
        </nav>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          {/* ==================== MAIN CONTENT (right in RTL) ==================== */}
          <main className="min-w-0 space-y-8">
            {/* Title */}
            <h1
              className="text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl"
              style={{ color: "var(--heading)" }}
            >
              {gigTitle}
            </h1>

            {/* Seller card */}
            <div
              className="flex flex-wrap items-center gap-4 rounded-2xl p-4"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold"
                style={{
                  backgroundColor: "rgba(212,162,76,0.18)",
                  color: "var(--accent)",
                }}
              >
                {gigSeller.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className="text-base font-bold"
                    style={{ color: "var(--heading)" }}
                  >
                    {gigSeller.name}
                  </p>
                  {gigSeller.isFeatured && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: "var(--accent-tint)",
                        color: "var(--accent)",
                      }}
                    >
                      <Award className="h-3 w-3" />
                      بائعة مميّزة
                    </span>
                  )}
                </div>
                <div
                  className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  <span className="flex items-center gap-1">
                    <Star
                      className="h-3.5 w-3.5"
                      fill="var(--accent)"
                      style={{ color: "var(--accent)" }}
                    />
                    <span
                      className="font-bold"
                      style={{ color: "var(--heading)" }}
                    >
                      {toArabicDigits(gigSeller.rating.toString().replace(".", "٫"))}
                    </span>
                    ({toArabicDigits(gigSeller.ratingCount)})
                  </span>
                  <span>مؤشر حِرفة {toArabicDigits(gigSeller.herfaIndex)}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {gigSeller.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <section>
              <div
                className="mb-3 flex aspect-[16/10] w-full items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: "var(--surface-2)",
                  border: "1px dashed var(--border)",
                }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <ImageIcon
                    className="h-10 w-10"
                    style={{ color: "var(--muted)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    أسقط صورة عملك الرئيسية هنا
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="flex aspect-square items-center justify-center rounded-lg text-xs transition-all hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                    }}
                    aria-label={`عمل ${toArabicDigits(n)}`}
                  >
                    عمل {toArabicDigits(n)}
                  </button>
                ))}
              </div>
            </section>

            {/* Quick badges */}
            <div className="flex flex-wrap gap-2">
              {quickBadges.map((b) => (
                <span
                  key={b.key}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{
                    backgroundColor: "var(--surface)",
                    color: "var(--heading)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Check
                    className="h-3.5 w-3.5"
                    strokeWidth={3}
                    style={{ color: "var(--success)" }}
                  />
                  {b.label}
                </span>
              ))}
            </div>

            {/* About this gig */}
            <section
              className="rounded-2xl p-6 sm:p-7"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="mb-4 text-lg font-bold"
                style={{ color: "var(--heading)" }}
              >
                عن هذه الخدمة
              </h2>
              <div className="space-y-4">
                {aboutParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed sm:text-base"
                    style={{ color: "var(--ink)" }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* What you get */}
            <section
              className="rounded-2xl p-6 sm:p-7"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="mb-5 text-lg font-bold"
                style={{ color: "var(--heading)" }}
              >
                ما تحصل عليه
              </h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2.5 text-sm leading-relaxed"
                    style={{ color: "var(--ink)" }}
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "var(--success-tint)",
                        color: "var(--success)",
                      }}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </section>

            {/* Compare packages */}
            <section
              className="overflow-hidden rounded-2xl"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                <h2
                  className="text-lg font-bold"
                  style={{ color: "var(--heading)" }}
                >
                  قارن بين الباقات
                </h2>
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  اختر ما يناسب مرحلة علامتك وميزانيتك.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-start text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "var(--surface-2)" }}>
                      <th
                        className="px-4 py-3 text-start text-xs font-bold"
                        style={{ color: "var(--muted)" }}
                      >
                        الميزة
                      </th>
                      {packages.map((p) => (
                        <th
                          key={p.tier}
                          className="relative px-4 py-3 text-center text-xs font-bold"
                          style={{
                            color: p.isFeatured
                              ? "var(--accent)"
                              : "var(--heading)",
                            backgroundColor: p.isFeatured
                              ? "var(--accent-tint)"
                              : "transparent",
                          }}
                        >
                          {tierName(p.tier)}
                          {p.isFeatured && (
                            <span
                              className="absolute top-full mt-0.5 rounded-b-md px-1.5 py-0.5 text-[9px] font-bold"
                              style={{
                                insetInlineStart: "50%",
                                transform: "translateX(50%)",
                                backgroundColor: "var(--accent)",
                                color: "#0E3A46",
                              }}
                            >
                              الأكثر طلباً
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr
                        key={row.label}
                        style={{
                          borderTop:
                            i === 0 ? "none" : "1px solid var(--border)",
                        }}
                      >
                        <td
                          className="px-4 py-3 text-start font-medium"
                          style={{ color: "var(--ink)" }}
                        >
                          {row.label}
                        </td>
                        <td
                          className="px-4 py-3 text-center"
                          style={{ color: "var(--ink)" }}
                        >
                          {row.basic}
                        </td>
                        <td
                          className="px-4 py-3 text-center font-bold"
                          style={{
                            color: "var(--heading)",
                            backgroundColor: "var(--accent-tint)",
                          }}
                        >
                          {row.standard}
                        </td>
                        <td
                          className="px-4 py-3 text-center"
                          style={{ color: "var(--ink)" }}
                        >
                          {row.pro}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* About the designer */}
            <section
              className="rounded-2xl p-6 sm:p-7"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="mb-5 text-lg font-bold"
                style={{ color: "var(--heading)" }}
              >
                عن المصمّمة
              </h2>
              <div className="flex flex-wrap items-start gap-5">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-3xl font-bold"
                  style={{
                    backgroundColor: "rgba(212,162,76,0.18)",
                    color: "var(--accent)",
                  }}
                >
                  {gigSeller.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-base font-bold"
                    style={{ color: "var(--heading)" }}
                  >
                    {gigSeller.name}
                  </p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    {gigSeller.role} · {gigSeller.city}
                  </p>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--ink)" }}
                  >
                    {gigSeller.bio}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <MiniStat
                      value={toArabicDigits(
                        gigSeller.metrics.avgRating.toString().replace(".", "٫")
                      )}
                      label="متوسط التقييم"
                    />
                    <MiniStat
                      value={toArabicDigits(gigSeller.metrics.completedOrders)}
                      label="طلبات مكتملة"
                    />
                    <MiniStat
                      value={gigSeller.metrics.responseTime}
                      label="سرعة الرد"
                      valueClassName="text-lg sm:text-xl"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section
              className="rounded-2xl p-6 sm:p-7"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="mb-5 text-lg font-bold"
                style={{ color: "var(--heading)" }}
              >
                التقييمات
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                {/* Summary */}
                <div className="flex items-center gap-4">
                  <div>
                    <p
                      className="text-5xl font-bold leading-none"
                      style={{ color: "var(--heading)" }}
                    >
                      {toArabicDigits(
                        gigSeller.rating.toString().replace(".", "٫")
                      )}
                    </p>
                    <div className="mt-2 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star
                          key={k}
                          className="h-4 w-4"
                          fill="var(--accent)"
                          style={{ color: "var(--accent)" }}
                        />
                      ))}
                    </div>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      {toArabicDigits(gigSeller.ratingCount)} تقييماً
                    </p>
                  </div>
                </div>

                {/* Distribution */}
                <div className="space-y-1.5">
                  {ratingDistribution.map((r) => (
                    <div
                      key={r.stars}
                      className="flex items-center gap-3 text-xs"
                    >
                      <span
                        className="w-12 shrink-0 text-start"
                        style={{ color: "var(--muted)" }}
                      >
                        {toArabicDigits(r.stars)} نجوم
                      </span>
                      <div
                        className="h-1.5 flex-1 overflow-hidden rounded-full"
                        style={{ backgroundColor: "var(--surface-2)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${r.percent}%`,
                            backgroundColor: "var(--accent)",
                          }}
                        />
                      </div>
                      <span
                        className="w-10 shrink-0 text-end tabular-nums"
                        style={{ color: "var(--muted)" }}
                      >
                        {toArabicDigits(r.percent)}٪
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews */}
              <div
                className="mt-6 space-y-5 border-t pt-6"
                style={{ borderColor: "var(--border)" }}
              >
                {reviews.map((r) => (
                  <article
                    key={r.id}
                    className="flex gap-3"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: "rgba(212,162,76,0.15)",
                        color: "var(--accent)",
                      }}
                    >
                      {r.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <p
                          className="text-sm font-bold"
                          style={{ color: "var(--heading)" }}
                        >
                          {r.name}
                        </p>
                        <span
                          className="text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          · {r.role}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          · {r.timeAgo}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, k) => (
                          <Star
                            key={k}
                            className="h-3.5 w-3.5"
                            fill="var(--accent)"
                            style={{ color: "var(--accent)" }}
                          />
                        ))}
                      </div>
                      <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{ color: "var(--ink)" }}
                      >
                        {r.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          {/* ==================== PURCHASE CARD (left in RTL) ==================== */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <PurchaseCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function tierName(t: "basic" | "standard" | "pro"): string {
  return t === "basic" ? "الأساسية" : t === "standard" ? "القياسية" : "الاحترافية";
}

function MiniStat({
  value,
  label,
  valueClassName = "text-2xl",
}: {
  value: string | number;
  label: string;
  valueClassName?: string;
}) {
  return (
    <div
      className="rounded-xl px-3 py-3 text-center"
      style={{
        backgroundColor: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}
    >
      <p
        className={`${valueClassName} font-bold leading-tight`}
        style={{ color: "var(--heading)" }}
      >
        {value}
      </p>
      <p
        className="mt-1 text-[11px]"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </p>
    </div>
  );
}
