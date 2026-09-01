"use client";

import { useEffect, useState } from "react";
import { MessageCircle, ArrowUp } from "lucide-react";

const WHATSAPP_NUMBER = "RECIPIENT_NUMBER"; // TODO: استبدله برقم واتساب الفعلي

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.41-.13-.95-.31-1.63-.6-2.87-1.24-4.74-4.13-4.89-4.32-.14-.19-1.17-1.56-1.17-2.98s.74-2.11 1-2.4c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.45.29.15.46.13.63-.05.17-.19.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.21.55.33.08.12.08.68-.16 1.37Z" />
    </svg>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
      style={{
        insetInlineEnd: "calc(100% + 10px)",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "var(--ink)",
        color: "var(--surface)",
      }}
    >
      {text}
    </span>
  );
}

/** رابط واتساب — دائرة 48px تكبر إلى 56px على الشاشات الأكبر من الجوال. */
function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fa-btn group relative flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:h-14 sm:w-14"
      style={{ backgroundColor: "#25D366", color: "#FFFFFF", animationDelay: "0s" }}
    >
      <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
      <Tooltip text="تواصل عبر واتساب" />
    </a>
  );
}

/** زر فتح الدردشة المباشرة — دائرة 48px تكبر إلى 56px على الشاشات الأكبر من الجوال. */
function ChatButton() {
  return (
    <button
      type="button"
      onClick={() => {
        // TODO: يفتح نافذة دردشة الدعم
      }}
      aria-label="الدردشة المباشرة"
      className="fa-btn group relative flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:h-14 sm:w-14"
      style={{ backgroundColor: "var(--accent)", color: "#FFFFFF", animationDelay: "0.08s" }}
    >
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
      <Tooltip text="الدردشة المباشرة" />
    </button>
  );
}

/** زر العودة للأعلى — دائرة 48px ثابتة، تظهر فقط بعد تمرير 400px. */
function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة للأعلى"
      className="fa-btn group relative flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: "var(--surface)",
        color: "var(--ink)",
        border: "1px solid var(--border)",
        animationDelay: "0s",
      }}
    >
      <ArrowUp className="h-5 w-5" />
      <Tooltip text="العودة للأعلى" />
    </button>
  );
}

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* الأزرار العائمة — أسفل اليمين */}
      <div
        className="flex flex-col gap-3"
        style={{
          position: "fixed",
          insetInlineEnd: "20px",
          insetBlockEnd: "20px",
          zIndex: 60,
        }}
      >
        <WhatsAppButton />
        <ChatButton />
      </div>

      {/* زر العودة للأعلى — أعلى اليسار */}
      {showTop && (
        <div
          style={{
            position: "fixed",
            insetInlineStart: "20px",
            insetBlockStart: "80px",
            zIndex: 60,
          }}
        >
          <BackToTopButton />
        </div>
      )}
    </>
  );
}
