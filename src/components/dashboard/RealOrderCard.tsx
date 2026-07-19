"use client";

import Link from "next/link";
import { Wallet, Clock, User, Package as PackageIcon } from "lucide-react";

type Status =
  | "PENDING_PAYMENT"
  | "AWAITING_REQUIREMENTS"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "REVISION_REQUESTED"
  | "ACCEPTED"
  | "COMPLETED"
  | "CANCELLED";

export type RealOrder = {
  id: string;
  reference: string;
  status: Status;
  amountMinor: number;
  timerStartedAt: string | null;
  dueAt: string | null;
  createdAt: string;
  buyerId: string;
  sellerId: string;
  gig: { id: string; slug: string; title: string };
  package: {
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    title: string;
    deliveryDays: number;
  };
  buyer: { id: string; name: string; avatarLetter: string };
  seller: { id: string; name: string; avatarLetter: string };
};

const STATUS_META: Record<Status, { label: string; fg: string; bg: string }> = {
  PENDING_PAYMENT: {
    label: "بانتظار الدفع",
    fg: "var(--muted)",
    bg: "rgba(148,148,148,0.12)",
  },
  AWAITING_REQUIREMENTS: {
    label: "بانتظار المتطلبات",
    fg: "var(--info)",
    bg: "var(--info-tint)",
  },
  IN_PROGRESS: {
    label: "قيد التنفيذ ⏱",
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  DELIVERED: {
    label: "بانتظار الاعتماد",
    fg: "var(--accent)",
    bg: "var(--accent-tint)",
  },
  REVISION_REQUESTED: {
    label: "طُلب تعديل",
    fg: "var(--warn)",
    bg: "var(--warn-tint)",
  },
  ACCEPTED: {
    label: "مكتمل ✓",
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  COMPLETED: {
    label: "مكتمل ✓",
    fg: "var(--success)",
    bg: "var(--success-tint)",
  },
  CANCELLED: {
    label: "ملغى",
    fg: "var(--muted)",
    bg: "rgba(148,148,148,0.12)",
  },
};

const TIER_LABEL = { BASIC: "الأساسية", STANDARD: "القياسية", PREMIUM: "الاحترافية" };

export default function RealOrderCard({
  order,
  meId,
}: {
  order: RealOrder;
  meId: string;
}) {
  const status = STATUS_META[order.status];
  const iAmBuyer = order.buyerId === meId;
  const otherParty = iAmBuyer ? order.seller : order.buyer;
  const partyLabel = iAmBuyer ? "البائع" : "العميل";

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-2xl p-5 transition-all hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: "var(--muted)" }}
        >
          {order.reference}
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ backgroundColor: status.bg, color: status.fg }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: status.fg }}
          />
          {status.label}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{
            backgroundColor: "var(--surface-2)",
            color: "var(--muted)",
          }}
        >
          {iAmBuyer ? "مشترٍ" : "بائع"}
        </span>
      </div>

      <h3
        className="text-base font-bold leading-snug"
        style={{ color: "var(--heading)" }}
      >
        {order.gig.title}
      </h3>
      <p
        className="mt-1 flex items-center gap-1.5 text-xs"
        style={{ color: "var(--muted)" }}
      >
        <User className="h-3.5 w-3.5" />
        {partyLabel}: {otherParty.name}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
        <Chip
          icon={<Wallet className="h-3 w-3" />}
          label={`${(order.amountMinor / 100).toLocaleString("en-US")} ر.س`}
        />
        <Chip
          icon={<PackageIcon className="h-3 w-3" />}
          label={TIER_LABEL[order.package.tier]}
        />
        <Chip
          icon={<Clock className="h-3 w-3" />}
          label={`${order.package.deliveryDays} أيام`}
        />
      </div>
    </Link>
  );
}

function Chip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 tabular-nums"
      style={{
        backgroundColor: "var(--surface-2)",
        color: "var(--ink)",
      }}
    >
      {icon}
      {label}
    </span>
  );
}
