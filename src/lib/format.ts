/**
 * Biçimlendirme yardımcıları (varsayılan: Türkçe / TRY).
 *
 * @example
 * formatCurrency(1250)            // "₺1.250,00"
 * formatNumber(1234567.891, 1)    // "1.234.567,9"
 * formatCompact(1_250_000)        // "1,3 Mn"
 * formatPercent(0.184)            // "%18,4"
 * formatDate(new Date())          // "12 Nisan 2026"
 * formatBytes(1_048_576)          // "1 MB"
 * formatPhone('5321234567')       // "0532 123 45 67"
 */
import { DEFAULT_LOCALE } from './date';

const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();

function numberFormat(locale: string, options: Intl.NumberFormatOptions) {
  const key = `n|${locale}|${JSON.stringify(options)}`;
  let f = cache.get(key) as Intl.NumberFormat | undefined;
  if (!f) cache.set(key, (f = new Intl.NumberFormat(locale, options)));
  return f;
}

function dateFormat(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `d|${locale}|${JSON.stringify(options)}`;
  let f = cache.get(key) as Intl.DateTimeFormat | undefined;
  if (!f) cache.set(key, (f = new Intl.DateTimeFormat(locale, options)));
  return f;
}

const toNumber = (value: number | string | null | undefined) => (typeof value === 'string' ? Number(value) : (value ?? 0));

export function formatCurrency(
  value: number | string | null | undefined,
  { currency = 'TRY', locale = DEFAULT_LOCALE, decimals }: { currency?: string; locale?: string; decimals?: number } = {},
) {
  return numberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals ?? 2,
    maximumFractionDigits: decimals ?? 2,
  }).format(toNumber(value));
}

export function formatNumber(value: number | string | null | undefined, decimals?: number, locale = DEFAULT_LOCALE) {
  return numberFormat(locale, decimals === undefined ? {} : { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(
    toNumber(value),
  );
}

export function formatCompact(value: number | string | null | undefined, locale = DEFAULT_LOCALE) {
  return numberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(toNumber(value));
}

/** 0.184 → "%18,4". `fromWhole` true ise 18.4 → "%18,4". */
export function formatPercent(value: number | null | undefined, { decimals = 1, fromWhole = false, locale = DEFAULT_LOCALE } = {}) {
  const v = (value ?? 0) / (fromWhole ? 100 : 1);
  return numberFormat(locale, { style: 'percent', maximumFractionDigits: decimals }).format(v);
}

type DateStyle = 'short' | 'medium' | 'long' | 'full' | 'datetime' | 'time';

const DATE_STYLES: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  short: { day: '2-digit', month: '2-digit', year: 'numeric' },
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  datetime: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  time: { hour: '2-digit', minute: '2-digit' },
};

export function formatDate(value: Date | string | number | null | undefined, style: DateStyle | Intl.DateTimeFormatOptions = 'long', locale = DEFAULT_LOCALE) {
  if (value == null || value === '') return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return dateFormat(locale, typeof style === 'string' ? DATE_STYLES[style] : style).format(date);
}

export function formatBytes(bytes: number, decimals = 1, locale = DEFAULT_LOCALE) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)));
  const v = bytes / 1024 ** i;
  return `${numberFormat(locale, { maximumFractionDigits: i === 0 ? 0 : decimals }).format(v)} ${units[i]}`;
}

/** Türk telefon numarası: "0532 123 45 67". Tanınmazsa olduğu gibi döner. */
export function formatPhone(value: string | null | undefined) {
  if (!value) return '';
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('90') && digits.length === 12) digits = digits.slice(2);
  if (digits.length === 10) digits = `0${digits}`;
  if (digits.length !== 11) return value;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
}

/** IBAN'ı 4'lü gruplar: "TR12 0006 1000 ...". */
export function formatIban(value: string | null | undefined) {
  return (value ?? '').replace(/\s+/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim();
}

export function truncate(text: string, max: number, suffix = '…') {
  return text.length > max ? text.slice(0, Math.max(0, max - suffix.length)).trimEnd() + suffix : text;
}

/** Türkçe karakterleri dönüştürerek URL dostu metin: "Çalışma Masası" → "calisma-masasi". */
export function slugify(text: string) {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', i: 'i', ö: 'o', ş: 's', ü: 'u' };
  return text
    .toLocaleLowerCase('tr')
    .replace(/[çğıiöşü]/g, (ch) => map[ch] ?? ch)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Tekil/çoğul ek gerektirmeyen Türkçe sayım: "3 ürün". */
export function pluralize(count: number, word: string, locale = DEFAULT_LOCALE) {
  return `${formatNumber(count, undefined, locale)} ${word}`;
}

/** "ayşe yılmaz" → "Ayşe Yılmaz" (Türkçe büyük harf kuralları ile). */
export function titleCase(text: string) {
  return text
    .toLocaleLowerCase('tr')
    .split(/\s+/)
    .map((w) => (w ? w[0].toLocaleUpperCase('tr') + w.slice(1) : w))
    .join(' ');
}
