"use client";

import { useEffect, useState } from "react";
import { useInView } from "../../lib/useInView";

type Props = { pct: number; size?: number; stroke?: number };

/** حلقة تقدّم دائرية ترسم نسبتها عند الظهور في نافذة العرض. */
export default function AnimatedRing({ pct, size = 70, stroke = 8 }: Props) {
  const { ref, inView } = useInView<SVGSVGElement>();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [offset, setOffset] = useState(c);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setOffset(c * (1 - pct / 100)), 40);
    return () => clearTimeout(t);
  }, [inView, pct, c]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--surface-2)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)" }}
      />
    </svg>
  );
}
