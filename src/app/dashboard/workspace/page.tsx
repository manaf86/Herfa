import { KanbanSquare } from "lucide-react";

export default function WorkspacePlaceholder() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: "var(--accent-tint)",
          color: "var(--accent)",
        }}
      >
        <KanbanSquare className="h-8 w-8" />
      </div>
      <h1
        className="text-3xl font-bold sm:text-4xl"
        style={{ color: "var(--heading)" }}
      >
        مساحة العمل — قريباً
      </h1>
      <p
        className="mt-3 max-w-xl text-sm leading-relaxed sm:text-base"
        style={{ color: "var(--muted)" }}
      >
        هنا ستجد كانبان المهام مع المعالم المالية المربوطة بالخزنة — ميزة حِرفة
        الحصرية التي تُفرج عن دفعتك تلقائياً عند اعتماد كل معلم.
      </p>
    </div>
  );
}
