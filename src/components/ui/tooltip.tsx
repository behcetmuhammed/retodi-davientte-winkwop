/**
 * Üzerine gelince veya klavyeyle odaklanınca kısa açıklama gösterir.
 *
 * @example
 * <Tooltip content="Favorilere ekle">
 *   <IconButton aria-label="Favorilere ekle"><StarIcon /></IconButton>
 * </Tooltip>
 *
 * <Tooltip content="Kopyalandı" side="right" delay={0}>...</Tooltip>
 */
import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { useEventListener } from '../../hooks/use-event-listener';
import { useFloating } from '../../hooks/use-floating';
import { usePresence } from '../../hooks/use-presence';
import type { Align, Side } from '../../lib/floating';
import { cn, composeRefs } from '../../lib/utils';
import { Portal } from './portal';

/** Bir tooltip kapandıktan hemen sonra başkası açılırsa beklemeden açılır. */
let lastClosedAt = 0;

type TooltipProps = {
  content: ReactNode;
  children: ReactElement;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  /** Açılma gecikmesi (ms). Varsayılan: 500 */
  delay?: number;
  disabled?: boolean;
  className?: string;
};

export function Tooltip({ content, children, side = 'top', align = 'center', sideOffset = 6, delay = 500, disabled, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const present = usePresence(open, 100);
  const id = `tooltip-${useId().replace(/:/g, '')}`;
  const timer = useRef(0);
  const floating = useFloating({ open, side, align, sideOffset });

  const show = (immediate = false) => {
    if (disabled) return;
    window.clearTimeout(timer.current);
    const warm = Date.now() - lastClosedAt < 300;
    if (immediate || warm || delay === 0) setOpen(true);
    else timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen((prev) => {
      if (prev) lastClosedAt = Date.now();
      return false;
    });
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEventListener('keydown', (event) => event.key === 'Escape' && hide(), undefined, { enabled: open });

  if (!isValidElement(children)) return children;
  const child = children as ReactElement<Record<string, any>>;

  const trigger = cloneElement(child, {
    ref: composeRefs(child.props.ref, floating.referenceRef),
    'aria-describedby': open ? cn(child.props['aria-describedby'], id) : child.props['aria-describedby'],
    onPointerEnter: (e: PointerEvent) => {
      child.props.onPointerEnter?.(e);
      if (e.pointerType === 'mouse') show();
    },
    onPointerLeave: (e: PointerEvent) => {
      child.props.onPointerLeave?.(e);
      hide();
    },
    onFocus: (e: FocusEvent) => {
      child.props.onFocus?.(e);
      if ((e.target as HTMLElement).matches?.(':focus-visible')) show(true);
    },
    onBlur: (e: FocusEvent) => {
      child.props.onBlur?.(e);
      hide();
    },
    onPointerDown: (e: PointerEvent) => {
      child.props.onPointerDown?.(e);
      hide();
    },
  });

  return (
    <>
      {trigger}
      {present && (
        <Portal>
          <div
            id={id}
            role="tooltip"
            data-slot="tooltip"
            data-state={open ? 'open' : 'closed'}
            data-side={floating.side}
            ref={floating.setFloating}
            style={floating.style}
            className={cn(
              'pointer-events-none z-50 max-w-xs rounded-sm bg-foreground px-2.5 py-1.5 text-xs leading-snug text-background',
              'data-[state=open]:animate-dv-fade-in data-[state=closed]:animate-dv-fade-out',
              className,
            )}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
