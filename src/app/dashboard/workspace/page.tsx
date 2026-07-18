"use client";

import { useMemo, useState } from "react";
import {
  LayoutGrid,
  List as ListIcon,
  BarChart3,
  Calendar as CalendarIcon,
} from "lucide-react";
import MilestonesBar from "../../../components/workspace/MilestonesBar";
import TaskCard from "../../../components/workspace/TaskCard";
import TaskDrawer from "../../../components/workspace/TaskDrawer";
import {
  ListView,
  TimelineView,
  CalendarView,
} from "../../../components/workspace/WorkspaceViews";
import {
  KANBAN_COLUMNS,
  tasks as INITIAL_TASKS,
  workspaceOrder,
  type ColumnKey,
  type Task,
} from "../../../data/workspace";

type ViewKey = "kanban" | "list" | "timeline" | "calendar";

const VIEW_TABS: { key: ViewKey; label: string; icon: React.ReactNode }[] = [
  { key: "kanban", label: "كانبان", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { key: "list", label: "قائمة", icon: <ListIcon className="h-3.5 w-3.5" /> },
  {
    key: "timeline",
    label: "مخطط زمني",
    icon: <BarChart3 className="h-3.5 w-3.5" />,
  },
  {
    key: "calendar",
    label: "تقويم",
    icon: <CalendarIcon className="h-3.5 w-3.5" />,
  },
];

export default function WorkspacePage() {
  const [view, setView] = useState<ViewKey>("kanban");
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const openTask = useMemo(
    () => tasks.find((t) => t.id === openTaskId) ?? null,
    [openTaskId, tasks]
  );

  const handleToggleSubtask = (taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id !== taskId
          ? t
          : {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subId ? { ...s, done: !s.done } : s
              ),
            }
      )
    );
  };

  const handleSendForReview = (id: string) => {
    // TODO: عند الربط الحقيقي، تُرسَل المهمة إلى العميل ويُنتقل عبر webhook.
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, column: "done" as ColumnKey } : t))
    );
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Order title header */}
      <header className="mb-5">
        <p
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          مساحة العمل
        </p>
        <h1
          className="mt-1 text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--heading)" }}
        >
          {workspaceOrder.title}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          العميل: {workspaceOrder.client} · البائعة: {workspaceOrder.seller.name} ·
          الطلب {workspaceOrder.id}
        </p>
      </header>

      {/* Milestones bar */}
      <div className="mb-6">
        <MilestonesBar />
      </div>

      {/* View tabs */}
      <div
        role="tablist"
        aria-label="طريقة عرض المهام"
        className="mb-4 flex flex-wrap gap-1 rounded-full p-1"
        style={{
          backgroundColor: "var(--surface-2)",
          border: "1px solid var(--border)",
          width: "fit-content",
        }}
      >
        {VIEW_TABS.map((v) => {
          const active = view === v.key;
          return (
            <button
              key={v.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setView(v.key)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                backgroundColor: active ? "var(--surface)" : "transparent",
                color: active ? "var(--heading)" : "var(--muted)",
                fontWeight: active ? 700 : 500,
                boxShadow: active ? "var(--shadow-sm)" : "none",
              }}
            >
              {v.icon}
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Views */}
      {view === "kanban" && (
        <KanbanBoard
          tasks={tasks}
          onOpen={setOpenTaskId}
          onSendForReview={handleSendForReview}
        />
      )}
      {view === "list" && <ListView tasks={tasks} />}
      {view === "timeline" && <TimelineView tasks={tasks} />}
      {view === "calendar" && <CalendarView tasks={tasks} />}

      {/* Task drawer */}
      <TaskDrawer
        task={openTask}
        onClose={() => setOpenTaskId(null)}
        onToggleSubtask={handleToggleSubtask}
      />
    </div>
  );
}

// ═══════════ Kanban board ═══════════
function KanbanBoard({
  tasks,
  onOpen,
  onSendForReview,
}: {
  tasks: Task[];
  onOpen: (id: string) => void;
  onSendForReview: (id: string) => void;
}) {
  const byColumn = new Map<ColumnKey, Task[]>();
  for (const col of KANBAN_COLUMNS) byColumn.set(col.key, []);
  for (const t of tasks) byColumn.get(t.column)?.push(t);

  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${KANBAN_COLUMNS.length}, minmax(240px, 1fr))`,
        }}
      >
        {KANBAN_COLUMNS.map((col) => {
          const list = byColumn.get(col.key) ?? [];
          const over = list.length > col.wipLimit;
          return (
            <div
              key={col.key}
              className="flex min-h-[400px] flex-col rounded-2xl p-3"
              style={{
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              <header className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-sm font-bold"
                    style={{ color: "var(--heading)" }}
                  >
                    {col.label}
                  </h2>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] tabular-nums"
                    style={{
                      backgroundColor: "var(--surface)",
                      color: "var(--muted)",
                    }}
                  >
                    {list.length}
                  </span>
                </div>
                {col.wipLimit < 100 && (
                  <span
                    className="text-[10px]"
                    style={{
                      color: over ? "var(--alert)" : "var(--muted)",
                      fontWeight: over ? 700 : 500,
                    }}
                    title="حدّ العمل الجاري"
                  >
                    WIP {list.length}/{col.wipLimit}
                  </span>
                )}
              </header>

              <div className="flex-1 space-y-2.5">
                {list.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onOpen={onOpen}
                    onSendForReview={onSendForReview}
                  />
                ))}
                {list.length === 0 && (
                  <div
                    className="mt-6 rounded-lg py-6 text-center text-xs"
                    style={{
                      color: "var(--muted)",
                      border: "1px dashed var(--border)",
                    }}
                  >
                    فارغ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
