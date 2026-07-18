"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Calendar,
  Flag,
  User,
  Paperclip,
  MessageCircle,
  Play,
  Pause,
  Send,
} from "lucide-react";
import {
  CATEGORY_META,
  PRIORITY_META,
  type Subtask,
  type Task,
} from "../../data/workspace";

type Props = {
  task: Task | null;
  onClose: () => void;
  onToggleSubtask: (taskId: string, subId: string) => void;
};

export default function TaskDrawer({ task, onClose, onToggleSubtask }: Props) {
  // مؤقت تتبع الوقت
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [commentDraft, setCommentDraft] = useState("");
  const openRef = useRef(false);

  useEffect(() => {
    if (task) {
      // إعادة تعيين المؤقت عند فتح مهمة مختلفة
      openRef.current = true;
      setRunning(false);
      setSeconds(0);
      setCommentDraft("");
    } else {
      openRef.current = false;
    }
  }, [task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // إغلاق بمفتاح Esc
  useEffect(() => {
    if (!task) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [task, onClose]);

  const open = task !== null;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <aside
        className="fixed inset-y-0 z-50 flex flex-col overflow-hidden"
        style={{
          insetInlineStart: 0,
          width: "min(380px, 90vw)",
          backgroundColor: "var(--surface)",
          borderInlineEnd: "1px solid var(--border)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }}
        aria-hidden={!open}
        aria-label="تفاصيل المهمة"
      >
        {task && (
          <>
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                تفاصيل المهمة
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="rounded-lg p-1.5 transition-colors hover:bg-[var(--surface-2)]"
                style={{ color: "var(--muted)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Title + category + priority */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <CategoryBadge category={task.category} />
                <PriorityBadge priority={task.priority} />
              </div>
              <h2
                className="text-lg font-bold leading-snug"
                style={{ color: "var(--heading)" }}
              >
                {task.title}
              </h2>

              {/* Meta grid */}
              <dl
                className="mt-4 grid grid-cols-2 gap-3 rounded-xl p-3 text-xs"
                style={{ backgroundColor: "var(--surface-2)" }}
              >
                <MetaRow
                  icon={<User className="h-3.5 w-3.5" />}
                  label="المسؤول"
                  value={task.assignee.name}
                />
                <MetaRow
                  icon={<Calendar className="h-3.5 w-3.5" />}
                  label="الاستحقاق"
                  value={task.dueDate}
                />
                <MetaRow
                  icon={<Flag className="h-3.5 w-3.5" />}
                  label="الأولوية"
                  value={PRIORITY_META[task.priority].label}
                />
                <MetaRow
                  icon={<Paperclip className="h-3.5 w-3.5" />}
                  label="الملفات"
                  value={`${task.files.length} إصدار`}
                />
              </dl>

              {/* Subtasks */}
              <Section title="المهام الفرعية" count={task.subtasks.length}>
                <ul className="space-y-2">
                  {task.subtasks.map((s) => (
                    <SubtaskItem
                      key={s.id}
                      sub={s}
                      onToggle={() => onToggleSubtask(task.id, s.id)}
                    />
                  ))}
                  {task.subtasks.length === 0 && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      لا مهام فرعية.
                    </p>
                  )}
                </ul>
              </Section>

              {/* Files */}
              <Section title="إصدارات الملفات" count={task.files.length}>
                {task.files.length > 0 ? (
                  <ul className="space-y-2">
                    {task.files.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
                        style={{
                          backgroundColor: "var(--surface-2)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate font-medium"
                            style={{ color: "var(--ink)" }}
                          >
                            {f.name}
                          </p>
                          <p
                            className="mt-0.5 text-[10px]"
                            style={{ color: "var(--muted)" }}
                          >
                            {f.uploadedBy} · {f.uploadedAt}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: "var(--accent-tint)",
                            color: "var(--accent)",
                          }}
                        >
                          {f.version}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    لا ملفات مرفوعة بعد.
                  </p>
                )}
              </Section>

              {/* Comments */}
              <Section
                title="التعليقات"
                count={task.comments.length}
                icon={<MessageCircle className="h-3.5 w-3.5" />}
              >
                {task.comments.length > 0 ? (
                  <ul className="space-y-3">
                    {task.comments.map((c) => (
                      <li key={c.id} className="flex gap-2">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                          style={{
                            backgroundColor: "rgba(212,162,76,0.18)",
                            color: "var(--accent)",
                          }}
                        >
                          {c.initial}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-xs font-bold"
                            style={{ color: "var(--heading)" }}
                          >
                            {c.author}
                            <span
                              className="ms-2 text-[10px] font-normal"
                              style={{ color: "var(--muted)" }}
                            >
                              {c.timeAgo}
                            </span>
                          </p>
                          <p
                            className="mt-1 text-sm leading-relaxed"
                            style={{ color: "var(--ink)" }}
                          >
                            {c.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    لا تعليقات بعد.
                  </p>
                )}

                {/* Comment input (visual only) */}
                <div className="mt-3 flex gap-2">
                  <input
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    placeholder="اكتب تعليقاً…"
                    className="flex-1 rounded-lg px-3 py-2 text-xs outline-none"
                    style={{
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--ink)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setCommentDraft("")}
                    disabled={!commentDraft.trim()}
                    aria-label="إرسال تعليق"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                    style={{ backgroundColor: "var(--btn-primary-bg)" }}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Section>

              {/* Time tracker */}
              <Section title="مؤقت تتبع الوقت">
                <div
                  className="flex items-center justify-between rounded-xl p-3"
                  style={{
                    backgroundColor: "var(--surface-2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="text-xl font-bold tabular-nums"
                    style={{ color: "var(--heading)" }}
                    aria-live="polite"
                  >
                    {formatDuration(seconds)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRunning((r) => !r)}
                    aria-label={running ? "أوقف المؤقت" : "ابدأ المؤقت"}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: running
                        ? "var(--alert)"
                        : "var(--success)",
                      color: "#FFFFFF",
                    }}
                  >
                    {running ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        أوقف
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        ابدأ
                      </>
                    )}
                  </button>
                </div>
              </Section>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function formatDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

function CategoryBadge({ category }: { category: Task["category"] }) {
  const c = CATEGORY_META[category];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {c.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const p = PRIORITY_META[priority];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium"
      style={{ color: p.color }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: p.color }}
      />
      أولوية {p.label}
    </span>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 text-[10px]"
        style={{ color: "var(--muted)" }}
      >
        {icon}
        {label}
      </div>
      <p
        className="mt-0.5 text-xs font-bold"
        style={{ color: "var(--heading)" }}
      >
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  count,
  icon,
  children,
}: {
  title: string;
  count?: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h3
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          {title}
        </h3>
        {count !== undefined && (
          <span
            className="rounded-full px-1.5 text-[10px] tabular-nums"
            style={{
              backgroundColor: "var(--surface-2)",
              color: "var(--muted)",
            }}
          >
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function SubtaskItem({
  sub,
  onToggle,
}: {
  sub: Subtask;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-start gap-2">
      <input
        type="checkbox"
        id={`sub-${sub.id}`}
        checked={sub.done}
        onChange={onToggle}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--success)]"
      />
      <label
        htmlFor={`sub-${sub.id}`}
        className="cursor-pointer text-sm leading-snug"
        style={{
          color: sub.done ? "var(--muted)" : "var(--ink)",
          textDecoration: sub.done ? "line-through" : "none",
        }}
      >
        {sub.label}
      </label>
    </li>
  );
}
