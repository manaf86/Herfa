"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  KeyRound,
  Smartphone,
} from "lucide-react";

type Tab = "login" | "signup";
type Status =
  | "idle"
  | "loading"
  | "field-error"
  | "general-error"
  | "success"
  | "locked";

type FieldError = { field: "identifier" | "password"; message: string };

function validate(identifier: string, password: string): FieldError | null {
  const id = identifier.trim();
  if (!id) {
    return {
      field: "identifier",
      message: "يرجى إدخال البريد الإلكتروني أو رقم الجوال للمتابعة.",
    };
  }
  if (/^\d/.test(id) && !/^05\d{8}$/.test(id)) {
    return {
      field: "identifier",
      message: "رقم الجوال يبدأ بـ 05 ويتكوّن من ١٠ أرقام. جرّب مرة أخرى.",
    };
  }
  if (!password) {
    return {
      field: "password",
      message: "يرجى إدخال كلمة المرور للمتابعة.",
    };
  }
  return null;
}

function scorePassword(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
  if (/\d/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  if (pw.length < 6) s = Math.min(s, 1);
  return Math.min(s, 4);
}

const STRENGTH = [
  { label: "ضعيفة جداً", color: "#B42318" },
  { label: "ضعيفة", color: "#B42318" },
  { label: "متوسطة", color: "#E19023" },
  { label: "جيدة", color: "#D4A24C" },
  { label: "قوية", color: "#1B7F5A" },
];

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.63-.07-1.1-.16-1.6H12z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M16.365 12.727c-.02-2.06 1.69-3.06 1.77-3.11-.96-1.4-2.46-1.6-3-1.62-1.28-.13-2.5.75-3.15.75-.65 0-1.66-.73-2.72-.71-1.4.02-2.69.81-3.4 2.06-1.45 2.52-.37 6.24 1.04 8.29.7.99 1.52 2.11 2.59 2.07 1.04-.04 1.44-.67 2.7-.67 1.25 0 1.61.67 2.71.65 1.12-.02 1.83-1.01 2.51-2 .8-1.15 1.13-2.27 1.15-2.33-.03-.01-2.2-.85-2.2-3.38zM14.29 6.5c.57-.69.96-1.66.85-2.62-.83.03-1.83.55-2.42 1.24-.53.61-.99 1.58-.86 2.53.92.07 1.86-.47 2.43-1.15z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<FieldError | null>(null);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const isSignup = tab === "signup";
  const pwScore = useMemo(() => scorePassword(password), [password]);
  const strength = STRENGTH[pwScore];

  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => router.push("/marketplace"), 2000);
    return () => clearTimeout(t);
  }, [status, router]);

  // اقفل تمرير الصفحة كاملةً طوال بقاء صفحة الدخول ظاهرة
  // (يمنع body.min-h-screen في التخطيط الجذري من إظهار شريط تمرير).
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyMinH: body.style.minHeight,
      bodyH: body.style.height,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.minHeight = "0";
    body.style.height = "100dvh";
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.minHeight = prev.bodyMinH;
      body.style.height = prev.bodyH;
    };
  }, []);

  const switchTab = (next: Tab) => {
    setTab(next);
    setStatus("idle");
    setFieldError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: استبدل هذه المحاكاة بمصادقة حقيقية في المرحلة الثانية.
    // المطلوب لاحقاً: استدعاء API المصادقة، ثم عيّن status وفقاً للنتيجة:
    //   - نجاح المصادقة              → setStatus("success")
    //   - بيانات دخول خاطئة/الحقول   → setStatus("field-error") + setFieldError({...})
    //   - فشل شبكة/خادم              → setStatus("general-error")
    //   - تجاوز المحاولات المسموحة    → setStatus("locked")

    const err = validate(identifier, password);
    if (err) {
      setFieldError(err);
      setStatus("field-error");
      return;
    }

    setFieldError(null);
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  const isLoading = status === "loading";
  const showGeneralError = status === "general-error";
  const showSuccess = status === "success";
  const showLocked = status === "locked";
  const identifierError =
    status === "field-error" && fieldError?.field === "identifier";
  const passwordError =
    status === "field-error" && fieldError?.field === "password";

  return (
    <div
      className="overflow-hidden"
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        backgroundColor: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      <div className="flex h-full w-full flex-wrap overflow-hidden">
        {/* Right column — form */}
        <section
          className="h-full w-full overflow-y-auto overflow-x-hidden lg:w-1/2"
          style={{ backgroundColor: "var(--bg)" }}
        >
          <div className="flex min-h-full w-full flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-[440px]">
            {/* Logo + back link */}
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "#0E3A46",
                  }}
                >
                  ح
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: "var(--heading)" }}
                >
                  حِرفة
                </span>
              </Link>
              <Link
                href="/"
                className="text-xs transition-colors hover:underline"
                style={{ color: "var(--muted)" }}
              >
                عودة للرئيسية
              </Link>
            </div>

            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {/* General banners */}
              {showGeneralError && (
                <Banner
                  variant="alert"
                  icon={<AlertCircle className="h-4 w-4" />}
                >
                  تعذّر تسجيل الدخول. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.
                </Banner>
              )}
              {showLocked && (
                <Banner
                  variant="warn"
                  icon={<Lock className="h-4 w-4" />}
                >
                  أُقفل حسابك مؤقتاً بعد عدة محاولات فاشلة. جرّب بعد ١٥ دقيقة،{" "}
                  <a href="#" className="font-bold underline">
                    أو أعد تعيين كلمة المرور الآن.
                  </a>
                </Banner>
              )}
              {showSuccess && (
                <Banner
                  variant="success"
                  icon={<CheckCircle2 className="h-4 w-4" />}
                >
                  تم تسجيل الدخول. نحوّلك إلى السوق الآن…
                </Banner>
              )}

              {/* Tabs */}
              <div
                role="tablist"
                aria-label="نوع الإجراء"
                className="mb-6 grid grid-cols-2 gap-1 rounded-full p-1"
                style={{ backgroundColor: "var(--surface-2)" }}
              >
                <TabBtn
                  active={tab === "login"}
                  onClick={() => switchTab("login")}
                  id="tab-login"
                  panel="panel-form"
                >
                  دخول
                </TabBtn>
                <TabBtn
                  active={tab === "signup"}
                  onClick={() => switchTab("signup")}
                  id="tab-signup"
                  panel="panel-form"
                >
                  إنشاء حساب
                </TabBtn>
              </div>

              {/* Title + description */}
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--heading)" }}
              >
                {isSignup ? "إنشاء حساب جديد" : "تسجيل الدخول"}
              </h1>
              <p
                className="mt-1.5 text-sm"
                style={{ color: "var(--muted)" }}
              >
                {isSignup
                  ? "انضم إلى حِرفة. حساب واحد يكفيك."
                  : "أهلاً بعودتك. سجّل دخولك للمتابعة."}
              </p>

              {/* Form */}
              <form
                id="panel-form"
                role="tabpanel"
                aria-labelledby={isSignup ? "tab-signup" : "tab-login"}
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
                noValidate
              >
                {/* Identifier */}
                <Field
                  id="identifier"
                  label="البريد الإلكتروني أو رقم الجوال"
                  error={
                    identifierError ? fieldError?.message : undefined
                  }
                >
                  <input
                    id="identifier"
                    type="text"
                    inputMode="email"
                    dir="ltr"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (identifierError) {
                        setFieldError(null);
                        setStatus("idle");
                      }
                    }}
                    aria-invalid={identifierError}
                    aria-describedby={
                      identifierError ? "identifier-error" : undefined
                    }
                    placeholder="you@example.com  أو  05xxxxxxxx"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--bg)",
                      color: "var(--ink)",
                      border: `1px solid ${
                        identifierError ? "var(--alert)" : "var(--border)"
                      }`,
                    }}
                  />
                </Field>

                {/* Password */}
                <Field
                  id="password"
                  label="كلمة المرور"
                  error={passwordError ? fieldError?.message : undefined}
                  rightSlot={
                    !isSignup && (
                      <a
                        href="#"
                        className="text-xs font-medium transition-colors hover:underline"
                        style={{ color: "var(--heading)" }}
                      >
                        نسيت كلمة المرور؟
                      </a>
                    )
                  }
                >
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      dir="ltr"
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) {
                          setFieldError(null);
                          setStatus("idle");
                        }
                      }}
                      aria-invalid={passwordError}
                      aria-describedby={
                        passwordError ? "password-error" : undefined
                      }
                      placeholder={isSignup ? "٨ أحرف على الأقل" : "••••••••"}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={{
                        backgroundColor: "var(--bg)",
                        color: "var(--ink)",
                        border: `1px solid ${
                          passwordError ? "var(--alert)" : "var(--border)"
                        }`,
                        paddingInlineEnd: "3rem",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={
                        showPw ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                      }
                      aria-pressed={showPw}
                      className="absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
                      style={{
                        insetInlineEnd: "0.4rem",
                        color: "var(--muted)",
                      }}
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {isSignup && (
                    <StrengthMeter score={pwScore} label={strength.label} />
                  )}
                </Field>

                {/* Primary button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  style={{
                    backgroundColor: "var(--btn-primary-bg)",
                    color: "var(--btn-primary-fg)",
                  }}
                >
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  )}
                  {isLoading
                    ? "جارٍ المتابعة…"
                    : isSignup
                    ? "إنشاء حساب"
                    : "دخول"}
                </button>
              </form>

              {/* Divider */}
              <div
                className="my-6 flex items-center gap-3 text-xs"
                style={{ color: "var(--muted)" }}
              >
                <span
                  className="h-px flex-1"
                  style={{ backgroundColor: "var(--border)" }}
                />
                أو
                <span
                  className="h-px flex-1"
                  style={{ backgroundColor: "var(--border)" }}
                />
              </div>

              {/* SSO */}
              <div className="space-y-2">
                <SsoBtn onClick={() => {}} icon={<GoogleIcon className="h-4 w-4" />}>
                  المتابعة عبر Google
                </SsoBtn>
                <SsoBtn onClick={() => {}} icon={<AppleIcon className="h-4 w-4" />}>
                  المتابعة عبر Apple
                </SsoBtn>
                <SsoBtn
                  onClick={() => {}}
                  icon={
                    <KeyRound
                      className="h-4 w-4"
                      style={{ color: "var(--heading)" }}
                    />
                  }
                >
                  الدخول عبر النفاذ الوطني الموحّد
                </SsoBtn>
                <SsoBtn
                  onClick={() => {}}
                  icon={
                    <Smartphone
                      className="h-4 w-4"
                      style={{ color: "var(--heading)" }}
                    />
                  }
                >
                  أرسل رمزاً لمرة واحدة على جوالي
                </SsoBtn>
              </div>

              {/* Notes */}
              <p
                className="mt-6 text-xs leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                لا نسألك: مشترٍ أم بائع؟ حساب واحد يكفي.
              </p>

              <div className="mt-3">
                <Link
                  href="/#categories"
                  className="text-sm font-medium transition-colors hover:underline"
                  style={{ color: "var(--heading)" }}
                >
                  تصفّح المواهب كضيف ←
                </Link>
              </div>
            </div>

            {/* 2FA badge */}
            <div
              className="mt-4 flex items-center justify-center gap-2 text-xs"
              style={{ color: "var(--muted)" }}
            >
              <ShieldCheck
                className="h-4 w-4"
                style={{ color: "var(--success)" }}
              />
              محمي بمصادقة ثنائية
            </div>
          </div>
          </div>
        </section>

        {/* Left column — visual */}
        <aside
          className="relative hidden overflow-hidden lg:flex lg:h-full lg:w-1/2 lg:flex-col lg:justify-between lg:p-12"
          style={{ backgroundColor: "#0E3A46", color: "#FFFFFF" }}
          aria-hidden
        >
          {/* Geometric ornament */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]"
            viewBox="0 0 400 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="herfa-pattern"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0 L80 40 L40 80 L0 40 Z"
                  fill="none"
                  stroke="#D4A24C"
                  strokeWidth="1"
                />
                <circle cx="40" cy="40" r="6" fill="#D4A24C" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#herfa-pattern)" />
          </svg>

          {/* Top: logo */}
          <div className="relative flex items-center gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold"
              style={{ backgroundColor: "#D4A24C", color: "#0E3A46" }}
            >
              ح
            </span>
            <span className="text-xl font-bold">حِرفة</span>
          </div>

          {/* Middle: quote */}
          <div className="relative">
            <p
              className="text-3xl font-bold leading-snug"
              style={{ color: "#D4A24C" }}
            >
              &ldquo;حِرفة غيّرت طريقة عملي&rdquo;
            </p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/85">
              أول منصة أشعر فيها أن القواعد في صالحي، لا ضدّي.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full text-base font-bold"
                style={{
                  backgroundColor: "rgba(212,162,76,0.18)",
                  color: "#D4A24C",
                }}
              >
                ع
              </div>
              <div>
                <p className="text-sm font-bold">عمر الشمري</p>
                <p className="text-xs text-white/70">
                  مطوّر تطبيقات · الرياض
                </p>
              </div>
            </div>
          </div>

          {/* Bottom: stat */}
          <div
            className="relative rounded-2xl p-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <p
              className="text-3xl font-bold"
              style={{ color: "#D4A24C" }}
            >
              ٤٫٢ مليون ريال
            </p>
            <p className="mt-2 text-sm text-white/80">
              صُرفت للمحترفين على حِرفة هذا الشهر.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------- Helpers ------- */

function TabBtn({
  active,
  onClick,
  children,
  id,
  panel,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  id: string;
  panel: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      aria-controls={panel}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className="rounded-full py-2 text-sm font-medium transition-all"
      style={{
        backgroundColor: active ? "var(--surface)" : "transparent",
        color: active ? "var(--heading)" : "var(--muted)",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        fontWeight: active ? 700 : 500,
      }}
    >
      {children}
    </button>
  );
}

function Field({
  id,
  label,
  children,
  error,
  rightSlot,
}: {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  rightSlot?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium"
          style={{ color: "var(--ink)" }}
        >
          {label}
        </label>
        {rightSlot}
      </div>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs"
          style={{ color: "var(--alert)" }}
        >
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

function Banner({
  variant,
  icon,
  children,
}: {
  variant: "alert" | "success" | "warn";
  icon: ReactNode;
  children: ReactNode;
}) {
  const { bg, fg } =
    variant === "alert"
      ? { bg: "var(--alert-tint)", fg: "var(--alert)" }
      : variant === "success"
      ? { bg: "var(--success-tint)", fg: "var(--success)" }
      : { bg: "var(--warn-tint)", fg: "var(--warn)" };
  return (
    <div
      role={variant === "success" ? "status" : "alert"}
      className="mb-5 flex items-start gap-2 rounded-xl p-3 text-sm"
      style={{
        backgroundColor: bg,
        color: fg,
        border: `1px solid ${fg}`,
      }}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

function SsoBtn({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
      style={{
        backgroundColor: "var(--surface)",
        color: "var(--ink)",
        border: "1px solid var(--border)",
      }}
    >
      <span className="shrink-0">{icon}</span>
      {children}
    </button>
  );
}

function StrengthMeter({ score, label }: { score: number; label: string }) {
  const color = STRENGTH[score].color;
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor:
                i < score ? color : "var(--surface-2)",
            }}
          />
        ))}
      </div>
      <p
        className="mt-1.5 text-xs"
        style={{ color: score >= 1 ? color : "var(--muted)" }}
      >
        قوة كلمة المرور: {label}
      </p>
    </div>
  );
}
