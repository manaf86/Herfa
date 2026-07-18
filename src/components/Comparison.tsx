import { Check, X } from "lucide-react";
import Reveal from "./Reveal";

type Row = { label: string; herfa: string | boolean; others: string | boolean };

const ROWS: Row[] = [
  { label: "العمولة", herfa: "15٪ → 6٪", others: "20٪ ثابتة" },
  { label: "دعم بشري في النزاع", herfa: true, others: false },
  { label: "حق الاستئناف", herfa: true, others: false },
  { label: "واجهة عربية أصلية", herfa: true, others: false },
  { label: "وسائل دفع محلية", herfa: true, others: false },
  { label: "مساحة عمل للمشروع", herfa: true, others: false },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(27,127,90,0.15)",
          color: "var(--success)",
        }}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(180,35,24,0.12)",
          color: "var(--alert)",
        }}
      >
        <X className="h-4 w-4" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="text-sm font-bold" style={{ color: "var(--heading)" }}>
      {value}
    </span>
  );
}

export default function Comparison() {
  return (
    <section
      className="py-20 sm:py-24"
      style={{ backgroundColor: "var(--surface-2)" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              حِرفة مقابل المنصات الأخرى
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
              الفرق ليس في الميزات فقط، بل في كيف تُعامَل حين يحدث خلاف.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div
            className="mt-12 overflow-hidden rounded-2xl shadow-sm"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <table className="w-full text-start">
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--surface-2)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <th
                    className="px-6 py-4 text-start text-sm font-bold"
                    style={{ color: "var(--muted)" }}
                  >
                    المعيار
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-bold"
                    style={{ color: "var(--heading)" }}
                  >
                    حِرفة
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-bold"
                    style={{ color: "var(--muted)" }}
                  >
                    منصات أخرى
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr
                    key={r.label}
                    style={{
                      borderBottom:
                        i < ROWS.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    <td
                      className="px-6 py-4 text-sm font-medium"
                      style={{ color: "var(--ink)" }}
                    >
                      {r.label}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Cell value={r.herfa} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Cell value={r.others} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
