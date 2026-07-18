"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../lib/useTheme";

/**
 * زر تبديل الوضع الداكن داخل الشريط الجانبي (خلفية فاتحة).
 * يعتمد على hook useTheme الموحّد، لا يكرّر منطق localStorage.
 */
export default function DashboardThemeToggle() {
  const { isDark, mounted, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"
      }
      className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
      style={{
        border: "1px solid var(--border)",
        color: "var(--ink)",
      }}
    >
      {mounted && isDark ? (
        <>
          <Sun className="h-4 w-4" />
          الوضع الفاتح
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          الوضع الداكن
        </>
      )}
    </button>
  );
}
