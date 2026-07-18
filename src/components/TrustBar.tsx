import { Lock, ShieldCheck } from "lucide-react";

const BADGES = ["مدى", "Apple Pay", "تحويل بنكي", "Payoneer", "مراجعة شرعية"];

export default function TrustBar() {
  return (
    <section
      style={{
        backgroundColor: "var(--surface-2)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:px-8">
        <p
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--heading)" }}
        >
          <Lock className="h-4 w-4" style={{ color: "var(--accent)" }} />
          أموالك في الخزنة حتى تستلم عملك
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {BADGES.map((b) => (
            <span
              key={b}
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "var(--muted)" }}
            >
              <ShieldCheck
                className="h-3.5 w-3.5"
                style={{ color: "var(--success)" }}
              />
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
