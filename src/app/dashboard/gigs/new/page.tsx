"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  X,
  UploadCloud,
  ImageIcon,
  Palette,
  Code2,
  Megaphone,
  PenLine,
  Video,
  Music,
  Sparkles,
  Briefcase,
  Users,
  Database,
  Wallet,
  Camera,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import {
  CATEGORY_LABELS,
  CATEGORY_SLUGS,
  type CategorySlug,
} from "@/lib/categories";
import { SERVICE_TYPES } from "@/lib/serviceTypes";

type Tier = "BASIC" | "STANDARD" | "PREMIUM";
type Faq = { question: string; answer: string };

type PackageDraft = {
  tier: Tier;
  title: string;
  description: string;
  priceSar: string; // مُدخَل بالريال — نحوّله لـ priceMinor عند الإرسال
  deliveryDays: string;
  revisions: string;
  features: string[];
};

const TOTAL_STEPS = 5;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 ميجابايت لكل صورة (مؤقتاً — Base64)

const CATEGORY_ICONS: Record<CategorySlug, LucideIcon> = {
  design: Palette,
  programming: Code2,
  marketing: Megaphone,
  writing: PenLine,
  video: Video,
  music: Music,
  ai: Sparkles,
  business: Briefcase,
  consulting: Users,
  data: Database,
  finance: Wallet,
  photo: Camera,
  personal: GraduationCap,
};

const TIER_LABEL: Record<Tier, string> = {
  BASIC: "الأساسية",
  STANDARD: "القياسية",
  PREMIUM: "الاحترافية",
};

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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("تعذّرت قراءة الملف"));
    reader.readAsDataURL(file);
  });
}

export default function NewGigWizardPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[] | null>(null);
  const [done, setDone] = useState(false);

  // ─── خطوة 1: نوع الخدمة ───
  const [categoryId, setCategoryId] = useState<CategorySlug | "">("");
  const [serviceType, setServiceType] = useState("");

  // ─── خطوة 2: المعلومات والصور ───
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [imgErr, setImgErr] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ─── خطوة 3: الوصف الدقيق ───
  const [description, setDescription] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [deliverableDraft, setDeliverableDraft] = useState("");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [requirements, setRequirements] = useState("");

  // ─── خطوة 4: الباقات ───
  const [packages, setPackages] = useState<PackageDraft[]>([
    emptyPackage("STANDARD"),
  ]);

  // ═══════════ التحقّق المحلّي لكل خطوة ═══════════

  const step1Valid = categoryId !== "" && serviceType !== "";
  const step2Valid =
    title.trim().length >= 15 &&
    title.trim().length <= 80 &&
    coverImage !== null;
  const step3Valid =
    description.trim().length >= 50 && description.trim().length <= 1200;
  const step4Valid = useMemo(() => {
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

  const stepValid: Record<number, boolean> = {
    1: step1Valid,
    2: step2Valid,
    3: step3Valid,
    4: step4Valid,
    5: true,
  };
  const canGoNext = stepValid[step] ?? false;
  const canSubmit = step1Valid && step2Valid && step3Valid && step4Valid;

  const goNext = () => {
    if (!canGoNext) return;
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  // ═══════════ رفع الصور (Base64 مؤقتاً) ═══════════
  // TODO: رفع حقيقي إلى S3/MinIO عند تجهيز التخزين — حالياً نخزّن data URLs مباشرة.

  const onCoverFile = async (file: File | undefined) => {
    if (!file) return;
    setImgErr(null);
    if (!file.type.startsWith("image/")) {
      setImgErr("الملف المختار ليس صورة.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImgErr("حجم صورة الغلاف يتجاوز 2 ميجابايت.");
      return;
    }
    try {
      setCoverImage(await fileToDataUrl(file));
    } catch {
      setImgErr("تعذّر قراءة الصورة. جرّب ملفاً آخر.");
    }
  };

  const onGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImgErr(null);
    const remaining = 5 - gallery.length;
    const picked = Array.from(files).slice(0, remaining);
    for (const f of picked) {
      if (!f.type.startsWith("image/")) {
        setImgErr("أحد الملفات المختارة ليس صورة.");
        continue;
      }
      if (f.size > MAX_IMAGE_BYTES) {
        setImgErr("إحدى صور المعرض تتجاوز 2 ميجابايت.");
        continue;
      }
      try {
        const dataUrl = await fileToDataUrl(f);
        setGallery((g) => (g.length < 5 ? [...g, dataUrl] : g));
      } catch {
        setImgErr("تعذّر قراءة إحدى الصور.");
      }
    }
  };

  // ═══════════ الإرسال النهائي ═══════════

  const submitForReview = async () => {
    if (!canSubmit || submitting) return;
    setErr(null);
    setMissing(null);
    setSubmitting(true);
    try {
      const body = {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        serviceType,
        tags,
        coverImage: coverImage ?? undefined,
        gallery,
        deliverables,
        faqs,
        requirements: requirements.trim() || undefined,
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

      const createRes = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "same-origin",
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        throw new Error(createData.error ?? "تعذّر إنشاء الخدمة");
      }

      const slug: string = createData.gig.slug;
      const submitRes = await fetch(`/api/gigs/${slug}/submit`, {
        method: "PATCH",
        credentials: "same-origin",
      });
      const submitData = await submitRes.json().catch(() => ({}));
      if (!submitRes.ok) {
        if (Array.isArray(submitData.missing)) {
          setMissing(submitData.missing);
        }
        throw new Error(submitData.error ?? "أُنشئت الخدمة لكن تعذّر إرسالها للمراجعة");
      }

      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ غير متوقّع");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: "var(--success-tint)",
            color: "var(--success)",
          }}
        >
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--heading)" }}>
          تم إرسال خدمتك للمراجعة ✓
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          سيراجع فريقنا خدمتك عادةً خلال 24 ساعة. ستصلك رسالة عند اعتمادها أو إن
          احتجنا تعديلاً منك.
        </p>
        <Link
          href="/dashboard/gigs"
          className="mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--btn-primary-bg)",
            color: "var(--btn-primary-fg)",
          }}
        >
          الذهاب إلى خدماتي
        </Link>
      </div>
    );
  }

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
            خمس خطوات وتصبح خدمتك جاهزة للمراجعة.
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
          <div>
            <span>{err}</span>
            {missing && missing.length > 0 && (
              <ul className="mt-1.5 list-inside list-disc space-y-0.5">
                {missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            )}
          </div>
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
            categoryId={categoryId}
            setCategoryId={(v) => {
              setCategoryId(v);
              setServiceType("");
            }}
            serviceType={serviceType}
            setServiceType={setServiceType}
          />
        )}
        {step === 2 && (
          <Step2
            title={title}
            setTitle={setTitle}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            gallery={gallery}
            setGallery={setGallery}
            tags={tags}
            setTags={setTags}
            tagDraft={tagDraft}
            setTagDraft={setTagDraft}
            imgErr={imgErr}
            dragOver={dragOver}
            setDragOver={setDragOver}
            coverInputRef={coverInputRef}
            galleryInputRef={galleryInputRef}
            onCoverFile={onCoverFile}
            onGalleryFiles={onGalleryFiles}
          />
        )}
        {step === 3 && (
          <Step3
            description={description}
            setDescription={setDescription}
            deliverables={deliverables}
            setDeliverables={setDeliverables}
            deliverableDraft={deliverableDraft}
            setDeliverableDraft={setDeliverableDraft}
            faqs={faqs}
            setFaqs={setFaqs}
            requirements={requirements}
            setRequirements={setRequirements}
          />
        )}
        {step === 4 && <Step4 packages={packages} setPackages={setPackages} />}
        {step === 5 && (
          <Step5
            categoryId={categoryId}
            serviceType={serviceType}
            title={title}
            coverImage={coverImage}
            gallery={gallery}
            tags={tags}
            description={description}
            deliverables={deliverables}
            faqs={faqs}
            requirements={requirements}
            packages={packages}
          />
        )}
      </div>

      {/* Nav buttons */}
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={goPrev}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-2)] disabled:opacity-60"
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
          {step < TOTAL_STEPS && (
            <button
              type="button"
              disabled={!canGoNext}
              onClick={goNext}
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
          {step === TOTAL_STEPS && (
            <button
              type="button"
              disabled={!canSubmit || submitting}
              onClick={submitForReview}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              style={{
                backgroundColor: "var(--success)",
                color: "#FFFFFF",
              }}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              أرسل للمراجعة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════ شريط التقدّم ═══════════

function ProgressBar({ step }: { step: number }) {
  const labels = ["نوع الخدمة", "المعلومات والصور", "الوصف الدقيق", "الباقات", "المراجعة"];
  return (
    <div>
      <p
        className="mb-2 text-xs font-bold tabular-nums"
        style={{ color: "var(--accent)" }}
      >
        الخطوة {step} من {TOTAL_STEPS}
      </p>
      <ol className="flex items-center gap-2">
        {labels.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const stepDone = step > n;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums transition-colors"
                style={{
                  backgroundColor: stepDone
                    ? "var(--success)"
                    : active
                    ? "var(--btn-primary-bg)"
                    : "var(--surface-2)",
                  color: stepDone || active ? "#FFFFFF" : "var(--muted)",
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
                  className="h-0.5 flex-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: stepDone ? "var(--success)" : "var(--border)",
                  }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ═══════════ خطوة 1: نوع الخدمة ═══════════

function Step1({
  categoryId,
  setCategoryId,
  serviceType,
  setServiceType,
}: {
  categoryId: CategorySlug | "";
  setCategoryId: (v: CategorySlug | "") => void;
  serviceType: string;
  setServiceType: (v: string) => void;
}) {
  const subtypes = categoryId ? SERVICE_TYPES[categoryId] : [];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--heading)" }}>
          ما نوع خدمتك؟
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          اختر الفئة الأقرب لما تقدّمه.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORY_SLUGS.map((slug) => {
          const Icon = CATEGORY_ICONS[slug];
          const active = categoryId === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => setCategoryId(slug)}
              className="flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: active ? "var(--accent-tint)" : "var(--surface-2)",
                border: `1.5px solid ${active ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: active ? "var(--accent)" : "var(--surface)",
                  color: active ? "#0E3A46" : "var(--muted)",
                }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className="text-xs font-bold leading-snug"
                style={{ color: active ? "var(--heading)" : "var(--ink)" }}
              >
                {CATEGORY_LABELS[slug]}
              </span>
            </button>
          );
        })}
      </div>

      {categoryId && (
        <FieldWrap label="النوع الفرعي">
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--ink)",
              border: "1px solid var(--border)",
            }}
          >
            <option value="">— اختر النوع الفرعي —</option>
            {subtypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </FieldWrap>
      )}
    </div>
  );
}

// ═══════════ خطوة 2: المعلومات والصور ═══════════

function Step2({
  title,
  setTitle,
  coverImage,
  setCoverImage,
  gallery,
  setGallery,
  tags,
  setTags,
  tagDraft,
  setTagDraft,
  imgErr,
  dragOver,
  setDragOver,
  coverInputRef,
  galleryInputRef,
  onCoverFile,
  onGalleryFiles,
}: {
  title: string;
  setTitle: (v: string) => void;
  coverImage: string | null;
  setCoverImage: (v: string | null) => void;
  gallery: string[];
  setGallery: (v: string[]) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  tagDraft: string;
  setTagDraft: (v: string) => void;
  imgErr: string | null;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  galleryInputRef: React.RefObject<HTMLInputElement | null>;
  onCoverFile: (f: File | undefined) => void;
  onGalleryFiles: (f: FileList | null) => void;
}) {
  const titleLen = title.trim().length;
  const addTag = () => {
    const t = tagDraft.trim();
    if (!t || tags.length >= 5 || tags.includes(t)) return;
    setTags([...tags, t]);
    setTagDraft("");
  };

  return (
    <div className="space-y-6">
      <FieldWrap label="عنوان الخدمة" hint={`${titleLen} / 80`}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="سأصمّم لك…"
          maxLength={80}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
          }}
        />
        {titleLen > 0 && titleLen < 15 && (
          <p className="mt-1 text-xs" style={{ color: "var(--alert)" }}>
            العنوان قصير جداً (15 حرفاً على الأقل).
          </p>
        )}
      </FieldWrap>

      <FieldWrap label="صورة الغلاف">
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onCoverFile(e.target.files?.[0])}
        />
        {coverImage ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="معاينة صورة الغلاف"
              className="aspect-[16/9] w-full rounded-2xl object-cover"
            />
            <button
              type="button"
              onClick={() => setCoverImage(null)}
              aria-label="إزالة صورة الغلاف"
              className="absolute flex h-8 w-8 items-center justify-center rounded-full text-white"
              style={{ insetBlockStart: "0.5rem", insetInlineEnd: "0.5rem", backgroundColor: "rgba(0,0,0,0.55)" }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => coverInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && coverInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              onCoverFile(e.dataTransfer.files?.[0]);
            }}
            className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl text-center transition-colors"
            style={{
              border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
              backgroundColor: dragOver ? "var(--accent-tint)" : "var(--surface-2)",
            }}
          >
            <UploadCloud className="h-8 w-8" style={{ color: "var(--muted)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              اسحب صورة الغلاف هنا أو اضغط للاختيار
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              JPG أو PNG أو WEBP — حتى 2 ميجابايت
            </p>
          </div>
        )}
      </FieldWrap>

      <FieldWrap label="معرض الصور" hint={`${gallery.length} / 5`}>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            onGalleryFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {gallery.map((src, i) => (
            <div key={i} className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`صورة معرض ${i + 1}`}
                className="h-full w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                aria-label={`حذف صورة ${i + 1}`}
                className="absolute flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ insetBlockStart: "0.25rem", insetInlineEnd: "0.25rem", backgroundColor: "rgba(0,0,0,0.55)" }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {gallery.length < 5 && (
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl transition-colors hover:bg-[var(--surface-2)]"
              style={{ border: "1.5px dashed var(--border)", color: "var(--muted)" }}
            >
              <ImageIcon className="h-5 w-5" />
              <span className="text-[10px] font-medium">إضافة</span>
            </button>
          )}
        </div>
      </FieldWrap>

      {imgErr && (
        <p className="flex items-center gap-1.5 text-xs" style={{ color: "var(--alert)" }}>
          <AlertCircle className="h-3.5 w-3.5" />
          {imgErr}
        </p>
      )}

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
                style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
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

// ═══════════ خطوة 3: الوصف الدقيق ═══════════

function Step3({
  description,
  setDescription,
  deliverables,
  setDeliverables,
  deliverableDraft,
  setDeliverableDraft,
  faqs,
  setFaqs,
  requirements,
  setRequirements,
}: {
  description: string;
  setDescription: (v: string) => void;
  deliverables: string[];
  setDeliverables: (v: string[]) => void;
  deliverableDraft: string;
  setDeliverableDraft: (v: string) => void;
  faqs: Faq[];
  setFaqs: (v: Faq[]) => void;
  requirements: string;
  setRequirements: (v: string) => void;
}) {
  const len = description.trim().length;
  const addDeliverable = () => {
    const t = deliverableDraft.trim();
    if (!t || deliverables.length >= 20) return;
    setDeliverables([...deliverables, t]);
    setDeliverableDraft("");
  };

  return (
    <div className="space-y-6">
      <FieldWrap
        label="صف خدمتك بدقة"
        hint={`${len} / 1200${len < 50 ? " · الحد الأدنى 50" : ""}`}
      >
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="اشرح ما ستقدّمه، منهجك، والفروق التي تميّزك…"
          rows={7}
          maxLength={1200}
          className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
          }}
        />
      </FieldWrap>

      <FieldWrap label="ماذا تقدّم بالضبط؟" hint={`${deliverables.length} / 20`}>
        <ul className="mb-2 space-y-1.5">
          {deliverables.map((d, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs"
              style={{
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--ink)",
              }}
            >
              {d}
              <button
                type="button"
                onClick={() => setDeliverables(deliverables.filter((_, idx) => idx !== i))}
                aria-label={`إزالة ${d}`}
                className="text-[var(--muted)] hover:text-[var(--alert)]"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
        {deliverables.length < 20 && (
          <div className="flex gap-1.5">
            <input
              type="text"
              value={deliverableDraft}
              onChange={(e) => setDeliverableDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDeliverable();
                }
              }}
              placeholder="مثال: 3 مفاهيم تصميم أولية"
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg)",
                color: "var(--ink)",
                border: "1px solid var(--border)",
              }}
            />
            <button
              type="button"
              onClick={addDeliverable}
              disabled={!deliverableDraft.trim()}
              className="rounded-lg px-3 text-xs font-bold transition-colors hover:bg-[var(--surface-2)] disabled:opacity-40"
              style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </FieldWrap>

      <FieldWrap label="الأسئلة الشائعة" hint={`${faqs.length} / 5`}>
        <FaqEditor faqs={faqs} setFaqs={setFaqs} />
      </FieldWrap>

      <FieldWrap label="متطلبات من المشتري">
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="ما الذي تحتاجه من المشتري لتبدأ العمل؟ (شعارات، مراجع، نصوص…)"
          rows={4}
          maxLength={2000}
          className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
          }}
        />
      </FieldWrap>
    </div>
  );
}

function FaqEditor({ faqs, setFaqs }: { faqs: Faq[]; setFaqs: (v: Faq[]) => void }) {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const add = () => {
    if (!q.trim() || !a.trim() || faqs.length >= 5) return;
    setFaqs([...faqs, { question: q.trim(), answer: a.trim() }]);
    setQ("");
    setA("");
  };
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div
          key={i}
          className="rounded-xl p-3"
          style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold" style={{ color: "var(--heading)" }}>
              {f.question}
            </p>
            <button
              type="button"
              onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
              aria-label="إزالة السؤال"
              className="shrink-0 text-[var(--muted)] hover:text-[var(--alert)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            {f.answer}
          </p>
        </div>
      ))}
      {faqs.length < 5 && (
        <div
          className="space-y-2 rounded-xl p-3"
          style={{ border: "1px dashed var(--border)" }}
        >
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="السؤال"
            maxLength={200}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--border)" }}
          />
          <textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="الجواب"
            rows={2}
            maxLength={1000}
            className="w-full resize-y rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--border)" }}
          />
          <button
            type="button"
            onClick={add}
            disabled={!q.trim() || !a.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors hover:bg-[var(--surface-2)] disabled:opacity-40"
            style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
          >
            <Plus className="h-3.5 w-3.5" />
            أضف سؤالاً
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════ خطوة 4: الباقات ═══════════

function Step4({
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
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--heading)" }}>
          باقاتك
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          من باقة إلى ثلاث — أساسية، قياسية، احترافية.
        </p>
      </div>

      {packages.map((p, i) => (
        <div
          key={p.tier}
          className="rounded-xl p-4"
          style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ backgroundColor: "var(--accent)", color: "#0E3A46" }}
            >
              {TIER_LABEL[p.tier]}
            </span>
            {packages.length > 1 && (
              <button
                type="button"
                onClick={() => setPackages(packages.filter((_, idx) => idx !== i))}
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
              style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--border)" }}
            />
            <textarea
              value={p.description}
              onChange={(e) => update(i, { description: e.target.value })}
              placeholder="ماذا تحصل عليه في هذه الباقة؟"
              rows={2}
              className="w-full resize-y rounded-xl px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--border)" }}
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
            <FeaturesEditor features={p.features} onChange={(features) => update(i, { features })} />
          </div>
        </div>
      ))}

      {availableTiers.length > 0 && packages.length < 3 && (
        <button
          type="button"
          onClick={() => setPackages([...packages, emptyPackage(availableTiers[0])])}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
          style={{ border: "1px dashed var(--border)", color: "var(--ink)" }}
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
      <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
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
        style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--border)" }}
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
      <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
        الميزات ({features.length}/10)
      </span>
      <ul className="mt-1 space-y-1.5">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs"
            style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--ink)" }}
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
            style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--border)" }}
          />
          <button
            type="button"
            onClick={add}
            disabled={!draft.trim()}
            className="rounded-lg px-3 text-xs font-bold transition-colors hover:bg-[var(--surface-2)] disabled:opacity-40"
            style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════ خطوة 5: المراجعة والإرسال ═══════════

function Step5({
  categoryId,
  serviceType,
  title,
  coverImage,
  gallery,
  tags,
  description,
  deliverables,
  faqs,
  requirements,
  packages,
}: {
  categoryId: CategorySlug | "";
  serviceType: string;
  title: string;
  coverImage: string | null;
  gallery: string[];
  tags: string[];
  description: string;
  deliverables: string[];
  faqs: Faq[];
  requirements: string;
  packages: PackageDraft[];
}) {
  const subtypeLabel =
    categoryId && serviceType
      ? SERVICE_TYPES[categoryId].find((t) => t.value === serviceType)?.label
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--heading)" }}>
          راجع خدمتك قبل الإرسال
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          هكذا ستبدو خدمتك تقريباً بعد اعتمادها.
        </p>
      </div>

      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt="معاينة صورة الغلاف" className="aspect-[16/9] w-full rounded-2xl object-cover" />
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
        {categoryId && <Badge>{CATEGORY_LABELS[categoryId]}</Badge>}
        {subtypeLabel && <Badge>{subtypeLabel}</Badge>}
      </div>

      <h3 className="text-xl font-bold leading-snug" style={{ color: "var(--heading)" }}>
        {title || "— بلا عنوان —"}
      </h3>

      {gallery.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {gallery.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`صورة معرض ${i + 1}`} className="aspect-square rounded-lg object-cover" />
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      )}

      <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
        {description}
      </p>

      {deliverables.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-bold" style={{ color: "var(--heading)" }}>
            ماذا تحصل عليه
          </p>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm" style={{ color: "var(--ink)" }}>
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--success)" }} />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {requirements && (
        <div>
          <p className="mb-1 text-sm font-bold" style={{ color: "var(--heading)" }}>
            متطلبات من المشتري
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {requirements}
          </p>
        </div>
      )}

      {faqs.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-bold" style={{ color: "var(--heading)" }}>
            الأسئلة الشائعة
          </p>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-lg p-3" style={{ backgroundColor: "var(--surface-2)" }}>
                <p className="text-xs font-bold" style={{ color: "var(--heading)" }}>
                  {f.question}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-bold" style={{ color: "var(--heading)" }}>
          الباقات
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {packages.map((p) => (
            <div
              key={p.tier}
              className="rounded-xl p-3"
              style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <p className="text-[10px] font-bold" style={{ color: "var(--accent)" }}>
                {TIER_LABEL[p.tier]}
              </p>
              <p className="mt-0.5 text-sm font-bold" style={{ color: "var(--heading)" }}>
                {p.title || "—"}
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums" style={{ color: "var(--heading)" }}>
                {p.priceSar || "0"} ر.س
              </p>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--muted)" }}>
                {p.deliveryDays || "?"} أيام تسليم · {p.revisions || "0"} تعديلات
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-start gap-2 rounded-xl p-3 text-sm"
        style={{ backgroundColor: "var(--info-tint)", border: "1px solid var(--info)" }}
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--info)" }} />
        <span style={{ color: "var(--ink)" }}>
          ستُراجع خدمتك من الإدارة قبل ظهورها للعامة (عادة خلال 24 ساعة).
        </span>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ backgroundColor: "var(--surface-2)", color: "var(--ink)", border: "1px solid var(--border)" }}
    >
      {children}
    </span>
  );
}

// ═══════════ عام ═══════════

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
        <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
          {label}
        </span>
        {hint && (
          // dir="ltr" يمنع خوارزمية bidi من عكس ترتيب "3 / 80" داخل سياق عربي محيط.
          <span dir="ltr" className="text-xs tabular-nums" style={{ color: "var(--muted)" }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
