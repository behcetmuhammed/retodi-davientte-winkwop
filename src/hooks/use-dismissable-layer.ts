import { useEffect, useRef, type RefObject } from 'react';

type Layer = {
  refs: RefObject<Array<RefObject<HTMLElement | null>>>;
  onDismiss: RefObject<(reason: 'escape' | 'outside') => void>;
  disableOutside: boolean;
};

const stack: Layer[] = [];
let listening = false;

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.defaultPrevented) return;
  const top = stack[stack.length - 1];
  if (!top) return;
  event.preventDefault();
  top.onDismiss.current?.('escape');
}

function onPointerDown(event: PointerEvent) {
  const target = event.target as Node | null;
  if (!target?.isConnected) return;
  for (const layer of [...stack].reverse()) {
    const inside = layer.refs.current?.some((ref) => ref.current?.contains(target));
    if (inside || layer.disableOutside) return;
    layer.onDismiss.current?.('outside');
  }
}

function sync() {
  if (stack.length > 0 && !listening) {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, true);
    listening = true;
  } else if (stack.length === 0 && listening) {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('pointerdown', onPointerDown, true);
    listening = false;
  }
}

/**
 * Açık katmanları (popover, menü, dialog...) bir yığında tutar. Escape
 * yalnızca en üstteki katmanı kapatır. Dışarı tıklama, tıklanan noktayı
 * içeren katmana kadar üstteki bütün katmanları kapatır; böylece dialog
 * içindeki bir select kapanırken dialog açık kalır.
 *
 * `refs` katmanın "içi" sayılan öğelerdir (içerik + tetikleyici).
 */
export function useDismissableLayer(
  enabled: boolean,
  refs: Array<RefObject<HTMLElement | null>>,
  onDismiss: (reason: 'escape' | 'outside') => void,
  { disableOutside = false }: { disableOutside?: boolean } = {},
): void {
  const refsRef = useRef(refs);
  refsRef.current = refs;
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (!enabled) return;
    const layer: Layer = { refs: refsRef, onDismiss: dismissRef, disableOutside };
    stack.push(layer);
    sync();
    return () => {
      const index = stack.indexOf(layer);
      if (index !== -1) stack.splice(index, 1);
      sync();
    };
  }, [enabled, disableOutside]);
}
