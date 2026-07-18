import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { label: "تصفّح المهارات", href: "#categories" },
  { label: "كيف يعمل", href: "#how" },
  { label: "لماذا حِرفة", href: "#why" },
  { label: "للشركات", href: "#business" },
];

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: "var(--header-bg)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold"
            style={{
              backgroundColor: "var(--accent)",
              color: "#0E3A46",
            }}
          >
            ح
          </span>
          <span className="text-xl font-bold tracking-tight">حِرفة</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:inline-flex"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--accent)",
              color: "#0E3A46",
            }}
          >
            انضم
          </Link>
        </div>
      </div>
    </header>
  );
}
