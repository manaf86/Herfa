import { ShieldCheck, BadgeCheck } from "lucide-react";

const PAYMENT_BADGES = ["مدى", "Apple Pay", "تحويل بنكي", "Payoneer"];

export default function TrustBar() {
  return (
    <section
      style={{
        backgroundColor: "var(--surface)",
        borderBlock: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-4 py-4.5 sm:px-6 lg:px-8" style={{ paddingBlock: 18 }}>
        <div className="flex items-center gap-3" style={{ minWidth: 250 }}>
          <span
            className="grid shrink-0 place-items-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              backgroundColor: "rgba(27,127,90,0.14)",
              color: "var(--success)",
            }}
          >
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <div className="font-semibold" style={{ color: "var(--ink)" }}>
              أموالك في الخزنة حتى تستلم عملك
            </div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              حماية دفع كاملة على كل مشروع
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PAYMENT_BADGES.map((b) => (
            <span
              key={b}
              className="text-sm"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "7px 12px",
                color: "var(--muted)",
                backgroundColor: "var(--bg)",
              }}
            >
              {b}
            </span>
          ))}
          <span
            className="inline-flex items-center gap-1.5 text-sm"
            style={{
              border: "1px solid var(--accent)",
              borderRadius: 8,
              padding: "7px 12px",
              color: "var(--heading)",
              backgroundColor: "rgba(212,162,76,0.14)",
            }}
          >
            <BadgeCheck className="h-4 w-4" /> مراجعة شرعية
          </span>
        </div>
      </div>
    </section>
  );
}
