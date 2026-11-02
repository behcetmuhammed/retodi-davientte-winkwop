/**
 * Menü çekirdeği: DropdownMenu, ContextMenu ve Menubar bu parçaları paylaşır.
 * Doğrudan kullanılmaz; ilgili bileşenin export'larını kullanın.
 *
 * Davranış: ok tuşları / Home / End / harfle arama, Enter-Space ile seçim,
 * Escape ile kapanma, alt menüler (sağ ok ile açılır, sol ok ile kapanır),
 * checkbox ve radio öğeleri.
 */
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useDismissableLayer } from '../../hooks/use-dismissable-layer';
import { useFloating, type VirtualPoint } from '../../hooks/use-floating';
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect';
import { usePresence } from '../../hooks/use-presence';
import { getItems, useRovingFocus } from '../../hooks/use-roving-focus';
import type { Align, Side } from '../../lib/floating';
import { cn, composeRefs } from '../../lib/utils';
import { CheckIcon, ChevronRightIcon } from '../icons';
import { Portal } from './portal';
import { Slot } from './slot';

export type FocusTarget = 'first' | 'last' | 'content';

type LevelContextValue = {
  closeAll: () => void;
  activeSub: string | null;
  openSub: (id: string | null) => void;
  scheduleCloseSub: () => void;
  cancelCloseSub: () => void;
};

const LevelContext = createContext<LevelContextValue | null>(null);

function useLevel() {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error('Menü öğeleri bir menü içeriği içinde kullanılmalı.');
  return ctx;
}

export const menuContentClass = cn(
  'z-50 min-w-[9rem] overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none dv-scrollbar',
  'max-h-(--dv-available-height)',
  'data-[state=open]:animate-dv-zoom-in data-[state=closed]:animate-dv-zoom-out',
);

const itemClass = cn(
  'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none',
  'focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
);

/* --------------------------------------------------------------- content */

export type MenuContentBaseProps = Omit<ComponentProps<'div'>, 'onKeyDown'> & {
  open: boolean;
  onClose: (reason: 'escape' | 'outside' | 'select' | 'tab' | 'left') => void;
  referenceRef?: RefObject<HTMLElement | null>;
  point?: VirtualPoint | null;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  focusOnOpen?: FocusTarget;
  closeAll?: () => void;
  isSub?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  /** Dış tıklamada içeride sayılacak ek öğeler (tetikleyici vb.). */
  insideRefs?: Array<RefObject<HTMLElement | null>>;
};

export function MenuContentBase({
  open,
  onClose,
  referenceRef,
  point,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  alignOffset = 0,
  focusOnOpen = 'content',
  closeAll,
  isSub = false,
  className,
  children,
  onKeyDown,
  insideRefs = [],
  ref,
  ...props
}: MenuContentBaseProps) {
  const present = usePresence(open, 120);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const floating = useFloating({ open, point, side, align, sideOffset, alignOffset });
  const roving = useRovingFocus(contentRef);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const closeTimer = useRef(0);

  useIsomorphicLayoutEffect(() => {
    if (referenceRef) floating.referenceRef.current = referenceRef.current;
  });

  useEffect(() => {
    if (!open) setActiveSub(null);
  }, [open]);

  useDismissableLayer(open, [contentRef, ...(referenceRef ? [referenceRef] : []), ...insideRefs], (reason) => onClose(reason));

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const el = contentRef.current;
      if (!el) return;
      const items = getItems(el);
      const target = focusOnOpen === 'first' ? items[0] : focusOnOpen === 'last' ? items[items.length - 1] : undefined;
      (target ?? el).focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const close = closeAll ?? (() => onClose('select'));

  if (!present) return null;

  return (
    <LevelContext.Provider
      value={{
        closeAll: close,
        activeSub,
        openSub: (id) => {
          window.clearTimeout(closeTimer.current);
          setActiveSub(id);
        },
        scheduleCloseSub: () => {
          window.clearTimeout(closeTimer.current);
          closeTimer.current = window.setTimeout(() => setActiveSub(null), 150);
        },
        cancelCloseSub: () => window.clearTimeout(closeTimer.current),
      }}
    >
      <Portal>
        <div
          role="menu"
          tabIndex={-1}
          aria-orientation="vertical"
          data-slot={isSub ? 'menu-sub-content' : 'menu-content'}
          data-dv-layer=""
          data-state={open ? 'open' : 'closed'}
          data-side={floating.side}
          ref={composeRefs(ref, contentRef, floating.setFloating)}
          style={floating.style}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === 'Tab') {
              event.preventDefault();
              onClose('tab');
              return;
            }
            if (isSub && event.key === 'ArrowLeft') {
              event.preventDefault();
              event.stopPropagation();
              onClose('left');
              return;
            }
            roving(event);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse' && contentRef.current?.contains(document.activeElement)) {
              contentRef.current.focus({ preventScroll: true });
            }
          }}
          className={cn(menuContentClass, className)}
          {...props}
        >
          {children}
        </div>
      </Portal>
    </LevelContext.Provider>
  );
}

/* ------------------------------------------------------------------ items */

type MenuItemProps = Omit<ComponentProps<'div'>, 'onSelect'> & {
  onSelect?: (event: Event | MouseEvent) => void;
  disabled?: boolean;
  inset?: boolean;
  variant?: 'default' | 'destructive';
  textValue?: string;
  /** Prop'ları tek çocuğa aktarır (ör. `<a href>`). */
  asChild?: boolean;
};

function useItemHandlers(disabled: boolean, onActivate: (event: MouseEvent<HTMLElement>) => void) {
  const level = useLevel();
  return {
    tabIndex: -1,
    'data-dv-item': '',
    'data-disabled': disabled || undefined,
    'aria-disabled': disabled || undefined,
    onClick: (event: MouseEvent<HTMLElement>) => {
      if (disabled) return;
      onActivate(event);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        (event.currentTarget as HTMLElement).click();
      }
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'mouse') return;
      level.scheduleCloseSub();
      if (!disabled && document.activeElement !== event.currentTarget) event.currentTarget.focus({ preventScroll: true });
    },
  };
}

export function MenuItem({ onSelect, disabled = false, inset, variant = 'default', textValue, asChild, className, ...props }: MenuItemProps) {
  const level = useLevel();
  const handlers = useItemHandlers(disabled, (event) => {
    onSelect?.(event);
    if (!event.defaultPrevented) level.closeAll();
  });
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      role="menuitem"
      data-slot="menu-item"
      data-variant={variant}
      data-text-value={textValue}
      className={cn(
        itemClass,
        inset && 'pl-8',
        variant === 'destructive' &&
          'text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg:not([class*=text-])]:text-destructive',
        className,
      )}
      {...handlers}
      {...(props as object)}
    />
  );
}

type CheckboxItemProps = Omit<MenuItemProps, 'asChild' | 'variant'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Seçimden sonra menü açık kalsın. Varsayılan: true */
  keepOpen?: boolean;
};

export function MenuCheckboxItem({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onSelect,
  keepOpen = true,
  disabled = false,
  className,
  children,
  ...props
}: CheckboxItemProps) {
  const level = useLevel();
  const [checked, setChecked] = useControllableState({ value: checkedProp, defaultValue: defaultChecked, onChange: onCheckedChange });
  const handlers = useItemHandlers(disabled, (event) => {
    onSelect?.(event);
    setChecked(!checked);
    if (!keepOpen && !event.defaultPrevented) level.closeAll();
  });
  return (
    <div
      role="menuitemcheckbox"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      data-slot="menu-checkbox-item"
      className={cn(itemClass, 'pl-8', className)}
      {...handlers}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        {checked && <CheckIcon className="size-4 text-foreground" />}
      </span>
      {children}
    </div>
  );
}

const RadioContext = createContext<{ value: string; setValue: (v: string) => void } | null>(null);

export function MenuRadioGroup({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  ...props
}: Omit<ComponentProps<'div'>, 'defaultValue'> & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void }) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  return (
    <RadioContext.Provider value={{ value, setValue }}>
      <div role="group" {...props} />
    </RadioContext.Provider>
  );
}

export function MenuRadioItem({
  value,
  disabled = false,
  onSelect,
  className,
  children,
  ...props
}: Omit<MenuItemProps, 'asChild' | 'variant'> & { value: string }) {
  const radio = useContext(RadioContext);
  const checked = radio?.value === value;
  const handlers = useItemHandlers(disabled, (event) => {
    onSelect?.(event);
    radio?.setValue(value);
  });
  return (
    <div
      role="menuitemradio"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      data-slot="menu-radio-item"
      className={cn(itemClass, 'pl-8', className)}
      {...handlers}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        {checked && <span className="size-2 rounded-full bg-foreground" />}
      </span>
      {children}
    </div>
  );
}

export function MenuLabel({ className, inset, ...props }: ComponentProps<'div'> & { inset?: boolean }) {
  return <div data-slot="menu-label" className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', inset && 'pl-8', className)} {...props} />;
}

export function MenuSeparator({ className, ...props }: ComponentProps<'div'>) {
  return <div role="separator" data-slot="menu-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}

export function MenuGroup(props: ComponentProps<'div'>) {
  return <div role="group" data-slot="menu-group" {...props} />;
}

export function MenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="menu-shortcut" className={cn('ml-auto pl-4 text-xs tracking-widest text-muted-foreground', className)} {...props} />;
}

/* -------------------------------------------------------------- sub menus */

type SubContextValue = {
  id: string;
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  focusTarget: RefObject<FocusTarget>;
  setOpen: (open: boolean, focus?: FocusTarget) => void;
};

const SubContext = createContext<SubContextValue | null>(null);

export function MenuSub({ children }: { children: ReactNode }) {
  const level = useLevel();
  const id = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const focusTarget = useRef<FocusTarget>('content');
  const open = level.activeSub === id;
  return (
    <SubContext.Provider
      value={{
        id,
        open,
        triggerRef,
        focusTarget,
        setOpen: (next, focus = 'content') => {
          focusTarget.current = focus;
          level.openSub(next ? id : null);
        },
      }}
    >
      {children}
    </SubContext.Provider>
  );
}

export function MenuSubTrigger({ className, inset, disabled = false, children, ...props }: ComponentProps<'div'> & { inset?: boolean; disabled?: boolean }) {
  const sub = useContext(SubContext);
  if (!sub) throw new Error('MenuSubTrigger, MenuSub içinde kullanılmalı.');
  return (
    <div
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={sub.open}
      tabIndex={-1}
      data-dv-item=""
      data-disabled={disabled || undefined}
      data-state={sub.open ? 'open' : 'closed'}
      data-slot="menu-sub-trigger"
      ref={sub.triggerRef as RefObject<HTMLDivElement>}
      onClick={() => !disabled && sub.setOpen(true)}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse' || disabled) return;
        if (document.activeElement !== event.currentTarget) event.currentTarget.focus({ preventScroll: true });
        if (!sub.open) sub.setOpen(true);
      }}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          sub.setOpen(true, 'first');
        }
      }}
      className={cn(itemClass, 'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground', inset && 'pl-8', className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </div>
  );
}

export function MenuSubContent({ className, ...props }: ComponentProps<'div'>) {
  const sub = useContext(SubContext);
  const level = useLevel();
  if (!sub) throw new Error('MenuSubContent, MenuSub içinde kullanılmalı.');
  return (
    <MenuContentBase
      isSub
      open={sub.open}
      referenceRef={sub.triggerRef}
      side="right"
      align="start"
      sideOffset={2}
      alignOffset={-5}
      focusOnOpen={sub.focusTarget.current}
      closeAll={level.closeAll}
      onPointerEnter={level.cancelCloseSub}
      onClose={(reason) => {
        sub.setOpen(false);
        if (reason === 'escape' || reason === 'left') sub.triggerRef.current?.focus();
        if (reason === 'tab') level.closeAll();
      }}
      className={cn('shadow-lg', className)}
      {...props}
    />
  );
}
