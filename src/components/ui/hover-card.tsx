/**
 * Üzerine gelince detaylı önizleme kartı gösterir. İçeriğe geçince kapanmaz.
 * Klavye kullanıcıları için odakta da açılır.
 *
 * @example
 * <HoverCard content={<UserPreview user={u} />}>
 *   <a href="/marka/davientte" className="underline">@davientte</a>
 * </HoverCard>
 */
import { cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { useEventListener } from '../../hooks/use-event-listener';
import { useFloating } from '../../hooks/use-floating';
import { usePresence } from '../../hooks/use-presence';
import type { Align, Side } from '../../lib/floating';
import { cn, composeRefs } from '../../lib/utils';
import { Portal } from './portal';

type HoverCardProps = {
  content: ReactNode;
  children: ReactElement;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
};

export function HoverCard({
  content,
  children,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  openDelay = 400,
  closeDelay = 200,
  className,
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const present = usePresence(open, 120);
  const timer = useRef(0);
  const floating = useFloating({ open, side, align, sideOffset });

  const schedule = (next: boolean) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), next ? openDelay : closeDelay);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEventListener('keydown', (event) => event.key === 'Escape' && setOpen(false), undefined, { enabled: open });

  if (!isValidElement(children)) return children;
  const child = children as ReactElement<Record<string, any>>;

  const trigger = cloneElement(child, {
    ref: composeRefs(child.props.ref, floating.referenceRef),
    'data-state': open ? 'open' : 'closed',
    onPointerEnter: (e: PointerEvent) => {
      child.props.onPointerEnter?.(e);
      if (e.pointerType === 'mouse') schedule(true);
    },
    onPointerLeave: (e: PointerEvent) => {
      child.props.onPointerLeave?.(e);
      schedule(false);
    },
    onFocus: (e: FocusEvent) => {
      child.props.onFocus?.(e);
      schedule(true);
    },
    onBlur: (e: FocusEvent) => {
      child.props.onBlur?.(e);
      schedule(false);
    },
  });

  return (
    <>
      {trigger}
      {present && (
        <Portal>
          <div
            data-slot="hover-card"
            data-state={open ? 'open' : 'closed'}
            data-side={floating.side}
            ref={floating.setFloating}
            style={floating.style}
            onPointerEnter={() => schedule(true)}
            onPointerLeave={() => schedule(false)}
            className={cn(
              'z-50 w-64 rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-md outline-none',
              'data-[state=open]:animate-dv-zoom-in data-[state=closed]:animate-dv-zoom-out',
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
