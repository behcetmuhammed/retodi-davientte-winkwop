import { useEffect, useRef, type RefObject } from 'react';

/**
 * Verilen öğelerin dışına tıklandığında (veya dokunulduğunda) handler'ı çağırır.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside([ref], () => setOpen(false), open);
 */
export function useClickOutside(
  refs: Array<RefObject<HTMLElement | null>>,
  handler: (event: PointerEvent) => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!enabled) return;
    const listener = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || !target.isConnected) return;
      const inside = refsRef.current.some((ref) => ref.current?.contains(target));
      if (!inside) handlerRef.current(event);
    };
    document.addEventListener('pointerdown', listener, true);
    return () => document.removeEventListener('pointerdown', listener, true);
  }, [enabled]);
}
