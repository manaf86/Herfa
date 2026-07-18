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
  { icon: Palette, label: "التصميم والجرافيك", count: "203" },
  { icon: Code, label: "البرمجة والتقنية", count: "187" },
  { icon: Megaphone, label: "التسويق الرقمي", count: "156" },
  { icon: Languages, label: "الكتابة والترجمة", count: "142" },
  { icon: Clapperboard, label: "الفيديو والأنيميشن", count: "118" },
  { icon: Music, label: "الموسيقى والصوتيات", count: "84" },
  { icon: Bot, label: "خدمات الذكاء الاصطناعي", count: "96" },
  { icon: Briefcase, label: "الأعمال", count: "131" },
  { icon: Lightbulb, label: "الاستشارات", count: "72" },
  { icon: Database, label: "البيانات", count: "68" },
  { icon: Wallet, label: "التمويل", count: "54" },
  { icon: Camera, label: "التصوير", count: "91" },
  { icon: Sparkles, label: "التطوير الشخصي", count: "47" },
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
              13 فئة تغطي أهم الخدمات الرقمية — من التصميم إلى الذكاء الاصطناعي.
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
