"use client";

import { usePathname } from "next/navigation";
import ConversationList from "@/components/dashboard/ConversationList";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // على الجوال: نعرض إمّا القائمة أو المحادثة المفتوحة، لا الاثنين معاً.
  const hasSelection = /^\/dashboard\/messages\/.+/.test(pathname ?? "");

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)]"
      style={{ height: "calc(100dvh - 8rem)", minHeight: "560px" }}
    >
      <div className={`h-full min-w-0 ${hasSelection ? "hidden md:block" : "block"}`}>
        <ConversationList />
      </div>
      <div className={`h-full min-w-0 ${hasSelection ? "block" : "hidden md:block"}`}>
        {children}
      </div>
    </div>
  );
}
