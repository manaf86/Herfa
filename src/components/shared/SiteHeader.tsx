"use client";

import Link from "next/link";
import { Search, Bell, Package } from "lucide-react";
import ThemeToggleButton from "./ThemeToggleButton";
import { marketplaceUser } from "../../data/services";

type Variant = "marketing" | "app";

type Props = {
  variant: Variant;
  /** إذا صحيح، شعار الموقع يوجّه إلى /marketplace بدل / (لمستخدم مسجّل). */
  loggedIn?: boolean;
};

const MARKETING_LINKS = [
  { label: "تصفّح المهارات", href: "/marketplace" },
  { label: "كيف يعمل", href: "/#how" },
  { label: "لماذا حِرفة", href: "/#why" },
  { label: "للشركات", href: "/#business" },
];

export default function SiteHeader({ variant, loggedIn = false }: Props) {
  const brandHref = loggedIn || variant === "app" ? "/marketplace" : "/";

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        backgroundColor: "var(--header-bg)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href={brandHref}
          className="flex shrink-0 items-center gap-2 text-white"
          aria-label="حِرفة — الرئيسية"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold"
            style={{ backgroundColor: "var(--accent)", color: "#0E3A46" }}
          >
            ح
          </span>
          <span
            className={`text-xl font-bold tracking-tight ${
              variant === "app" ? "hidden sm:inline" : ""
            }`}
          >
            حِرفة
          </span>
        </Link>

        {variant === "marketing" ? (
          <MarketingCenter />
        ) : (
          <AppCenter />
        )}

        {/* Right side (visual left in RTL): theme + auth/user */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {variant === "app" && (
            <>
              <IconLink href="/dashboard/messages" label="الرسائل">
                <Bell className="h-5 w-5" />
              </IconLink>
              <IconLink href="/dashboard" label="طلباتي">
                <Package className="h-5 w-5" />
              </IconLink>
            </>
          )}

          <ThemeToggleButton />

          {variant === "marketing" ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:inline-flex"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--accent)", color: "#0E3A46" }}
              >
                انضم
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="ms-1 hidden items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors hover:bg-white/10 md:flex"
              style={{ border: "1px solid rgba(255,255,255,0.18)" }}
              aria-label="لوحة القيادة"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: "var(--accent)", color: "#0E3A46" }}
              >
                {marketplaceUser.initial}
              </span>
              <span className="text-xs font-medium text-white/90">
                {marketplaceUser.name}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function MarketingCenter() {
  return (
    <nav
      className="hidden flex-1 items-center justify-center gap-8 md:flex"
      aria-label="التنقّل الرئيسي"
    >
      {MARKETING_LINKS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-white/85 transition-colors hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function AppCenter() {
  return (
    <div
      className="relative flex flex-1 items-center"
      style={{ maxWidth: "600px" }}
    >
      <span
        className="absolute flex h-9 w-9 items-center justify-center"
        style={{
          insetInlineStart: "0.25rem",
          color: "var(--muted)",
          pointerEvents: "none",
        }}
      >
        <Search className="h-4 w-4" />
      </span>
      <input
        type="search"
        placeholder="ابحث عن خدمة…"
        aria-label="ابحث عن خدمة"
        className="w-full rounded-full py-2.5 text-sm outline-none"
        style={{
          backgroundColor: "#FFFFFF",
          color: "#101828",
          paddingInlineStart: "2.5rem",
          paddingInlineEnd: "1rem",
        }}
      />
    </div>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
      style={{ border: "1px solid rgba(255,255,255,0.18)" }}
    >
      {children}
    </Link>
  );
}
