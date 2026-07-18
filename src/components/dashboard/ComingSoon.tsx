import type { LucideIcon } from "lucide-react";

/**
 * مكوّن قسم مؤقّت داخل الداشبورد — يعرض عنوان القسم + "قريباً".
 * يُستخدم لكل الصفحات التي لم تُبنَ بعد.
 */
export default function ComingSoon({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: "var(--accent-tint)",
          color: "var(--accent)",
        }}
      >
        <Icon className="h-8 w-8" />
      </div>
      <h1
        className="text-3xl font-bold sm:text-4xl"
        style={{ color: "var(--heading)" }}
      >
        {title}
      </h1>
      <p
        className="mt-2 text-sm font-medium"
        style={{ color: "var(--accent)" }}
      >
        قريباً
      </p>
      {description && (
        <p
          className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base"
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
