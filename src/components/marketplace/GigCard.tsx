import Link from "next/link";
import { Star } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import { categories, type BadgeKind, type Service } from "../../data/services";

const BADGES: Record<Exclude<BadgeKind, null>, { label: string; fg: string; bg: string }> = {
  featured: {
    label: "مميّز",
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  "top-seller": {
    label: "الأكثر طلباً",
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  rising: {
    label: "نجم صاعد",
    fg: "var(--info)",
    bg: "var(--info-tint)",
  },
};

export default function GigCard({ service }: { service: Service }) {
  const cat = categories.find((c) => c.slug === service.category)!;
  const badge = service.badge ? BADGES[service.badge] : null;

  return (
    <Link
      href={`/gig/${service.slug}`}
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
          backgroundImage: `linear-gradient(135deg, ${cat.gradientFrom} 0%, ${cat.gradientTo} 100%)`,
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
        <CategoryIcon
          name={cat.icon}
          className="relative h-14 w-14 text-white/85 transition-transform duration-300 group-hover:scale-110"
          strokeWidth={1.5}
        />
        <span
          className="absolute bottom-2 rounded-full px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur"
          style={{
            insetInlineStart: "0.5rem",
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        >
          {cat.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Seller row */}
        <div className="mb-2.5 flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              backgroundColor: service.seller.avatarBg,
              color: "var(--heading)",
            }}
          >
            {service.seller.initial}
          </div>
          <span
            className="truncate text-xs font-medium"
            style={{ color: "var(--ink)" }}
          >
            {service.seller.name}
          </span>
          {badge && (
            <span
              className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
              style={{
                backgroundColor: badge.bg,
                color: badge.fg,
              }}
            >
              {badge.label}
            </span>
          )}
        </div>

        {/* Title (2-line clamp) */}
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
          {service.title}
        </h3>

        {/* Rating */}
        <div
          className="mt-2 flex items-center gap-1 text-xs"
          style={{ color: "var(--muted)" }}
        >
          <Star
            className="h-3.5 w-3.5"
            fill="var(--accent)"
            style={{ color: "var(--accent)" }}
          />
          <span
            className="font-bold tabular-nums"
            style={{ color: "var(--heading)" }}
          >
            {service.ratingDisplay}
          </span>
          <span className="tabular-nums">({service.ratingCountDisplay})</span>
        </div>

        {/* Divider + price */}
        <div
          className="mt-auto flex items-baseline justify-between border-t pt-3"
          style={{
            borderColor: "var(--border)",
            marginTop: "0.75rem",
          }}
        >
          <span
            className="text-[11px]"
            style={{ color: "var(--muted)" }}
          >
            يبدأ من
          </span>
          <span
            className="text-base font-bold tabular-nums"
            style={{ color: "var(--heading)" }}
          >
            {service.startingPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
