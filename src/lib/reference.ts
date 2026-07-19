import { customAlphabet } from "nanoid";

// أرقام فقط: HRF-YYYY-XXXXXX
const sixDigits = customAlphabet("0123456789", 6);

/** يبني مرجع طلب: HRF-YYYY-NNNNNN */
export function makeOrderReference(): string {
  const year = new Date().getUTCFullYear();
  return `HRF-${year}-${sixDigits()}`;
}
