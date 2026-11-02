/**
 * Bildirim (toast) API'si. Sayfada bir kez `<Toaster />` bulunmalıdır;
 * `toast(...)` her yerden (bileşen dışından da) çağrılabilir.
 *
 * @example
 * toast('Adres kaydedildi');
 * toast.success('Ürün sepete eklendi', { description: 'Sepetinizde 3 ürün var.', action: { label: 'Sepete git', onClick: goCart } });
 * toast.error('Ödeme alınamadı');
 * toast.promise(saveOrder(), { loading: 'Kaydediliyor…', success: 'Kaydedildi', error: (e) => `Hata: ${e.message}` });
 * const id = toast.loading('Yükleniyor…'); ... toast.dismiss(id);
 */
import { useSyncExternalStore, type ReactNode } from 'react';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastAction = { label: string; onClick: () => void };

export type ToastOptions = {
  id?: string;
  description?: ReactNode;
  /** ms; `Infinity` ile kalıcı. Varsayılan: 4000 (error: 6000, loading: sonsuz) */
  duration?: number;
  action?: ToastAction;
  /** Kapatma butonunu gösterir. Varsayılan: true */
  dismissible?: boolean;
  onDismiss?: () => void;
};

export type ToastData = ToastOptions & {
  id: string;
  type: ToastType;
  title: ReactNode;
  createdAt: number;
  /** Kapanış animasyonu sürerken true. */
  closing?: boolean;
};

type Listener = () => void;

let toasts: ToastData[] = [];
const listeners = new Set<Listener>();
let counter = 0;
const EXIT_MS = 150;
const EMPTY: ToastData[] = [];

function emit() {
  for (const l of listeners) l();
}

function upsert(type: ToastType, title: ReactNode, options: ToastOptions = {}): string {
  const id = options.id ?? `dv-toast-${++counter}`;
  const existing = toasts.find((t) => t.id === id);
  const data: ToastData = { ...existing, ...options, id, type, title, createdAt: Date.now(), closing: false };
  toasts = existing ? toasts.map((t) => (t.id === id ? data : t)) : [...toasts, data];
  emit();
  return id;
}

function dismiss(id?: string) {
  const targets = id ? toasts.filter((t) => t.id === id) : toasts;
  if (targets.length === 0) return;
  const ids = new Set(targets.map((t) => t.id));
  toasts = toasts.map((t) => (ids.has(t.id) ? { ...t, closing: true } : t));
  emit();
  for (const t of targets) t.onDismiss?.();
  setTimeout(() => {
    toasts = toasts.filter((t) => !(ids.has(t.id) && t.closing));
    emit();
  }, EXIT_MS);
}

type PromiseMessages<T> = {
  loading: ReactNode;
  success: ReactNode | ((value: T) => ReactNode);
  error: ReactNode | ((error: any) => ReactNode);
};

function toastPromise<T>(promise: Promise<T> | (() => Promise<T>), messages: PromiseMessages<T>, options?: ToastOptions) {
  const id = upsert('loading', messages.loading, options);
  const p = typeof promise === 'function' ? promise() : promise;
  p.then(
    (value) => {
      const title = typeof messages.success === 'function' ? (messages.success as (v: T) => ReactNode)(value) : messages.success;
      upsert('success', title, { ...options, id });
    },
    (error) => {
      const title = typeof messages.error === 'function' ? (messages.error as (e: unknown) => ReactNode)(error) : messages.error;
      upsert('error', title, { ...options, id });
    },
  );
  return p;
}

export const toast = Object.assign((title: ReactNode, options?: ToastOptions) => upsert('default', title, options), {
  success: (title: ReactNode, options?: ToastOptions) => upsert('success', title, options),
  error: (title: ReactNode, options?: ToastOptions) => upsert('error', title, options),
  warning: (title: ReactNode, options?: ToastOptions) => upsert('warning', title, options),
  info: (title: ReactNode, options?: ToastOptions) => upsert('info', title, options),
  loading: (title: ReactNode, options?: ToastOptions) => upsert('loading', title, options),
  promise: toastPromise,
  dismiss,
});

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Toaster'ın kullandığı abonelik. Sunucuda her zaman boş liste döner. */
export function useToasts() {
  return useSyncExternalStore(
    subscribe,
    () => toasts,
    () => EMPTY,
  );
}

export function defaultDuration(type: ToastType) {
  return type === 'loading' ? Infinity : type === 'error' ? 6000 : 4000;
}
