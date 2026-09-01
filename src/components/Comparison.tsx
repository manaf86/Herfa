import { Check, X } from "lucide-react";
import Reveal from "./Reveal";

type Row = { feature: string; herfa: string; others: string };

const ROWS: Row[] = [
  { feature: "العمولة", herfa: "تبدأ 15٪ وتنخفض إلى 6٪", others: "20٪ ثابتة" },
  { feature: "دعم بشري في النزاع", herfa: "فريق مختصّ يراجع كل حالة", others: "ردود آلية وقوالب جاهزة" },
  { feature: "حق الاستئناف", herfa: "استئناف بشري مضمون", others: "قرار نهائي بلا مراجعة" },
  { feature: "واجهة عربية أصلية", herfa: "عربية كاملة بتصميم RTL", others: "ترجمة جزئية" },
  { feature: "وسائل دفع محلية", herfa: "مدى، Apple Pay، تحويل بنكي", others: "بطاقات دولية فقط" },
  { feature: "مساحة عمل للمشروع", herfa: "لوحات ومعالم مالية مدمجة", others: "محادثة فقط" },
];

export default function Comparison() {
  return (
    <section
      style={{
        backgroundColor: "var(--surface-2)",
        paddingBlock: "clamp(56px, 8vw, 96px)",
        paddingInline: 24,
      }}
    >
      <div style={{ maxWidth: 1000, marginInline: "auto" }}>
        <Reveal style={{ textAlign: "center", maxWidth: 640, marginInline: "auto", marginBlockEnd: 44 }}>
          <h2 className="font-bold" style={{ fontSize: "clamp(26px, 4vw, 40px)", color: "var(--heading)", margin: "0 0 12px", lineHeight: 1.2 }}>
            مقارنة صريحة
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 17, margin: 0, lineHeight: 1.6 }}>
            لا نخفي الفروق. هذه حِرفة مقابل المنصات الأخرى.
          </p>
        </Reveal>

        <Reveal style={{ overflowX: "auto", maxWidth: 900, marginInline: "auto" }}>
          <table
            className="w-full"
            style={{
              borderCollapse: "separate",
              borderSpacing: 0,
              minWidth: 640,
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                <th className="text-start font-semibold" style={{ padding: "18px 20px", fontSize: 15, color: "var(--muted)" }}>
                  الميزة
                </th>
                <th
                  className="text-start"
                  style={{ padding: "18px 20px", color: "#fff", backgroundColor: "var(--btn-primary-bg)", fontSize: 16 }}
                >
                  حِرفة
                </th>
                <th className="text-start" style={{ padding: "18px 20px", color: "var(--muted)", fontSize: 16 }}>
                  منصات أخرى
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.feature}>
                  <td
                    className="font-semibold"
                    style={{ padding: "16px 20px", borderBlockStart: "1px solid var(--border)", color: "var(--ink)" }}
                  >
                    {row.feature}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      borderBlockStart: "1px solid var(--border)",
                      backgroundColor: "color-mix(in srgb, var(--btn-primary-bg) 5%, var(--surface))",
                    }}
                  >
                    <span className="inline-flex items-start gap-2" style={{ color: "var(--ink)", fontSize: 15 }}>
                      <Check className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} />
                      {row.herfa}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", borderBlockStart: "1px solid var(--border)" }}>
                    <span className="inline-flex items-start gap-2" style={{ color: "var(--muted)", fontSize: 15 }}>
                      <X className="h-4 w-4 shrink-0" style={{ color: "var(--alert)" }} />
                      {row.others}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
