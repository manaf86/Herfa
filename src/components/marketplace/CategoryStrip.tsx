"use client";

import CategoryIcon from "./CategoryIcon";
import { categories, type CategorySlug } from "../../data/services";

type Props = {
  active: CategorySlug | "all";
  onChange: (c: CategorySlug | "all") => void;
};

export default function CategoryStrip({ active, onChange }: Props) {
  return (
    <div
      className="sticky top-16 z-30 border-b"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <nav
          className="scroll-hide flex items-center gap-1 overflow-x-auto px-2 py-2"
          aria-label="التصنيفات"
          style={{ scrollbarWidth: "none" }}
        >
          <CatTab
            active={active === "all"}
            onClick={() => onChange("all")}
            label="الكل"
          />
          {categories.map((c) => (
            <CatTab
              key={c.slug}
              active={active === c.slug}
              onClick={() => onChange(c.slug)}
              label={c.label}
              iconName={c.icon}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

function CatTab({
  active,
  onClick,
  label,
  iconName,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  iconName?: React.ComponentProps<typeof CategoryIcon>["name"];
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm transition-colors"
      style={{
        color: active ? "var(--heading)" : "var(--muted)",
        fontWeight: active ? 700 : 500,
      }}
    >
      {iconName && (
        <CategoryIcon
          name={iconName}
          className="h-3.5 w-3.5"
          strokeWidth={active ? 2.25 : 2}
        />
      )}
      {label}
      <span
        className="absolute bottom-0 h-0.5 rounded-full transition-all"
        style={{
          insetInlineStart: "12px",
          insetInlineEnd: "12px",
          backgroundColor: active ? "var(--accent)" : "transparent",
        }}
      />
    </button>
  );
}
