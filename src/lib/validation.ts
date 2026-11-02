/**
 * Bağımlılıksız doğrulama kuralları. Her kural bir değer alır ve hata
 * mesajı (string) ya da geçerliyse `undefined` döndürür. `useForm` ile birlikte
 * veya tek başına kullanılabilir.
 *
 * @example
 * const rules = {
 *   email: [v.required(), v.email()],
 *   password: [v.required(), v.minLength(8)],
 *   phone: [v.phone()],
 *   passwordAgain: [v.matches('password', 'Şifreler eşleşmiyor')],
 * };
 * validate(values, rules) // { password: 'En az 8 karakter olmalı' }
 */

export type Rule<V = unknown, T = Record<string, unknown>> = (value: V, values: T) => string | undefined;
export type Rules<T> = Partial<{ [K in keyof T]: Rule<T[K], T> | Rule<T[K], T>[] }>;
export type Errors<T> = Partial<Record<keyof T, string>>;

const isEmpty = (value: unknown) =>
  value == null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0) || value === false;

const str = (value: unknown) => (value == null ? '' : String(value));

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const URL_RE = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export const v = {
  required:
    (message = 'Bu alan zorunludur'): Rule =>
    (value) =>
      isEmpty(value) ? message : undefined,

  email:
    (message = 'Geçerli bir e-posta adresi girin'): Rule =>
    (value) =>
      isEmpty(value) || EMAIL_RE.test(str(value).trim()) ? undefined : message,

  url:
    (message = 'Geçerli bir adres girin (https://…)'): Rule =>
    (value) =>
      isEmpty(value) || URL_RE.test(str(value).trim()) ? undefined : message,

  minLength:
    (min: number, message?: string): Rule =>
    (value) =>
      isEmpty(value) || str(value).length >= min ? undefined : (message ?? `En az ${min} karakter olmalı`),

  maxLength:
    (max: number, message?: string): Rule =>
    (value) =>
      str(value).length <= max ? undefined : (message ?? `En fazla ${max} karakter olabilir`),

  min:
    (min: number, message?: string): Rule =>
    (value) =>
      isEmpty(value) || Number(value) >= min ? undefined : (message ?? `En az ${min} olmalı`),

  max:
    (max: number, message?: string): Rule =>
    (value) =>
      isEmpty(value) || Number(value) <= max ? undefined : (message ?? `En fazla ${max} olabilir`),

  pattern:
    (re: RegExp, message = 'Geçersiz biçim'): Rule =>
    (value) =>
      isEmpty(value) || re.test(str(value)) ? undefined : message,

  /** Türk cep / sabit telefon (0 ile veya +90 ile). */
  phone:
    (message = 'Geçerli bir telefon numarası girin'): Rule =>
    (value) =>
      isEmpty(value) || isTurkishPhone(str(value)) ? undefined : message,

  tcKimlik:
    (message = 'Geçerli bir T.C. kimlik numarası girin'): Rule =>
    (value) =>
      isEmpty(value) || isTcKimlik(str(value)) ? undefined : message,

  iban:
    (message = 'Geçerli bir IBAN girin'): Rule =>
    (value) =>
      isEmpty(value) || isIban(str(value)) ? undefined : message,

  vergiNo:
    (message = 'Geçerli bir vergi numarası girin'): Rule =>
    (value) =>
      isEmpty(value) || isVergiNo(str(value)) ? undefined : message,

  /** Başka bir alanla aynı olmalı (ör. şifre tekrarı). */
  matches:
    <T extends Record<string, unknown>>(field: keyof T, message = 'Değerler eşleşmiyor'): Rule<unknown, T> =>
    (value, values) =>
      value === values[field] ? undefined : message,

  /** Kendi kuralınız: true dönerse geçerli. */
  custom:
    <V, T = Record<string, unknown>>(check: (value: V, values: T) => boolean, message: string): Rule<V, T> =>
    (value, values) =>
      check(value, values) ? undefined : message,
};

export function isTurkishPhone(value: string) {
  let d = value.replace(/\D/g, '');
  if (d.startsWith('90')) d = d.slice(2);
  if (d.startsWith('0')) d = d.slice(1);
  return /^[2-5]\d{9}$/.test(d);
}

export function isTcKimlik(value: string) {
  if (!/^[1-9]\d{10}$/.test(value)) return false;
  const n = value.split('').map(Number);
  const odd = n[0] + n[2] + n[4] + n[6] + n[8];
  const even = n[1] + n[3] + n[5] + n[7];
  if ((((odd * 7 - even) % 10) + 10) % 10 !== n[9]) return false;
  return n.slice(0, 10).reduce((a, b) => a + b, 0) % 10 === n[10];
}

export function isVergiNo(value: string) {
  if (!/^\d{10}$/.test(value)) return false;
  const d = value.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const t = (d[i] + 9 - i) % 10;
    let r = (t * 2 ** (9 - i)) % 9;
    if (t !== 0 && r === 0) r = 9;
    sum += r;
  }
  return (10 - (sum % 10)) % 10 === d[9];
}

export function isIban(value: string) {
  const iban = value.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) return false;
  if (iban.startsWith('TR') && iban.length !== 26) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let remainder = 0;
  for (const ch of digits) remainder = (remainder * 10 + Number(ch)) % 97;
  return remainder === 1;
}

export function runRules<V, T>(value: V, values: T, rules?: Rule<V, T> | Rule<V, T>[]) {
  if (!rules) return undefined;
  for (const rule of Array.isArray(rules) ? rules : [rules]) {
    const error = rule(value, values);
    if (error) return error;
  }
  return undefined;
}

/** Tüm alanları doğrular; yalnızca hatalı alanları döndürür. */
export function validate<T extends Record<string, unknown>>(values: T, rules: Rules<T>): Errors<T> {
  const errors: Errors<T> = {};
  for (const key of Object.keys(rules) as (keyof T)[]) {
    const error = runRules(values[key], values, rules[key] as Rule<T[keyof T], T>[]);
    if (error) errors[key] = error;
  }
  return errors;
}
