/**
 * Bir öğeye tıklanınca açılan küçük içerik paneli.
 *
 * @example
 * <Popover>
 *   <PopoverTrigger asChild><Button variant="outline">Filtrele</Button></PopoverTrigger>
 *   <PopoverContent align="start" className="w-72">...</PopoverContent>
 * </Popover>
 */
import { createContext, useContext, useId, useRef, type ComponentProps, type ReactNode, type RefObject } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useDismissableLayer } from '../../hooks/use-dismissable-layer';
import { useFloating } from '../../hooks/use-floating';
import { getTabbable } from '../../hooks/use-focus-trap';
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect';
import { usePresence } from '../../hooks/use-presence';
import type { Align, Side } from '../../lib/floating';
import { cn, composeEventHandlers, composeRefs } from '../../lib/utils';
import { Portal } from './portal';
import { Slot } from './slot';

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
  anchorRef: RefObject<HTMLElement | null>;
  contentId: string;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

export function usePopover() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error('Popover bileşenleri <Popover> içinde kullanılmalı.');
  return ctx;
}

export type PopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function Popover({ open: openProp, defaultOpen = false, onOpenChange, children }: PopoverProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const triggerRef = useRef<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const contentId = `popover-${useId().replace(/:/g, '')}`;
  return <PopoverContext.Provider value={{ open, setOpen, triggerRef, anchorRef, contentId }}>{children}</PopoverContext.Provider>;
}

export function PopoverTrigger({ asChild, onClick, ref, ...props }: ComponentProps<'button'> & { asChild?: boolean }) {
  const ctx = usePopover();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-haspopup="dialog"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.contentId : undefined}
      data-state={ctx.open ? 'open' : 'closed'}
      data-slot="popover-trigger"
      ref={composeRefs(ref as never, ctx.triggerRef)}
      onClick={composeEventHandlers(onClick as never, () => ctx.setOpen(!ctx.open))}
      {...(props as object)}
    />
  );
}

/** Konumlandırmayı tetikleyici yerine başka bir öğeye bağlar (ör. tüm input grubu). */
export function PopoverAnchor({ ref, ...props }: ComponentProps<'div'>) {
  const ctx = usePopover();
  return <div data-slot="popover-anchor" ref={composeRefs(ref, ctx.anchorRef)} {...props} />;
}

export type PopoverContentProps = ComponentProps<'div'> & {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  /** Açılınca ilk odaklanabilir öğeye odaklan. Varsayılan: true */
  autoFocus?: boolean;
  /** Tetikleyici genişliğine eşitle. */
  matchWidth?: boolean;
};

export function PopoverContent({
  side = 'bottom',
  align = 'center',
  sideOffset = 6,
  alignOffset = 0,
  autoFocus = true,
  matchWidth,
  className,
  children,
  ref,
  ...props
}: PopoverContentProps) {
  const ctx = usePopover();
  const present = usePresence(ctx.open, 120);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const floating = useFloating({ open: ctx.open, side, align, sideOffset, alignOffset, matchWidth });

  useIsomorphicLayoutEffect(() => {
    floating.referenceRef.current = ctx.anchorRef.current ?? ctx.triggerRef.current;
  });

  useDismissableLayer(ctx.open, [contentRef, ctx.triggerRef, ctx.anchorRef], (reason) => {
    ctx.setOpen(false);
    if (reason === 'escape') ctx.triggerRef.current?.focus();
  });

  useIsomorphicLayoutEffect(() => {
    if (!ctx.open || !autoFocus) return;
    const frame = requestAnimationFrame(() => {
      const el = contentRef.current;
      if (!el || el.contains(document.activeElement)) return;
      (el.querySelector<HTMLElement>('[data-autofocus]') ?? getTabbable(el)[0] ?? el).focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [ctx.open, autoFocus]);

  if (!present) return null;

  return (
    <Portal>
      <div
        id={ctx.contentId}
        role="dialog"
        tabIndex={-1}
        data-slot="popover-content"
        data-dv-layer=""
        data-state={ctx.open ? 'open' : 'closed'}
        data-side={floating.side}
        ref={composeRefs(ref, contentRef, floating.setFloating)}
        style={floating.style}
        onBlur={(event) => {
          const next = event.relatedTarget as HTMLElement | null;
          if (!next || contentRef.current?.contains(next) || ctx.triggerRef.current?.contains(next)) return;
          if (next.closest('[data-dv-layer]')) return;
          ctx.setOpen(false);
        }}
        className={cn(
          'z-50 w-72 max-w-[calc(100vw-1rem)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
          'data-[state=open]:animate-dv-zoom-in data-[state=closed]:animate-dv-zoom-out',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </Portal>
  );
}

export function PopoverClose({ asChild, onClick, ...props }: ComponentProps<'button'> & { asChild?: boolean }) {
  const ctx = usePopover();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      onClick={composeEventHandlers(onClick as never, () => {
        ctx.setOpen(false);
        ctx.triggerRef.current?.focus();
      })}
      {...(props as object)}
    />
  );
}

export function PopoverHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mb-3 flex flex-col gap-1', className)} {...props} />;
}

export function PopoverTitle({ className, ...props }: ComponentProps<'h4'>) {
  return <h4 className={cn('text-sm leading-none font-semibold', className)} {...props} />;
}

export function PopoverDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('text-[0.8125rem] text-muted-foreground', className)} {...props} />;
}
