import Link from "next/link";
import { Sparkles } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import { categories, type CategorySlug } from "../../data/services";
import { CATEGORY_LABELS } from "@/lib/categories";

// شكل الخدمة القادم من GET /api/gigs
export type ApiGig = {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  seller: { id: string; name: string; avatarLetter: string };
  packages: {
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    priceMinor: number;
    currency: string;
    deliveryDays: number;
  }[];
  _count: { packages: number };
};

/**
 * بطاقة خدمة قادمة من قاعدة البيانات الحقيقية.
 * تشترك في الشكل مع GigCard التجريبية، لكن بلا تقييمات (بعد).
 */
export default function RealGigCard({ gig }: { gig: ApiGig }) {
  // نعثر على تدرّج الغلاف من قائمة الفئات نفسها (بلا تكرار).
  const cat = categories.find(
    (c) => c.slug === (gig.categoryId as CategorySlug),
  );
  const catLabel =
    CATEGORY_LABELS[gig.categoryId as CategorySlug] ?? gig.categoryId;

  const cheapest = gig.packages[0];
  const priceSar = cheapest
    ? (cheapest.priceMinor / 100).toLocaleString("en-US")
    : "—";

  return (
    <Link
      href={`/gig/${gig.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Cover */}
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
        style={{
          backgroundImage: cat
            ? `linear-gradient(135deg, ${cat.gradientFrom} 0%, ${cat.gradientTo} 100%)`
            : "linear-gradient(135deg, #0E3A46 0%, #D4A24C 100%)",
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 45%)",
          }}
        />
        {cat && (
          <CategoryIcon
            name={cat.icon}
            className="relative h-14 w-14 text-white/85 transition-transform duration-300 group-hover:scale-110"
            strokeWidth={1.5}
          />
        )}
        <span
          className="absolute bottom-2 rounded-full px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur"
          style={{
            insetInlineStart: "0.5rem",
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        >
          {catLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              backgroundColor: "rgba(212,162,76,0.18)",
              color: "var(--accent)",
            }}
          >
            {gig.seller.avatarLetter}
          </div>
          <span
            className="truncate text-xs font-medium"
            style={{ color: "var(--ink)" }}
          >
            {gig.seller.name}
          </span>
          {/* "جديد" حتى يكون لدينا تقييمات حقيقية */}
          <span
            className="inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
            style={{
              backgroundColor: "var(--success-tint)",
              color: "var(--success)",
            }}
          >
            <Sparkles className="h-2.5 w-2.5" />
            جديد
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

        <div
          className="mt-auto flex items-baseline justify-between border-t pt-3"
          style={{
            borderColor: "var(--border)",
            marginTop: "0.75rem",
          }}
        >
          <span className="text-[11px]" style={{ color: "var(--muted)" }}>
            يبدأ من
          </span>
          <span
            className="text-base font-bold tabular-nums"
            style={{ color: "var(--heading)" }}
          >
            {priceSar} ر.س
          </span>
        </div>
      </div>
    </Link>
  );
}
