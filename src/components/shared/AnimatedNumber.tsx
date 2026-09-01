"use client";

import { useEffect, useState } from "react";
import { useInView } from "../../lib/useInView";

type Props = {
  target: number;
  decimals?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
};

/** رقم يُعدّ تصاعدياً من صفر إلى قيمته عند ظهوره في نافذة العرض — أرقام لاتينية دائماً. */
export default function AnimatedNumber({
  target,
  decimals = 0,
  duration = 1300,
  className,
  style,
}: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className} style={style}>
      {formatted}
    </span>
  );
}
