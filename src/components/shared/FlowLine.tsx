"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../../lib/useInView";

type Props = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
};

/** شريط/خط يمتلئ (scaleX من الصفر إلى الواحد) عند ظهوره في نافذة العرض. */
export default function FlowLine({ children, className, style, delay = 0.2 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: inView ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "right",
        transition: `transform 1.4s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
