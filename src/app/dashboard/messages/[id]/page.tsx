"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  Send,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

type Party = { id: string; name: string; avatarLetter: string };

type DirectMessage = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  sender: Party;
};

type ConversationDetail = {
  id: string;
  buyerId: string;
  sellerId: string;
  buyer: Party;
  seller: Party;
  gig: { id: string; slug: string; title: string } | null;
  messages: DirectMessage[];
};

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params?.id ?? "";

  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [meId, setMeId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!conversationId) return;
      try {
        const res = await fetch(`/api/conversations/${conversationId}`, {
          credentials: "same-origin",
        });
        if (res.status === 401) {
          window.location.href = `/login?next=/dashboard/messages/${conversationId}`;
          return;
        }
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("تعذّر جلب المحادثة");
        const data: { conversation: ConversationDetail } = await res.json();
        setConversation(data.conversation);
      } catch (e) {
        if (!silent) setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
      }
    },
    [conversationId],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "same-origin" });
        if (!cancelled && res.ok) {
          const d = await res.json();
          setMeId(d.user?.id ?? null);
        }
      } catch {
        // نتجاهل — الصفحة تعمل بلا الدور.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Polling كل 5 ثوانٍ لجلب الرسائل الجديدة.
  useEffect(() => {
    if (!conversation) return;
    const id = setInterval(() => void load(true), 5000);
    return () => clearInterval(id);
  }, [conversation, load]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [conversation?.messages.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setErr(null);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
        credentials: "same-origin",
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error ?? "تعذّر إرسال الرسالة");
      setDraft("");
      await load(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
    } finally {
      setSending(false);
    }
  };

  if (notFound) {
    return (
      <EmptyShell>
        <AlertCircle className="h-8 w-8" style={{ color: "var(--alert)" }} />
        <p className="text-sm" style={{ color: "var(--alert)" }}>
          هذه المحادثة غير موجودة أو لا تملك صلاحية عرضها.
        </p>
        <Link
          href="/dashboard/messages"
          className="mt-1 inline-flex items-center gap-1 text-sm hover:underline"
          style={{ color: "var(--muted)" }}
        >
          <ArrowRight className="h-4 w-4" />
          العودة للرسائل
        </Link>
      </EmptyShell>
    );
  }

  if (!conversation) {
    return (
      <EmptyShell>
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--muted)" }} />
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          جارٍ جلب المحادثة…
        </p>
      </EmptyShell>
    );
  }

  const amIBuyer = meId === conversation.buyerId;
  const otherParty = amIBuyer ? conversation.seller : conversation.buyer;

  return (
    <div
      className="flex h-full min-w-0 flex-col"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* رأس المحادثة */}
      <header
        className="flex items-center gap-3 px-4 py-3"
        style={{
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <Link
          href="/dashboard/messages"
          aria-label="العودة لقائمة المحادثات"
          className="rounded-lg p-1.5 transition-colors hover:bg-[var(--surface-2)] md:hidden"
          style={{ color: "var(--muted)" }}
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{
            backgroundColor: "rgba(212,162,76,0.18)",
            color: "var(--accent)",
          }}
        >
          {otherParty.avatarLetter}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold" style={{ color: "var(--heading)" }}>
            {otherParty.name}
          </p>
        </div>
      </header>

      {/* بطاقة الخدمة المرتبطة — إن وُجدت */}
      {conversation.gig && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5"
          style={{
            backgroundColor: "var(--accent-tint)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Link
            href={`/gig/${conversation.gig.slug}`}
            className="min-w-0 flex-1 truncate text-xs font-medium hover:underline"
            style={{ color: "var(--heading)" }}
          >
            {conversation.gig.title}
          </Link>
          {amIBuyer && (
            <Link
              href={`/orders/new?gig=${encodeURIComponent(conversation.gig.slug)}&package=STANDARD`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--btn-primary-bg)",
                color: "var(--btn-primary-fg)",
              }}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              اطلب هذه الخدمة
            </Link>
          )}
        </div>
      )}

      {/* الرسائل */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {conversation.messages.length === 0 && (
          <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
            لا رسائل بعد — ابدأ الحوار.
          </p>
        )}
        {conversation.messages.map((m) => (
          <MessageBubble key={m.id} m={m} mine={m.senderId === meId} />
        ))}
      </div>

      {/* حقل الإدخال */}
      <form
        onSubmit={send}
        className="p-3"
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        {err && (
          <p
            role="alert"
            className="mb-2 flex items-center gap-1.5 text-xs"
            style={{ color: "var(--alert)" }}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {err}
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(e as unknown as React.FormEvent);
              }
            }}
            placeholder="اكتب رسالة… (Enter للإرسال)"
            rows={2}
            maxLength={2000}
            className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none disabled:opacity-60"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--ink)",
              border: "1px solid var(--border)",
            }}
          />
          <button
            type="submit"
            aria-label="إرسال"
            disabled={sending || !draft.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ backgroundColor: "var(--btn-primary-bg)" }}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function EmptyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      {children}
    </div>
  );
}

function MessageBubble({ m, mine }: { m: DirectMessage; mine: boolean }) {
  const time = new Date(m.createdAt).toLocaleTimeString("ar-SA-u-nu-latn", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <article className={`flex gap-2 ${mine ? "flex-row-reverse" : ""}`}>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          backgroundColor: "rgba(212,162,76,0.18)",
          color: "var(--accent)",
        }}
      >
        {m.sender.avatarLetter}
      </span>
      <div className="min-w-0 max-w-[80%]">
        <div
          className={`flex items-baseline gap-2 ${mine ? "flex-row-reverse" : ""}`}
        >
          <p className="text-xs font-bold" style={{ color: "var(--heading)" }}>
            {m.sender.name}
          </p>
          <span className="text-[10px] tabular-nums" style={{ color: "var(--muted)" }}>
            {time}
          </span>
        </div>
        <p
          className="mt-1 whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-relaxed"
          style={{
            backgroundColor: mine ? "var(--accent-tint)" : "var(--surface-2)",
            color: "var(--ink)",
          }}
        >
          {m.body}
        </p>
      </div>
    </article>
  );
}
