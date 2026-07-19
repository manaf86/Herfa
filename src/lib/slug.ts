import { customAlphabet } from "nanoid";

// أبجدية آمنة للـ URL — بلا حروف قد تلتبس (0/O، 1/l).
const nanoid = customAlphabet("23456789abcdefghijkmnpqrstuvwxyz", 6);

/**
 * يبني slug ودّيّاً للـ URL:
 *   "سأصمّم لك هوية بصرية"  →  "sasmm-lk-hwy-bsry-abc123"
 * يحافظ على الحروف العربية اللاتينية عند وجودها،
 * ويستبدل غيرها بـ '-'. يضمن التفرّد بلاحقة nanoid(6).
 */
export function makeGigSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    // نُبقي حروف/أرقام لاتينية + العربية الأساسية.
    .replace(/[^ء-ي٠-٩a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 60);

  const rand = nanoid();
  return base ? `${base}-${rand}` : `gig-${rand}`;
}
