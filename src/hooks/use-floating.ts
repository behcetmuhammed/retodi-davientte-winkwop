import { useCallback, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { computePosition, getRect, type Align, type PositionOptions, type Side } from '../lib/floating';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

export type VirtualPoint = { x: number; y: number };

type Options = PositionOptions & {
  open: boolean;
  /** Açılır katmanı tetikleyicinin genişliğine eşitler (select, combobox). */
  matchWidth?: boolean;
  /** Bir öğe yerine sabit bir noktaya bağlanmak için (context menu). */
  point?: VirtualPoint | null;
};

type Result = {
  referenceRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  /** Açılır öğeye verilecek ref; portal geç mount olsa da konumu hesaplatır. */
  setFloating: (node: HTMLElement | null) => void;
  style: CSSProperties;
  side: Side;
  align: Align;
  update: () => void;
};

/**
 * Tetikleyiciye göre `position: fixed` stil üretir; kaydırma, yeniden
 * boyutlandırma ve içerik değişikliklerinde konumu günceller.
 */
export function useFloating({ open, matchWidth, point, ...options }: Options): Result {
  const referenceRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLElement | null>(null);
  const [floatingEl, setFloatingEl] = useState<HTMLElement | null>(null);
  const setFloating = useCallback((node: HTMLElement | null) => {
    floatingRef.current = node;
    setFloatingEl(node);
  }, []);
  const [state, setState] = useState<{ x: number; y: number; side: Side; align: Align; maxHeight: number; maxWidth: number; refWidth: number } | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointRef = useRef(point);
  pointRef.current = point;

  const update = useCallback(() => {
    const floating = floatingRef.current;
    const anchor = pointRef.current ?? referenceRef.current;
    if (!floating || !anchor) return;
    const reference = getRect(anchor);
    const size = { width: floating.offsetWidth, height: floating.offsetHeight };
    const next = computePosition(reference, size, optionsRef.current);
    setState((prev) =>
      prev &&
      prev.x === next.x &&
      prev.y === next.y &&
      prev.side === next.side &&
      prev.maxHeight === next.maxHeight &&
      prev.refWidth === reference.width
        ? prev
        : { ...next, refWidth: reference.width },
    );
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!open || !floatingEl) {
      if (!open) setState(null);
      return;
    }
    update();
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    observer?.observe(floatingEl);
    if (referenceRef.current) observer?.observe(referenceRef.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
    };
  }, [open, floatingEl, update, point?.x, point?.y]);

  const style: CSSProperties = {
    position: 'fixed',
    left: state?.x ?? 0,
    top: state?.y ?? 0,
    visibility: state ? undefined : 'hidden',
    ['--dv-available-height' as string]: state ? `${state.maxHeight}px` : undefined,
    ['--dv-anchor-width' as string]: state ? `${state.refWidth}px` : undefined,
    ...(matchWidth && state ? { width: state.refWidth } : null),
  };

  return {
    referenceRef,
    floatingRef,
    setFloating,
    style,
    side: state?.side ?? options.side ?? 'bottom',
    align: state?.align ?? options.align ?? 'center',
    update,
  };
}
