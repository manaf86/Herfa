"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DashboardThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("herfa-theme")
        : null;
    const dark = saved === "dark";
    setIsDark(dark);
    setMounted(true);
    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("herfa-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("herfa-theme", "light");
    }
  };

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
