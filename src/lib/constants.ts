/** UI kit genelinde kullanılan sabitler. */

export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const;

/** Katman sıraları (Tailwind z-index sınıflarıyla uyumlu). */
export const Z_INDEX = {
  dropdown: 50,
  sticky: 40,
  overlay: 50,
  modal: 50,
  popover: 50,
  toast: 100,
} as const;

export const DURATION = { fast: 120, normal: 150, slow: 220 } as const;

export const DEBOUNCE_MS = 300;

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export const LOCALE = 'tr-TR';
export const CURRENCY = 'TRY';

/** Dosya yükleme varsayılanları. */
export const UPLOAD = {
  maxSizeBytes: 10 * 1024 * 1024,
  imageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  documentTypes: ['application/pdf'],
} as const;

/** localStorage anahtarları için ortak önek. */
export const STORAGE_PREFIX = 'davientte:';

export const KEYS = {
  enter: 'Enter',
  escape: 'Escape',
  space: ' ',
  tab: 'Tab',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  home: 'Home',
  end: 'End',
  pageUp: 'PageUp',
  pageDown: 'PageDown',
  backspace: 'Backspace',
} as const;
