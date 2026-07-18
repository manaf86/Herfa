import Link from "next/link";
import { PackagePlus } from "lucide-react";
import {
  recentOrders,
  orderStatusLabels,
  type OrderStatus,
} from "../../data/dashboard";

const STATUS_STYLE: Record<
  OrderStatus,
  { fg: string; bg: string }
> = {
  "in-progress": {
    fg: "var(--info)",
    bg: "var(--info-tint)",
  },
  "awaiting-approval": {
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  late: {
    fg: "var(--alert)",
    bg: "var(--alert-tint)",
  },
  completed: {
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: s.fg }}
      />
      {orderStatusLabels[status]}
    </span>
  );
}

export default function RecentOrdersCard() {
  const isEmpty = recentOrders.length === 0;

  return (
    <article
      className="rounded-2xl"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <header
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--heading)" }}
          >
            آخر الطلبات
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            آخر خمسة طلبات على حسابك.
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="text-sm font-bold transition-colors hover:underline"
          style={{ color: "var(--heading)" }}
        >
          عرض الكل ←
        </Link>
      </header>

      {isEmpty ? (
        // ملاحظة: هذه الحالة الفارغة معطّلة الآن لأن لدينا طلبات وهمية. سنعتمد عليها لاحقاً حين تكون البيانات حقيقية.
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--surface-2)",
                }}
              >
                <Th>الطلب</Th>
                <Th>العميل</Th>
                <Th align="end">القيمة</Th>
                <Th>التسليم</Th>
                <Th>الحالة</Th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr
                  key={o.id}
                  style={{
                    borderTop:
                      i === 0 ? "none" : "1px solid var(--border)",
                  }}
                >
                  <Td>
                    <span className="font-medium" style={{ color: "var(--heading)" }}>
                      {o.title}
                    </span>
                  </Td>
                  <Td muted>{o.client}</Td>
                  <Td align="end">
                    <span className="font-bold tabular-nums" style={{ color: "var(--heading)" }}>
                      {o.amount}
                    </span>
                  </Td>
                  <Td muted>{o.delivery}</Td>
                  <Td>
                    <StatusBadge status={o.status} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

function Th({
  children,
  align = "start",
}: {
  children: React.ReactNode;
  align?: "start" | "end";
}) {
  return (
    <th
      className="px-6 py-3 text-xs font-bold uppercase tracking-wider"
      style={{
        color: "var(--muted)",
        textAlign: align,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "start",
  muted = false,
}: {
  children: React.ReactNode;
  align?: "start" | "end";
  muted?: boolean;
}) {
  return (
    <td
      className="px-6 py-4 text-sm"
      style={{
        color: muted ? "var(--muted)" : "var(--ink)",
        textAlign: align,
      }}
    >
      {children}
    </td>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: "var(--accent-tint)",
          color: "var(--accent)",
        }}
      >
        <PackagePlus className="h-6 w-6" />
      </div>
      <p
        className="max-w-sm text-sm leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        لا توجد طلبات بعد — انشر خدمتك الأولى ليبدأ العملاء بالتواصل معك.
      </p>
      <button
        type="button"
        className="mt-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--btn-primary-bg)",
          color: "var(--btn-primary-fg)",
        }}
      >
        أنشئ خدمتك الأولى
      </button>
    </div>
  );
}
