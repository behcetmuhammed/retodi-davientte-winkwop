/**
 * Açılır/kapanır içerik alanı. Accordion'un temelidir.
 *
 * @example
 * <Collapsible>
 *   <CollapsibleTrigger asChild><Button variant="ghost">Detaylar</Button></CollapsibleTrigger>
 *   <CollapsibleContent>Gizli içerik</CollapsibleContent>
 * </Collapsible>
 */
import { createContext, use, useId, useRef, type ComponentProps, type CSSProperties } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect';
import { usePresence } from '../../hooks/use-presence';
import { cn, composeEventHandlers } from '../../lib/utils';
import { Slot } from './slot';

type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;
  contentId: string;
  toggle: () => void;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible() {
  const ctx = use(CollapsibleContext);
  if (!ctx) throw new Error('Collapsible bileşenleri <Collapsible> içinde kullanılmalı.');
  return ctx;
}

type CollapsibleProps = ComponentProps<'div'> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

export function Collapsible({ open: openProp, defaultOpen = false, onOpenChange, disabled = false, className, ...props }: CollapsibleProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const contentId = useId();
  return (
    <CollapsibleContext value={{ open, disabled, contentId, toggle: () => setOpen((o) => !o) }}>
      <div data-slot="collapsible" data-state={open ? 'open' : 'closed'} data-disabled={disabled || undefined} className={className} {...props} />
    </CollapsibleContext>
  );
}

export function CollapsibleTrigger({ asChild, onClick, ...props }: ComponentProps<'button'> & { asChild?: boolean }) {
  const { open, disabled, contentId, toggle } = useCollapsible();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-expanded={open}
      aria-controls={contentId}
      data-state={open ? 'open' : 'closed'}
      data-disabled={disabled || undefined}
      disabled={disabled}
      data-slot="collapsible-trigger"
      onClick={composeEventHandlers(onClick, toggle)}
      {...(props as ComponentProps<'button'>)}
    />
  );
}

type CollapsibleContentProps = ComponentProps<'div'> & {
  /** Kapalıyken de DOM'da (gizli) tutar; SEO veya sayfa içi arama için. */
  forceMount?: boolean;
};

export function CollapsibleContent({ forceMount, className, style, children, ...props }: CollapsibleContentProps) {
  const { open, contentId } = useCollapsible();
  const present = usePresence(open, 160);
  const ref = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--dv-collapsible-height', `${el.scrollHeight}px`);
  });

  useIsomorphicLayoutEffect(() => {
    firstRender.current = false;
  }, []);

  if (!present && !forceMount) return null;

  return (
    <div
      ref={ref}
      id={contentId}
      data-slot="collapsible-content"
      data-state={open ? 'open' : 'closed'}
      hidden={!present}
      className={cn(
        'overflow-hidden',
        !firstRender.current && 'data-[state=closed]:animate-dv-accordion-up data-[state=open]:animate-dv-accordion-down',
        className,
      )}
      style={style as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}

export { useCollapsible };
