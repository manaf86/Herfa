import {
  Palette,
  Code,
  Megaphone,
  Languages,
  Clapperboard,
  Music,
  Bot,
  Briefcase,
  Lightbulb,
  Database,
  Wallet,
  Camera,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

type Cat = { icon: LucideIcon; label: string; count: string };

const CATS: Cat[] = [
  { icon: Palette, label: "التصميم والجرافيك", count: "٢٠٣" },
  { icon: Code, label: "البرمجة والتقنية", count: "١٨٧" },
  { icon: Megaphone, label: "التسويق الرقمي", count: "١٥٦" },
  { icon: Languages, label: "الكتابة والترجمة", count: "١٤٢" },
  { icon: Clapperboard, label: "الفيديو والأنيميشن", count: "١١٨" },
  { icon: Music, label: "الموسيقى والصوتيات", count: "٨٤" },
  { icon: Bot, label: "خدمات الذكاء الاصطناعي", count: "٩٦" },
  { icon: Briefcase, label: "الأعمال", count: "١٣١" },
  { icon: Lightbulb, label: "الاستشارات", count: "٧٢" },
  { icon: Database, label: "البيانات", count: "٦٨" },
  { icon: Wallet, label: "التمويل", count: "٥٤" },
  { icon: Camera, label: "التصوير", count: "٩١" },
  { icon: Sparkles, label: "التطوير الشخصي", count: "٤٧" },
];

export default function Categories() {
  return (
    <section
      id="categories"
      className="py-20 sm:py-24"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">تصفّح المهارات</h2>
            <p
              className="mt-3 text-base"
              style={{ color: "var(--muted)" }}
            >
              ١٣ فئة تغطي أهم الخدمات الرقمية — من التصميم إلى الذكاء الاصطناعي.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {CATS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.label} delay={i * 40}>
                <button
                  type="button"
                  className="group flex h-full w-full flex-col items-start gap-3 rounded-2xl p-5 text-start transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors group-hover:scale-105"
                    style={{
                      backgroundColor: "rgba(212,162,76,0.12)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--heading)" }}
                    >
                      {c.label}
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      {c.count} محترف
                    </p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
