import { ArrowLeft, FileText, CalendarClock, Users, PhoneCall, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

type Feat = { icon: LucideIcon; title: string; desc: string };

const FEATS: Feat[] = [
  { icon: FileText, title: "فواتير نظامية", desc: "فواتير ضريبية متوافقة تُصدر تلقائياً لكل عملية." },
  { icon: CalendarClock, title: "دفع آجل", desc: "شروط سداد حتى 60 يوماً للفرق المعتمدة." },
  { icon: Users, title: "فرق وصلاحيات", desc: "أدوار ومستويات موافقة تناسب هيكل فريقك." },
  { icon: PhoneCall, title: "مدير حساب", desc: "مدير مخصّص ودعم ذو أولوية على مدار الساعة." },
];

export default function ForBusiness() {
  return (
    <section
      id="business"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#0E3A46",
        color: "#EAF3F4",
        paddingBlock: "clamp(56px, 8vw, 96px)",
        paddingInline: 24,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 30%, rgba(212,162,76,0.25), transparent 40%), radial-gradient(circle at 10% 90%, rgba(212,162,76,0.15), transparent 40%)",
        }}
      />

      <div
        className="relative grid items-center"
        style={{ maxWidth: 1180, marginInline: "auto", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }}
      >
        <Reveal>
          <span
            className="inline-flex items-center gap-2 rounded-full text-xs"
            style={{ border: "1px solid rgba(212,162,76,0.5)", color: "#D4A24C", padding: "6px 14px" }}
          >
            حِرفة للشركات
          </span>
          <h2 className="font-bold" style={{ fontSize: "clamp(28px, 4vw, 42px)", margin: "18px 0 16px", color: "#fff", lineHeight: 1.2 }}>
            حلول التوظيف الحر لفرقك
          </h2>
          <p style={{ color: "rgba(234,243,244,0.75)", fontSize: 17, lineHeight: 1.7, margin: "0 0 26px" }}>
            أدوات مالية وإدارية مصمّمة للشركات التي توظّف محترفين مستقلين على نطاق واسع.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 rounded-xl font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#D4A24C", color: "#0E3A46", padding: "15px 28px", fontSize: 16 }}
          >
            تحدّث إلى المبيعات
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Reveal>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {FEATS.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 80} style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 18 }}>
                <span
                  className="grid place-items-center shrink-0"
                  style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(212,162,76,0.16)", color: "#D4A24C" }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="font-semibold" style={{ color: "#fff", margin: "12px 0 4px" }}>
                  {f.title}
                </div>
                <div style={{ color: "rgba(234,243,244,0.7)", fontSize: 14, lineHeight: 1.6 }}>
                  {f.desc}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
