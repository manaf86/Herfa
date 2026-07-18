import { CheckSquare, MessageCircle, Send } from "lucide-react";
import {
  CATEGORY_META,
  PRIORITY_META,
  type ColumnKey,
  type Task,
} from "../../data/workspace";

type Props = {
  task: Task;
  onOpen: (id: string) => void;
  onSendForReview?: (id: string) => void;
};

export default function TaskCard({ task, onOpen, onSendForReview }: Props) {
  const cat = CATEGORY_META[task.category];
  const pri = PRIORITY_META[task.priority];
  const doneSubtasks = task.subtasks.filter((s) => s.done).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <article
      className="cursor-pointer rounded-xl p-3 text-start transition-all hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
      onClick={() => onOpen(task.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(task.id);
        }
      }}
    >
      {/* Top row: category + priority dot */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: cat.bg, color: cat.fg }}
        >
          {cat.label}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[10px] font-medium"
          style={{ color: pri.color }}
          title={`أولوية ${pri.label}`}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: pri.color }}
          />
          {pri.label}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-sm font-bold leading-snug"
        style={{ color: "var(--heading)" }}
      >
        {task.title}
      </h3>

      {/* Middle: assignee + due date */}
      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5" style={{ color: "var(--muted)" }}>
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: "rgba(212,162,76,0.18)",
              color: "var(--accent)",
            }}
          >
            {task.assignee.initial}
          </span>
          <span className="truncate">{task.assignee.name}</span>
        </div>
        <span style={{ color: "var(--muted)" }}>{task.dueDate}</span>
      </div>

      {/* Counters */}
      <div
        className="mt-3 flex items-center gap-4 border-t pt-2 text-[11px]"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        <span className="flex items-center gap-1 tabular-nums">
          <CheckSquare className="h-3.5 w-3.5" />
          {doneSubtasks}/{totalSubtasks}
        </span>
        <span className="flex items-center gap-1 tabular-nums">
          <MessageCircle className="h-3.5 w-3.5" />
          {task.comments.length}
        </span>
      </div>

      {/* Review action button (only in review column) */}
      {task.column === "review" && onSendForReview && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSendForReview(task.id);
          }}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-transform hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--btn-primary-bg)",
            color: "var(--btn-primary-fg)",
          }}
        >
          <Send className="h-3.5 w-3.5" />
          أرسل للاعتماد
        </button>
      )}
    </article>
  );
}

/** لعرض قائمة بلا مطابقة ألوان (يُستخدم في تبويب "قائمة"). */
export function taskColumnLabel(col: ColumnKey): string {
  return (
    {
      "in-progress": "قيد التنفيذ",
      review: "مراجعة العميل",
      revisions: "تعديلات",
      done: "مكتمل",
    } as Record<ColumnKey, string>
  )[col];
}
