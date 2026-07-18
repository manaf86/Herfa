import { CATEGORY_META, PRIORITY_META, type Task } from "../../data/workspace";
import { taskColumnLabel } from "./TaskCard";

/* ═══════════ 1) List view ═══════════ */
export function ListView({ tasks }: { tasks: Task[] }) {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--surface-2)" }}>
              <Th>المهمة</Th>
              <Th>المسؤول</Th>
              <Th>الاستحقاق</Th>
              <Th>الأولوية</Th>
              <Th>الحالة</Th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr
                key={t.id}
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--border)",
                }}
              >
                <Td>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: CATEGORY_META[t.category].bg,
                        color: CATEGORY_META[t.category].fg,
                      }}
                    >
                      {CATEGORY_META[t.category].label}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--heading)" }}
                    >
                      {t.title}
                    </span>
                  </div>
                </Td>
                <Td>{t.assignee.name}</Td>
                <Td>{t.dueDate}</Td>
                <Td>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium"
                    style={{ color: PRIORITY_META[t.priority].color }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: PRIORITY_META[t.priority].color,
                      }}
                    />
                    {PRIORITY_META[t.priority].label}
                  </span>
                </Td>
                <Td>{taskColumnLabel(t.column)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════ 2) Timeline view (July, 4 weeks × 10 tasks) ═══════════ */
import { TIMELINE_WEEKS, taskWeekIndex } from "../../data/workspace";

export function TimelineView({ tasks }: { tasks: Task[] }) {
  return (
    <div
      className="overflow-hidden rounded-2xl p-5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p
        className="mb-4 text-xs"
        style={{ color: "var(--muted)" }}
      >
        المهام موزّعة على أسابيع يوليو حسب تاريخ الاستحقاق.
      </p>

      <div className="overflow-x-auto">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `220px repeat(${TIMELINE_WEEKS.length}, minmax(140px, 1fr))`,
          }}
        >
          {/* Header row */}
          <div />
          {TIMELINE_WEEKS.map((w) => (
            <div
              key={w.key}
              className="px-2 py-1.5 text-center text-[11px] font-bold"
              style={{
                color: "var(--muted)",
                backgroundColor: "var(--surface-2)",
                borderRadius: "6px",
              }}
            >
              {w.label}
            </div>
          ))}

          {/* Task rows */}
          {tasks.map((t) => {
            const w = taskWeekIndex(t);
            const cat = CATEGORY_META[t.category];
            return (
              <FragmentRow key={t.id}>
                <div
                  className="flex items-center gap-2 py-1.5 text-xs"
                  style={{ color: "var(--ink)" }}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.fg }}
                  />
                  <span className="truncate">{t.title}</span>
                </div>
                {TIMELINE_WEEKS.map((_, i) => (
                  <div key={i} className="flex items-center py-1.5">
                    {i === w && (
                      <div
                        className="w-full truncate rounded-md px-2 py-1 text-[10px] font-bold"
                        style={{
                          backgroundColor: cat.bg,
                          color: cat.fg,
                          border: `1px solid ${cat.fg}`,
                        }}
                      >
                        {t.dueDate}
                      </div>
                    )}
                  </div>
                ))}
              </FragmentRow>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* ═══════════ 3) Calendar view (July grid, dots per task-day) ═══════════ */
import { taskDayNumber } from "../../data/workspace";

const JULY_DAYS = 31;
const WEEK_LABELS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
/**
 * 1 يوليو 2026 = الأربعاء. في الأسبوع الذي يبدأ بالسبت:
 *   السبت=0, الأحد=1, الاثنين=2, الثلاثاء=3, الأربعاء=4, الخميس=5, الجمعة=6.
 * لذا نضع 4 خانات فارغة قبل اليوم 1.
 */
const JULY_1_OFFSET = 4;

export function CalendarView({ tasks }: { tasks: Task[] }) {
  // خارطة day → tasks
  const byDay = new Map<number, Task[]>();
  for (const t of tasks) {
    const d = taskDayNumber(t);
    if (d === null) continue;
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d)!.push(t);
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < JULY_1_OFFSET; i++) cells.push(null);
  for (let d = 1; d <= JULY_DAYS; d++) cells.push(d);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p className="mb-4 text-xs" style={{ color: "var(--muted)" }}>
        يوليو 2026 — النقاط تُشير إلى أيام فيها مهام مستحقّة.
      </p>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {WEEK_LABELS.map((w) => (
          <div
            key={w}
            className="py-1 text-[10px] font-bold"
            style={{ color: "var(--muted)" }}
          >
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d === null) {
            return <div key={`e-${i}`} />;
          }
          const dayTasks = byDay.get(d) ?? [];
          return (
            <div
              key={d}
              className="relative flex aspect-square flex-col items-center justify-start rounded-lg p-1.5"
              style={{
                backgroundColor:
                  dayTasks.length > 0
                    ? "var(--surface-2)"
                    : "transparent",
                border: "1px solid var(--border)",
              }}
              title={dayTasks.map((t) => t.title).join(" · ")}
            >
              <span
                className="text-xs tabular-nums"
                style={{
                  color:
                    dayTasks.length > 0
                      ? "var(--heading)"
                      : "var(--muted)",
                  fontWeight: dayTasks.length > 0 ? 700 : 500,
                }}
              >
                {d}
              </span>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-0.5">
                {dayTasks.slice(0, 4).map((t) => (
                  <span
                    key={t.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_META[t.category].fg }}
                    aria-hidden
                  />
                ))}
                {dayTasks.length > 4 && (
                  <span
                    className="ms-0.5 text-[8px]"
                    style={{ color: "var(--muted)" }}
                  >
                    +{dayTasks.length - 4}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3 text-[11px]"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        {(Object.keys(CATEGORY_META) as Task["category"][]).map((c) => (
          <span key={c} className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: CATEGORY_META[c].fg }}
            />
            {CATEGORY_META[c].label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-start text-xs font-bold uppercase tracking-wider"
      style={{ color: "var(--muted)" }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      className="px-4 py-3 text-sm"
      style={{ color: "var(--ink)" }}
    >
      {children}
    </td>
  );
}
