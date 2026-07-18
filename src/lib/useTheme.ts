"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "herfa-theme";

export type Theme = "light" | "dark";

/**
 * Hook مشترك لإدارة الوضع الفاتح/الداكن.
 * يحفظ الاختيار في localStorage ويطبّقه على <html data-theme="…">.
 * لا يعتمد على تكرار المنطق في كل مكوّن.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: Theme = "light";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark") initial = "dark";
    } catch {
      // localStorage غير متاح — نتجاهل
    }
    apply(initial);
    setThemeState(initial);
    setMounted(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // نتجاهل — لن يُحفظ الاختيار عبر جلسات
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggle, mounted, isDark: theme === "dark" };
}

function apply(t: Theme) {
  if (typeof document === "undefined") return;
  if (t === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}
