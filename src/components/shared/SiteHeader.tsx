"use client";

import Link from "next/link";
import { Search, Bell, Package, Sun, Moon } from "lucide-react";
import ThemeToggleButton from "./ThemeToggleButton";
import { marketplaceUser } from "../../data/services";
import { useTheme } from "../../lib/useTheme";

type Variant = "marketing" | "app";

type Props = {
  variant: Variant;
  /** إذا صحيح، شعار الموقع يوجّه إلى /marketplace بدل / (لمستخدم مسجّل). */
  loggedIn?: boolean;
};

export default function SiteHeader({ variant, loggedIn = false }: Props) {
  const { theme, toggle } = useTheme();

  if (variant === "marketing") {
    return (
      <header
        style={{
          position: 'sticky',
          insetBlockStart: 0,
          zIndex: 50,
          background: 'var(--header-bg)',
          color: '#fff',
          borderBlockEnd: '1px solid rgba(255,255,255,.08)',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            marginInline: 'auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 700,
              fontSize: 22,
              color: '#fff',
            }}
          >
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'var(--accent)',
                color: '#0E3A46',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: 19,
              }}
            >
              ح
            </span>
            حِرفة
          </Link>

          <nav
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 22,
              marginInlineStart: 28,
              fontSize: 15,
            }}
          >
            <a href="#skills" style={{ color: 'rgba(255,255,255,.82)' }}>تصفّح المهارات</a>
            <a href="#how" style={{ color: 'rgba(255,255,255,.82)' }}>كيف يعمل</a>
            <a href="#why" style={{ color: 'rgba(255,255,255,.82)' }}>لماذا حِرفة</a>
            <a href="#business" style={{ color: 'rgba(255,255,255,.82)' }}>للشركات</a>
          </nav>

          <div
            style={{
              marginInlineStart: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={toggle}
              aria-label="تبديل الوضع الداكن"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,.22)',
                background: 'transparent',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link href="/login" style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>
              تسجيل الدخول
            </Link>

            <Link
              href="/login?tab=register"
              style={{
                background: 'var(--accent)',
                color: '#0E3A46',
                padding: '10px 18px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              انضم
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // ═════════ variant === "app" — بلا أي تغيير ═════════
  const brandHref = loggedIn || variant === "app" ? "/marketplace" : "/";

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        backgroundColor: "var(--header-bg)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="mx-auto flex h-16 max-w-7xl px-4 sm:px-6 lg:px-8 gap-3 sm:gap-6"
        style={{ alignItems: "center" }}
      >
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
          <span className="hidden text-xl font-bold tracking-tight sm:inline">
            حِرفة
          </span>
        </Link>

        <AppCenter />

        <div
          className="flex shrink-0 items-center gap-1 sm:gap-2"
          style={{ marginInlineStart: "auto" }}
        >
          <IconLink href="/dashboard/messages" label="الرسائل">
            <Bell className="h-5 w-5" />
          </IconLink>
          <IconLink href="/dashboard" label="طلباتي">
            <Package className="h-5 w-5" />
          </IconLink>

          <ThemeToggleButton />

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
        </div>
      </div>
    </header>
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
