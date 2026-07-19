// المصدر الوحيد لأنواع أحداث الطلبات — يُطابق docs/spec/01-order-lifecycle.md.
// الجدول append-only: لا UPDATE ولا DELETE بعد الإنشاء.

export const ORDER_EVENT_TYPES = [
  "created",
  "paid",
  "requirements_submitted",
  "timer_started",
  "delivered",
  "revision_requested",
  "extension_proposed",
  "extension_accepted",
  "disputed",
  "ruling_issued",
  "accepted",
  "auto_accepted",
  "cleared",
  "cancelled",
  "chargeback_received",
  "seller_protected",
] as const;

export type OrderEventType = (typeof ORDER_EVENT_TYPES)[number];
