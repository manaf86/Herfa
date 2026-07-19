"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  CATEGORY_LABELS,
  CATEGORY_SLUGS,
  type CategorySlug,
} from "@/lib/categories";

type Tier = "BASIC" | "STANDARD" | "PREMIUM";
type AiDisclosure = "HUMAN" | "AI_ASSISTED" | "AI_GENERATED";

type PackageDraft = {
  tier: Tier;
  title: string;
  description: string;
  priceSar: string;        // مُدخَل بالريال — نحوّله لـ priceMinor عند الإرسال
  deliveryDays: string;
  revisions: string;
  features: string[];
};

const AI_OPTIONS: { value: AiDisclosure; label: string; hint: string }[] = [
  {
    value: "HUMAN",
    label: "بشري بالكامل",
    hint: "أنجز العمل بنفسي دون توليد بذكاء اصطناعي.",
  },
  {
    value: "AI_ASSISTED",
    label: "بمساعدة الذكاء الاصطناعي",
    hint: "أستعين بـ AI في أجزاء لكنّي أُراجع وأُعدّل يدوياً.",
  },
  {
    value: "AI_GENERATED",
    label: "مولَّد بالذكاء الاصطناعي",
    hint: "المخرج الرئيسي أُنتج بـ AI مع تدخّل بشري خفيف.",
  },
];

function emptyPackage(tier: Tier): PackageDraft {
  return {
    tier,
    title: "",
    description: "",
    priceSar: "",
    deliveryDays: "",
    revisions: "0",
    features: [],
  };
}

export default function NewGigPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState<"draft" | "publish" | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // خطوة 1
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<CategorySlug | "">("");
  const [aiDisclosure, setAiDisclosure] = useState<AiDisclosure>("HUMAN");

  // خطوة 2
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");

  // خطوة 3
  const [packages, setPackages] = useState<PackageDraft[]>([
    emptyPackage("STANDARD"),
  ]);

  // ═══════════ التحقّق المحلّي قبل الإرسال ═══════════

  const step1Valid =
    title.trim().length >= 10 &&
    title.trim().length <= 100 &&
    categoryId !== "";

  const step2Valid =
    description.trim().length >= 50 && description.trim().length <= 2000;

  const step3Valid = useMemo(() => {
    if (packages.length < 1 || packages.length > 3) return false;
    return packages.every((p) => {
      const price = Number(p.priceSar);
      const days = Number(p.deliveryDays);
      const rev = Number(p.revisions);
      return (
        p.title.trim().length >= 3 &&
        p.description.trim().length >= 10 &&
        Number.isFinite(price) &&
        price > 0 &&
        Number.isFinite(days) &&
        days >= 1 &&
        days <= 90 &&
        Number.isFinite(rev) &&
        rev >= 0 &&
        rev <= 99
      );
    });
  }, [packages]);

  const canSubmit = step1Valid && step2Valid && step3Valid;

  // ═══════════ إرسال ═══════════

  const submit = async (thenPublish: boolean) => {
    if (!canSubmit) return;
    setErr(null);
    setSubmitting(thenPublish ? "publish" : "draft");

    try {
      const body = {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        tags,
        aiDisclosure,
        packages: packages.map((p) => ({
          tier: p.tier,
          title: p.title.trim(),
          description: p.description.trim(),
          priceMinor: Math.round(Number(p.priceSar) * 100),
          deliveryDays: Number(p.deliveryDays),
          revisions: Number(p.revisions),
          features: p.features.filter((f) => f.trim().length > 0),
        })),
      };

      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "same-origin",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "تعذّر إنشاء الخدمة");
      }

      const newSlug: string = data.gig?.slug;
      if (thenPublish && newSlug) {
        const pub = await fetch(`/api/gigs/${newSlug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PUBLISHED" }),
          credentials: "same-origin",
        });
        if (!pub.ok) {
          const pd = await pub.json().catch(() => ({}));
          throw new Error(pd.error ?? "أُنشئت الخدمة لكن تعذّر نشرها");
        }
      }

      router.push("/dashboard/gigs");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold sm:text-3xl"
            style={{ color: "var(--heading)" }}
          >
            خدمة جديدة
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: "var(--muted)" }}>
            ثلاث خطوات لتصبح خدمتك جاهزة.
          </p>
        </div>
        <Link
          href="/dashboard/gigs"
          className="inline-flex items-center gap-1 text-sm transition-colors hover:underline"
          style={{ color: "var(--muted)" }}
        >
          إلغاء
          <X className="h-4 w-4" />
        </Link>
      </div>

      {/* Progress */}
      <ProgressBar step={step} />

      {err && (
        <div
          role="alert"
          className="mb-4 mt-6 flex items-start gap-2 rounded-xl p-3 text-sm"
          style={{
            backgroundColor: "var(--alert-tint)",
            border: "1px solid var(--alert)",
            color: "var(--alert)",
          }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      <div
        className="mt-6 rounded-2xl p-6 sm:p-7"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {step === 1 && (
          <Step1
            title={title}
            setTitle={setTitle}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            aiDisclosure={aiDisclosure}
            setAiDisclosure={setAiDisclosure}
          />
        )}
        {step === 2 && (
          <Step2
            description={description}
            setDescription={setDescription}
            tags={tags}
            setTags={setTags}
            tagDraft={tagDraft}
            setTagDraft={setTagDraft}
          />
        )}
        {step === 3 && (
          <Step3 packages={packages} setPackages={setPackages} />
        )}
      </div>

      {/* Nav buttons */}
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
              style={{
                border: "1px solid var(--border)",
                color: "var(--ink)",
              }}
            >
              <ArrowRight className="h-4 w-4" />
              السابق
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {step < 3 && (
            <button
              type="button"
              disabled={
                (step === 1 && !step1Valid) || (step === 2 && !step2Valid)
              }
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              style={{
                backgroundColor: "var(--btn-primary-bg)",
                color: "var(--btn-primary-fg)",
              }}
            >
              التالي
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          {step === 3 && (
            <>
              <button
                type="button"
                disabled={!canSubmit || submitting !== null}
                onClick={() => submit(false)}
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--ink)",
                }}
              >
                {submitting === "draft" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                حفظ كمسودة
              </button>
              <button
                type="button"
                disabled={!canSubmit || submitting !== null}
                onClick={() => submit(true)}
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                style={{
                  backgroundColor: "var(--success)",
                  color: "#FFFFFF",
                }}
              >
                {submitting === "publish" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                نشر مباشرة
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════ Progress ═══════════

function ProgressBar({ step }: { step: number }) {
  const labels = ["المعلومات الأساسية", "الوصف", "الباقات"];
  return (
    <ol className="flex items-center gap-2">
      {labels.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums"
              style={{
                backgroundColor: done
                  ? "var(--success)"
                  : active
                  ? "var(--btn-primary-bg)"
                  : "var(--surface-2)",
                color:
                  done || active ? "#FFFFFF" : "var(--muted)",
              }}
            >
              {n}
            </span>
            <span
              className="hidden text-xs font-medium sm:inline"
              style={{
                color: active ? "var(--heading)" : "var(--muted)",
                fontWeight: active ? 700 : 500,
              }}
            >
              {label}
            </span>
            {i < labels.length - 1 && (
              <span
                className="h-0.5 flex-1 rounded-full"
                style={{
                  backgroundColor: done
                    ? "var(--success)"
                    : "var(--border)",
                }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ═══════════ Step 1 ═══════════

function Step1({
  title,
  setTitle,
  categoryId,
  setCategoryId,
  aiDisclosure,
  setAiDisclosure,
}: {
  title: string;
  setTitle: (v: string) => void;
  categoryId: CategorySlug | "";
  setCategoryId: (v: CategorySlug | "") => void;
  aiDisclosure: AiDisclosure;
  setAiDisclosure: (v: AiDisclosure) => void;
}) {
  const titleLen = title.trim().length;
  return (
    <div className="space-y-5">
      <FieldWrap label="عنوان الخدمة" hint={`${titleLen} / 100`}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="سأصمّم لك…"
          maxLength={100}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
          }}
        />
        {titleLen > 0 && titleLen < 10 && (
          <p className="mt-1 text-xs" style={{ color: "var(--alert)" }}>
            العنوان قصير جداً (10 أحرف على الأقل).
          </p>
        )}
      </FieldWrap>

      <FieldWrap label="الفئة">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value as CategorySlug | "")}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
          }}
        >
          <option value="">— اختر فئة —</option>
          {CATEGORY_SLUGS.map((s) => (
            <option key={s} value={s}>
              {CATEGORY_LABELS[s]}
            </option>
          ))}
        </select>
      </FieldWrap>

      <FieldWrap label="إفصاح الذكاء الاصطناعي">
        <div
          role="radiogroup"
          aria-label="إفصاح الذكاء الاصطناعي"
          className="space-y-2"
        >
          {AI_OPTIONS.map((o) => {
            const active = aiDisclosure === o.value;
            return (
              <label
                key={o.value}
                className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors"
                style={{
                  backgroundColor: active
                    ? "var(--accent-tint)"
                    : "var(--surface-2)",
                  border: `1px solid ${
                    active ? "var(--accent)" : "var(--border)"
                  }`,
                }}
              >
                <input
                  type="radio"
                  name="ai"
                  value={o.value}
                  checked={active}
                  onChange={() => setAiDisclosure(o.value)}
                  className="mt-1 accent-[var(--accent)]"
                />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--heading)" }}
                  >
                    {o.label}
                  </p>
                  <p
                    className="mt-0.5 text-xs leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {o.hint}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </FieldWrap>
    </div>
  );
}

// ═══════════ Step 2 ═══════════

function Step2({
  description,
  setDescription,
  tags,
  setTags,
  tagDraft,
  setTagDraft,
}: {
  description: string;
  setDescription: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  tagDraft: string;
  setTagDraft: (v: string) => void;
}) {
  const len = description.trim().length;
  const addTag = () => {
    const t = tagDraft.trim();
    if (!t) return;
    if (tags.length >= 5) return;
    if (tags.includes(t)) return;
    setTags([...tags, t]);
    setTagDraft("");
  };
  return (
    <div className="space-y-5">
      <FieldWrap
        label="وصف الخدمة"
        hint={`${len} / 2000${len < 50 ? " · الحد الأدنى 50" : ""}`}
      >
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="اشرح ما ستقدّمه، منهجك، الفروق التي تميّزك…"
          rows={8}
          maxLength={2000}
          className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
          }}
        />
      </FieldWrap>

      <FieldWrap label="الوسوم" hint={`${tags.length} / 5`}>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs"
              style={{
                backgroundColor: "var(--surface-2)",
                color: "var(--ink)",
                border: "1px solid var(--border)",
              }}
            >
              {t}
              <button
                type="button"
                onClick={() => setTags(tags.filter((x) => x !== t))}
                aria-label={`إزالة ${t}`}
                className="rounded-full hover:text-[var(--alert)]"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {tags.length < 5 && (
            <div className="flex gap-1.5">
              <input
                type="text"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="أضف وسماً"
                className="rounded-full px-3 py-1 text-xs outline-none"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--ink)",
                  border: "1px solid var(--border)",
                }}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagDraft.trim()}
                className="rounded-full px-2 py-1 text-xs font-bold transition-colors hover:bg-[var(--surface-2)] disabled:opacity-40"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--ink)",
                }}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </FieldWrap>
    </div>
  );
}

// ═══════════ Step 3 ═══════════

const TIER_LABEL: Record<Tier, string> = {
  BASIC: "الأساسية",
  STANDARD: "القياسية",
  PREMIUM: "الاحترافية",
};

function Step3({
  packages,
  setPackages,
}: {
  packages: PackageDraft[];
  setPackages: (v: PackageDraft[]) => void;
}) {
  const usedTiers = new Set(packages.map((p) => p.tier));
  const availableTiers: Tier[] = (["BASIC", "STANDARD", "PREMIUM"] as Tier[]).filter(
    (t) => !usedTiers.has(t),
  );

  const update = (i: number, patch: Partial<PackageDraft>) => {
    setPackages(packages.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  };

  return (
    <div className="space-y-5">
      {packages.map((p, i) => (
        <div
          key={p.tier}
          className="rounded-xl p-4"
          style={{
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#0E3A46",
                }}
              >
                {TIER_LABEL[p.tier]}
              </span>
            </div>
            {packages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setPackages(packages.filter((_, idx) => idx !== i))
                }
                className="inline-flex items-center gap-1 text-xs transition-colors hover:text-[var(--alert)]"
                style={{ color: "var(--muted)" }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                إزالة
              </button>
            )}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={p.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="عنوان الباقة"
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg)",
                color: "var(--ink)",
                border: "1px solid var(--border)",
              }}
            />
            <textarea
              value={p.description}
              onChange={(e) => update(i, { description: e.target.value })}
              placeholder="ماذا تحصل عليه في هذه الباقة؟"
              rows={2}
              className="w-full resize-y rounded-xl px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg)",
                color: "var(--ink)",
                border: "1px solid var(--border)",
              }}
            />
            <div className="grid grid-cols-3 gap-2">
              <NumberField
                label="السعر (ر.س)"
                value={p.priceSar}
                onChange={(v) => update(i, { priceSar: v })}
                min={1}
              />
              <NumberField
                label="أيام التسليم"
                value={p.deliveryDays}
                onChange={(v) => update(i, { deliveryDays: v })}
                min={1}
                max={90}
              />
              <NumberField
                label="التعديلات"
                value={p.revisions}
                onChange={(v) => update(i, { revisions: v })}
                min={0}
                max={99}
              />
            </div>
            <FeaturesEditor
              features={p.features}
              onChange={(features) => update(i, { features })}
            />
          </div>
        </div>
      ))}

      {availableTiers.length > 0 && packages.length < 3 && (
        <button
          type="button"
          onClick={() =>
            setPackages([...packages, emptyPackage(availableTiers[0])])
          }
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
          style={{
            border: "1px dashed var(--border)",
            color: "var(--ink)",
          }}
        >
          <Plus className="h-4 w-4" />
          أضف باقة {TIER_LABEL[availableTiers[0]]}
        </button>
      )}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span
        className="text-[11px] font-medium"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="mt-1 w-full rounded-xl px-3 py-2 text-sm tabular-nums outline-none"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--ink)",
          border: "1px solid var(--border)",
        }}
      />
    </label>
  );
}

function FeaturesEditor({
  features,
  onChange,
}: {
  features: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (!t || features.length >= 10 || features.includes(t)) return;
    onChange([...features, t]);
    setDraft("");
  };
  return (
    <div>
      <span
        className="text-[11px] font-medium"
        style={{ color: "var(--muted)" }}
      >
        الميزات ({features.length}/10)
      </span>
      <ul className="mt-1 space-y-1.5">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs"
            style={{
              backgroundColor: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--ink)",
            }}
          >
            {f}
            <button
              type="button"
              onClick={() => onChange(features.filter((x) => x !== f))}
              aria-label={`إزالة ${f}`}
              className="text-[var(--muted)] hover:text-[var(--alert)]"
            >
              <X className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ul>
      {features.length < 10 && (
        <div className="mt-1.5 flex gap-1.5">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="أضف ميزة"
            className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--ink)",
              border: "1px solid var(--border)",
            }}
          />
          <button
            type="button"
            onClick={add}
            disabled={!draft.trim()}
            className="rounded-lg px-3 text-xs font-bold transition-colors hover:bg-[var(--surface-2)] disabled:opacity-40"
            style={{
              border: "1px solid var(--border)",
              color: "var(--ink)",
            }}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function FieldWrap({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--ink)" }}
        >
          {label}
        </span>
        {hint && (
          <span
            className="text-xs tabular-nums"
            style={{ color: "var(--muted)" }}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
