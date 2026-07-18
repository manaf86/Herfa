"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sliders, PackageSearch } from "lucide-react";
import SiteHeader from "../../components/shared/SiteHeader";
import CategoryStrip from "../../components/marketplace/CategoryStrip";
import GigCard from "../../components/marketplace/GigCard";
import {
  services,
  sortOptions,
  categories,
  type CategorySlug,
} from "../../data/services";

const CATEGORY_SLUGS = new Set<string>(categories.map((c) => c.slug));

function readCategoryParam(value: string | null): CategorySlug | "all" {
  if (value && CATEGORY_SLUGS.has(value)) return value as CategorySlug;
  return "all";
}

export default function MarketplaceView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<CategorySlug | "all">(() =>
    readCategoryParam(searchParams.get("category"))
  );
  const [sort, setSort] = useState<string>("newest");

  // زامِن مع تغييرات URL (رجوع/تقدّم) بلا حلقة.
  useEffect(() => {
    const next = readCategoryParam(searchParams.get("category"));
    setCategory((prev) => (prev === next ? prev : next));
  }, [searchParams]);

  const handleCategoryChange = (next: CategorySlug | "all") => {
    setCategory(next);
    const url = next === "all" ? "/marketplace" : `/marketplace?category=${next}`;
    router.replace(url, { scroll: false });
  };

  const filtered = useMemo(
    () =>
      category === "all"
        ? services
        : services.filter((s) => s.category === category),
    [category]
  );

  const activeLabel =
    category === "all"
      ? "خدمات مميّزة"
      : categories.find((c) => c.slug === category)?.label ?? "خدمات مميّزة";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--ink)" }}
    >
      <SiteHeader variant="app" loggedIn />
      <CategoryStrip active={category} onChange={handleCategoryChange} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section header + sort */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--heading)" }}
            >
              {activeLabel}
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--muted)" }}
            >
              {filtered.length > 0
                ? `${toArabicDigits(filtered.length)} خدمة متاحة`
                : "لا توجد نتائج"}
            </p>
          </div>

          {/* Sort filter — visual only */}
          <div className="flex items-center gap-2">
            <span
              className="hidden items-center gap-1.5 text-xs sm:inline-flex"
              style={{ color: "var(--muted)" }}
            >
              <Sliders className="h-3.5 w-3.5" />
              رتّب حسب
            </span>
            <div
              role="group"
              aria-label="ترتيب الخدمات"
              className="flex items-center gap-1 rounded-full p-1"
              style={{
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              {sortOptions.map((o) => {
                const active = sort === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setSort(o.key)}
                    aria-pressed={active}
                    className="rounded-full px-3 py-1.5 text-xs transition-all"
                    style={{
                      backgroundColor: active
                        ? "var(--surface)"
                        : "transparent",
                      color: active ? "var(--heading)" : "var(--muted)",
                      fontWeight: active ? 700 : 500,
                      boxShadow: active ? "var(--shadow-sm)" : "none",
                    }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Grid or empty state */}
        {filtered.length > 0 ? (
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(260px, 1fr))",
            }}
          >
            {filtered.map((s) => (
              <GigCard key={s.id} service={s} />
            ))}
          </div>
        ) : (
          <EmptyState onReset={() => handleCategoryChange("all")} />
        )}
      </main>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
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
        <PackageSearch className="h-6 w-6" />
      </div>
      <div>
        <p
          className="text-base font-bold"
          style={{ color: "var(--heading)" }}
        >
          لا توجد خدمات في هذا التصنيف بعد
        </p>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          جرّب تصنيفاً آخر، أو تصفّح جميع الخدمات المتاحة الآن.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full px-5 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--btn-primary-bg)",
          color: "var(--btn-primary-fg)",
        }}
      >
        اعرض كل الخدمات
      </button>
    </div>
  );
}

function toArabicDigits(n: number | string): string {
  const map = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}
