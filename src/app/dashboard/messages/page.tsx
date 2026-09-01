import { MessageSquare } from "lucide-react";

export default function MessagesIndexPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: "var(--accent-tint)",
          color: "var(--accent)",
        }}
      >
        <MessageSquare className="h-7 w-7" />
      </div>
      <h2 className="text-lg font-bold" style={{ color: "var(--heading)" }}>
        اختر محادثة للبدء
      </h2>
      <p
        className="max-w-sm text-sm leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        محادثاتك مع العملاء والمحترفين تظهر في القائمة. اختر واحدة لعرض الرسائل، أو
        ابدأ محادثة جديدة من زر "تواصل مع المحترف" في صفحة أي خدمة.
      </p>
    </div>
  );
}
