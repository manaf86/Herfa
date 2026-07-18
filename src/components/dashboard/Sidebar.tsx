"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  KanbanSquare,
  MessageSquare,
  LayoutGrid,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  X,
  Store,
  type LucideIcon,
} from "lucide-react";
import { dashboardNav, dashboardUser, type NavItem } from "../../data/dashboard";
import DashboardThemeToggle from "./DashboardThemeToggle";

const ICONS: Record<NavItem["icon"], LucideIcon> = {
  dashboard: LayoutDashboard,
  orders: Package,
  workspace: KanbanSquare,
  messages: MessageSquare,
  services: LayoutGrid,
  earnings: Wallet,
  reports: BarChart3,
  settings: Settings,
};

type Role = "buyer" | "pro";

function RoleSwitcher({
  role,
  onChange,
}: {
  role: Role;
  onChange: (r: Role) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="تبديل الدور"
      className="grid grid-cols-2 gap-1 rounded-full p-1"
      style={{ backgroundColor: "var(--surface-2)" }}
    >
      {(["buyer", "pro"] as Role[]).map((r) => {
        const active = role === r;
        return (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r)}
            className="rounded-full py-1.5 text-xs font-medium transition-all"
            style={{
              backgroundColor: active ? "var(--surface)" : "transparent",
              color: active ? "var(--heading)" : "var(--muted)",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              fontWeight: active ? 700 : 500,
            }}
          >
            {r === "buyer" ? "مشترٍ" : "محترف"}
          </button>
        );
      })}
    </div>
  );
}

function SidebarBody({
  role,
  onRoleChange,
  onNavClick,
}: {
  role: Role;
  onRoleChange: (r: Role) => void;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <Link
        href="/marketplace"
        className="flex items-center gap-2 px-4 py-5"
        onClick={onNavClick}
        aria-label="حِرفة — السوق"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold"
          style={{ backgroundColor: "var(--accent)", color: "#0E3A46" }}
        >
          ح
        </span>
        <span
          className="text-lg font-bold"
          style={{ color: "var(--heading)" }}
        >
          حِرفة
        </span>
      </Link>

      {/* Cross-region: browse marketplace */}
      <div className="mx-3 mb-3">
        <Link
          href="/marketplace"
          onClick={onNavClick}
          className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--btn-primary-bg)",
            color: "var(--btn-primary-fg)",
          }}
        >
          <Store className="h-4 w-4" />
          تصفّح السوق
        </Link>
      </div>

      <div className="mx-3 mb-4">
        {/* User card */}
        <div
          className="rounded-xl p-3"
          style={{
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
              style={{
                backgroundColor: "rgba(212,162,76,0.18)",
                color: "var(--accent)",
              }}
            >
              {dashboardUser.initial}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-bold"
                style={{ color: "var(--heading)" }}
              >
                {dashboardUser.name}
              </p>
              <span
                className="mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: "rgba(212,162,76,0.15)",
                  color: "var(--accent)",
                }}
              >
                مؤشر حِرفة ٨٧
              </span>
            </div>
          </div>
          <div className="mt-3">
            <RoleSwitcher role={role} onChange={onRoleChange} />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto px-3"
        aria-label="التنقّل الرئيسي"
      >
        <ul className="space-y-0.5">
          {dashboardNav.map((item) => {
            const Icon = ICONS[item.icon];
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavClick}
                  aria-current={active ? "page" : undefined}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
                  style={{
                    backgroundColor: active
                      ? "var(--surface-2)"
                      : "transparent",
                    color: active ? "var(--heading)" : "var(--ink)",
                    fontWeight: active ? 700 : 500,
                    borderInlineStart: active
                      ? "3px solid var(--accent)"
                      : "3px solid transparent",
                  }}
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={{
                      color: active ? "var(--accent)" : "var(--muted)",
                    }}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: theme toggle */}
      <div
        className="border-t p-3"
        style={{ borderColor: "var(--border)" }}
      >
        <DashboardThemeToggle />
      </div>
    </div>
  );
}

export default function Sidebar({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("pro");
  const [open, setOpen] = useState(false);

  return (
    <div
      className="flex overflow-hidden"
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        backgroundColor: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      {/* Desktop sidebar (right side via RTL) */}
      <aside
        className="hidden shrink-0 md:flex"
        style={{
          width: "248px",
          backgroundColor: "var(--surface)",
          borderInlineStart: "1px solid var(--border)",
        }}
      >
        <SidebarBody role={role} onRoleChange={setRole} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          />
        </div>
      )}
      <aside
        className="fixed inset-y-0 z-50 md:hidden"
        style={{
          insetInlineEnd: 0,
          width: "260px",
          maxWidth: "80vw",
          backgroundColor: "var(--surface)",
          borderInlineStart: "1px solid var(--border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
        }}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: "var(--muted)" }}
            >
              القائمة
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="إغلاق القائمة"
              className="rounded-lg p-1.5 transition-colors hover:bg-[var(--surface-2)]"
              style={{ color: "var(--muted)" }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <SidebarBody
              role={role}
              onRoleChange={setRole}
              onNavClick={() => setOpen(false)}
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ backgroundColor: "var(--bg)" }}
      >
        {/* Mobile top bar */}
        <div
          className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:hidden"
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Link href="/" className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
              style={{ backgroundColor: "var(--accent)", color: "#0E3A46" }}
            >
              ح
            </span>
            <span
              className="text-base font-bold"
              style={{ color: "var(--heading)" }}
            >
              حِرفة
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
            className="rounded-lg p-2 transition-colors hover:bg-[var(--surface-2)]"
            style={{ color: "var(--ink)" }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
