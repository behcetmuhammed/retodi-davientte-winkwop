import { useEffect, useRef, type RefObject } from 'react';

type Target = Window | Document | HTMLElement | null | undefined;

/**
 * Olay dinleyicisi ekler ve temizler. Handler her render'da değişse bile
 * dinleyici yeniden bağlanmaz.
 *
 * @example useEventListener('keydown', (e) => e.key === 'Escape' && close());
 * @example useEventListener('scroll', onScroll, ref, { passive: true });
 */
export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: RefObject<Target> | Target,
  options?: AddEventListenerOptions & { enabled?: boolean },
): void;
export function useEventListener(
  type: string,
  handler: (event: Event) => void,
  target?: RefObject<Target> | Target,
  options?: AddEventListenerOptions & { enabled?: boolean },
): void;
export function useEventListener(
  type: string,
  handler: (event: Event) => void,
  target?: RefObject<Target> | Target,
  options: AddEventListenerOptions & { enabled?: boolean } = {},
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const { enabled = true, capture, passive, once } = options;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const element: Target =
      target === undefined ? window : target && 'current' in target ? target.current : (target as Target);
    if (!element) return;

    const listener = (event: Event) => handlerRef.current(event);
    const opts = { capture, passive, once };
    element.addEventListener(type, listener, opts);
    return () => element.removeEventListener(type, listener, opts);
  }, [type, target, enabled, capture, passive, once]);
}
