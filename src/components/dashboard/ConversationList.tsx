"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";

type Party = { id: string; name: string; avatarLetter: string };

type ConversationListItem = {
  id: string;
  otherParty: Party;
  gig: { id: string; slug: string; title: string } | null;
  lastMessage: { id: string; body: string; createdAt: string; senderId: string } | null;
  updatedAt: string;
  unreadCount: number;
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `قبل ${mins} د`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `قبل ${hrs} س`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `قبل ${days} يوم`;
  return new Date(iso).toLocaleDateString("ar-SA-u-nu-latn", {
    day: "numeric",
    month: "short",
  });
}

export default function ConversationList() {
  const pathname = usePathname();
  const activeId = pathname?.split("/dashboard/messages/")[1]?.split("/")[0] ?? null;

  const [items, setItems] = useState<ConversationListItem[] | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations", { credentials: "same-origin" });
      if (!res.ok) {
        setItems([]);
        return;
      }
      const data: { conversations: ConversationListItem[] } = await res.json();
      setItems(data.conversations);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, pathname]);

  // نحدّث القائمة دورياً حتى تظهر المحادثات الجديدة وتُحدَّث عدّادات غير المقروء.
  useEffect(() => {
    const id = setInterval(() => void load(), 10000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <aside
      className="flex h-full min-w-0 flex-col"
      style={{
        borderInlineEnd: "1px solid var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <header
        className="px-4 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h1 className="text-lg font-bold" style={{ color: "var(--heading)" }}>
          الرسائل
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {items === null ? (
          <div
            className="flex items-center gap-2 p-4 text-sm"
            style={{ color: "var(--muted)" }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            جارٍ التحميل…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <MessageSquare className="h-8 w-8" style={{ color: "var(--muted)" }} />
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              لا محادثات بعد. تواصل مع محترف من صفحة أي خدمة لبدء أول محادثة.
            </p>
          </div>
        ) : (
          <ul>
            {items.map((c) => {
              const active = c.id === activeId;
              return (
                <li key={c.id}>
                  <Link
                    href={`/dashboard/messages/${c.id}`}
                    className="flex items-start gap-3 px-4 py-3 transition-colors"
                    style={{
                      backgroundColor: active ? "var(--surface-2)" : "transparent",
                      borderInlineStart: active
                        ? "3px solid var(--accent)"
                        : "3px solid transparent",
                    }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: "rgba(212,162,76,0.18)",
                        color: "var(--accent)",
                      }}
                    >
                      {c.otherParty.avatarLetter}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="truncate text-sm font-bold"
                          style={{ color: "var(--heading)" }}
                        >
                          {c.otherParty.name}
                        </p>
                        {c.lastMessage && (
                          <span
                            className="shrink-0 text-[10px]"
                            style={{ color: "var(--muted)" }}
                          >
                            {timeAgo(c.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p
                          className="truncate text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          {c.lastMessage ? c.lastMessage.body : "لا رسائل بعد"}
                        </p>
                        {c.unreadCount > 0 && (
                          <span
                            className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                            style={{
                              backgroundColor: "var(--accent)",
                              color: "#0E3A46",
                            }}
                          >
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                      {c.gig && (
                        <p
                          className="mt-0.5 truncate text-[10px]"
                          style={{ color: "var(--muted)" }}
                        >
                          {c.gig.title}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
