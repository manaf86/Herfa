"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../lib/useTheme";

/**
 * زر تبديل الوضع الداكن — يُستخدم داخل رأس داكن (لون النص أبيض).
 * يعتمد على hook useTheme، لا يحمل منطقاً مكرّراً.
 */
export default function ThemeToggleButton() {
  const { isDark, mounted, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"
      }
      title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      style={{ border: "1px solid rgba(255,255,255,0.18)" }}
    >
      {mounted && isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
