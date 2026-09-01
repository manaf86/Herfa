"use client";

import { useEffect, useRef, useState } from "react";

/**
 * يراقب ظهور عنصر داخل نافذة العرض عبر IntersectionObserver، ويثبّت
 * حالة "ظاهر" بمجرد أول تقاطع (لا يعود إلى false لاحقاً).
 */
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}
