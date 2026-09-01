import {
  Palette,
  Code,
  Megaphone,
  Languages,
  Clapperboard,
  Music,
  Sparkles,
  Briefcase,
  Lightbulb,
  BarChart3,
  Wallet,
  Camera,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

type Cat = { icon: LucideIcon; label: string; count: number };

const CATS: Cat[] = [
  { icon: Palette, label: "التصميم والجرافيك", count: 203 },
  { icon: Code, label: "البرمجة والتقنية", count: 187 },
  { icon: Megaphone, label: "التسويق الرقمي", count: 156 },
  { icon: Languages, label: "الكتابة والترجمة", count: 142 },
  { icon: Clapperboard, label: "الفيديو والأنيميشن", count: 98 },
  { icon: Music, label: "الموسيقى والصوتيات", count: 67 },
  { icon: Sparkles, label: "خدمات الذكاء الاصطناعي", count: 131 },
  { icon: Briefcase, label: "الأعمال", count: 78 },
  { icon: Lightbulb, label: "الاستشارات", count: 54 },
  { icon: BarChart3, label: "البيانات", count: 89 },
  { icon: Wallet, label: "التمويل", count: 42 },
  { icon: Camera, label: "التصوير", count: 72 },
  { icon: GraduationCap, label: "التطوير الشخصي", count: 61 },
];

export default function Categories() {
  return (
    <section
      id="skills"
      className="py-20 sm:py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">تصفّح المهارات</h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
              آلاف المحترفين المعتمدين عبر ثلاث عشرة فئة رئيسية.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {CATS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.label} delay={i * 40}>
                <a
                  href="/marketplace"
                  className="group flex h-full w-full flex-col items-start gap-3 rounded-2xl p-5 text-start transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors group-hover:scale-105"
                    style={{
                      backgroundColor: "rgba(212,162,76,0.14)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--ink)" }}>
                      {c.label}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      {c.count} محترفاً متاحاً
                    </p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
