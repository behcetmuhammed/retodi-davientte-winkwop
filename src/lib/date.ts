/**
 * Bağımlılıksız tarih yardımcıları. Tüm hesaplar yerel saat diliminde,
 * gün hassasiyetinde yapılır (saat bileşeni 00:00'a çekilir).
 */

export const DEFAULT_LOCALE = 'tr-TR';

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, amount: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

/** Ay ekler; 31 Ocak + 1 ay = 28/29 Şubat (taşmaz). */
export function addMonths(date: Date, amount: number) {
  const d = new Date(date);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + amount);
  d.setDate(Math.min(day, daysInMonth(d)));
  return d;
}

export function addYears(date: Date, amount: number) {
  return addMonths(date, amount * 12);
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function daysInMonth(date: Date) {
  return endOfMonth(date).getDate();
}

/** Haftanın ilk günü (0 = Pazar, 1 = Pazartesi). Türkiye'de Pazartesi. */
export function startOfWeek(date: Date, weekStartsOn = 1) {
  const d = startOfDay(date);
  const diff = (d.getDay() - weekStartsOn + 7) % 7;
  return addDays(d, -diff);
}

export function isSameDay(a?: Date | null, b?: Date | null) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isBefore(a: Date, b: Date) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfter(a: Date, b: Date) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

export function isBetween(date: Date, from: Date, to: Date) {
  const t = startOfDay(date).getTime();
  return t >= startOfDay(from).getTime() && t <= startOfDay(to).getTime();
}

export function isToday(date: Date) {
  return isSameDay(date, new Date());
}

export function isWeekend(date: Date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}

export function differenceInDays(a: Date, b: Date) {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000);
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/** Takvim ızgarası: 6 hafta × 7 gün (ay dışı günler dahil). */
export function getCalendarDays(month: Date, weekStartsOn = 1) {
  const first = startOfWeek(startOfMonth(month), weekStartsOn);
  return Array.from({ length: 42 }, (_, i) => addDays(first, i));
}

/** Kısa gün adları, haftanın ilk gününden başlayarak: ['Pzt', 'Sal', ...] */
export function getWeekdayNames(locale = DEFAULT_LOCALE, weekStartsOn = 1, format: 'short' | 'narrow' | 'long' = 'short') {
  const base = new Date(2024, 0, 7);
  return Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: format }).format(addDays(base, (weekStartsOn + i) % 7)),
  );
}

export function getMonthNames(locale = DEFAULT_LOCALE, format: 'long' | 'short' = 'long') {
  return Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(locale, { month: format }).format(new Date(2024, i, 1)));
}

/** "12.04.2026" biçiminde (gg.aa.yyyy). */
export function toDateString(date: Date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${date.getFullYear()}`;
}

/** "2026-04-12" (form değerleri ve API için). */
export function toISODate(date: Date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

/** "2026-04-12" veya "12.04.2026" / "12/04/2026" metnini yerel tarihe çevirir. */
export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const s = value.trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
  let y: number, mo: number, d: number;
  if (m) [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  else {
    m = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(s);
    if (!m) return null;
    [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  }
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null;
}

/** Göreli zaman: "3 dakika önce", "2 gün sonra", "dün". */
export function formatRelative(date: Date | string | number, base: Date = new Date(), locale = DEFAULT_LOCALE) {
  const target = new Date(date);
  const diff = (target.getTime() - base.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) return rtf.format(Math.round(diff / seconds), unit);
  }
  return rtf.format(Math.round(diff), 'second');
}
