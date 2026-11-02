import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Ref, RefCallback } from 'react';

export type { ClassValue };

/**
 * Tailwind sınıflarını birleştirir; çakışan sınıflarda sonuncusu kazanır.
 *
 * @example cn('px-2 py-1', isActive && 'bg-primary', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/* ------------------------------------------------------------------ variants */

type VariantMap = Record<string, Record<string, ClassValue>>;

type VariantSelection<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K] | null;
};

type VariantConfig<V extends VariantMap> = {
  base?: ClassValue;
  variants: V;
  defaultVariants?: VariantSelection<V>;
  compoundVariants?: Array<VariantSelection<V> & { className: ClassValue }>;
};

export type VariantProps<T extends (...args: any[]) => string> = Omit<
  NonNullable<Parameters<T>[0]>,
  'className'
>;

/**
 * Tip güvenli varyant tanımı (cva benzeri).
 *
 * @example
 * const badge = variants({
 *   base: 'inline-flex rounded-md',
 *   variants: { tone: { neutral: 'bg-muted', danger: 'bg-destructive' } },
 *   defaultVariants: { tone: 'neutral' },
 * });
 * badge({ tone: 'danger', className: 'mt-2' });
 */
export function variants<V extends VariantMap>(config: VariantConfig<V>) {
  return (props: VariantSelection<V> & { className?: ClassValue } = {}): string => {
    const classes: ClassValue[] = [config.base];
    const selected: Record<string, unknown> = {};

    for (const key of Object.keys(config.variants)) {
      const value = props[key] ?? config.defaultVariants?.[key];
      selected[key] = value;
      if (value != null) classes.push(config.variants[key][String(value)]);
    }

    for (const { className, ...conditions } of config.compoundVariants ?? []) {
      const matches = Object.entries(conditions).every(([key, value]) => selected[key] === value);
      if (matches) classes.push(className);
    }

    classes.push(props.className);
    return cn(classes);
  };
}

/* ---------------------------------------------------------------------- refs */

export function setRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/** Birden fazla ref'i tek bir callback ref'e bağlar. */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) setRef(ref, node);
  };
}

/* ------------------------------------------------------------------- events */

/**
 * Kullanıcının handler'ını önce çalıştırır; `preventDefault` çağrılmadıysa
 * bileşenin kendi davranışını uygular.
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  userHandler: ((event: E) => void) | undefined,
  ownHandler: (event: E) => void,
) {
  return (event: E) => {
    userHandler?.(event);
    if (!event.defaultPrevented) ownHandler(event);
  };
}

/** Verilen fonksiyonların hepsini aynı argümanlarla çağırır. */
export function callAll<A extends unknown[]>(...fns: Array<((...args: A) => void) | undefined>) {
  return (...args: A) => {
    for (const fn of fns) fn?.(...args);
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
