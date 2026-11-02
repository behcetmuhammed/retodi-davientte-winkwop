/**
 * Uygulama içi yatay menü çubuğu. Bir menü açıkken diğer başlıkların üzerine
 * gelmek veya sağ/sol ok tuşları menüler arasında geçiş yapar.
 *
 * @example
 * <Menubar>
 *   <MenubarMenu value="file">
 *     <MenubarTrigger>Dosya</MenubarTrigger>
 *     <MenubarContent>
 *       <MenubarItem>Yeni <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
 *       <MenubarSeparator />
 *       <MenubarItem>Yazdır</MenubarItem>
 *     </MenubarContent>
 *   </MenubarMenu>
 *   <MenubarMenu value="view">...</MenubarMenu>
 * </Menubar>
 */
import { createContext, useContext, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from 'react';
import { useRovingFocus } from '../../hooks/use-roving-focus';
import { cn, composeRefs } from '../../lib/utils';
import {
  MenuCheckboxItem,
  MenuContentBase,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  type FocusTarget,
} from './menu';

type BarContextValue = {
  active: string | null;
  focusTarget: FocusTarget;
  open: (value: string | null, focus?: FocusTarget) => void;
  barRef: RefObject<HTMLDivElement | null>;
};

const BarContext = createContext<BarContextValue | null>(null);
const MenuContext = createContext<{ value: string; triggerRef: RefObject<HTMLButtonElement | null> } | null>(null);

function useBar() {
  const ctx = useContext(BarContext);
  if (!ctx) throw new Error('Menubar bileşenleri <Menubar> içinde kullanılmalı.');
  return ctx;
}

export function Menubar({ className, ref, ...props }: ComponentProps<'div'>) {
  const [active, setActive] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<FocusTarget>('content');
  const barRef = useRef<HTMLDivElement | null>(null);
  const roving = useRovingFocus(barRef, { orientation: 'horizontal', typeahead: false, selector: '[data-slot=menubar-trigger]:not(:disabled)' });

  return (
    <BarContext.Provider
      value={{
        active,
        focusTarget,
        barRef,
        open: (value, focus = 'content') => {
          setFocusTarget(focus);
          setActive(value);
        },
      }}
    >
      <div
        role="menubar"
        data-slot="menubar"
        ref={composeRefs(ref, barRef)}
        onKeyDown={(event) => {
          if ((event.target as HTMLElement).dataset.slot === 'menubar-trigger') roving(event);
        }}
        className={cn('flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs', className)}
        {...props}
      />
    </BarContext.Provider>
  );
}

export function MenubarMenu({ value, children }: { value: string; children: ReactNode }) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  return <MenuContext.Provider value={{ value, triggerRef }}>{children}</MenuContext.Provider>;
}

function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('MenubarTrigger/MenubarContent, <MenubarMenu> içinde kullanılmalı.');
  return ctx;
}

function siblingTrigger(bar: HTMLElement | null, current: string, delta: number) {
  const triggers = Array.from(bar?.querySelectorAll<HTMLElement>('[data-slot=menubar-trigger]:not(:disabled)') ?? []);
  const index = triggers.findIndex((el) => el.dataset.value === current);
  return triggers[(index + delta + triggers.length) % triggers.length];
}

export function MenubarTrigger({ className, ...props }: ComponentProps<'button'>) {
  const bar = useBar();
  const menu = useMenu();
  const open = bar.active === menu.value;
  return (
    <button
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={open}
      data-slot="menubar-trigger"
      data-value={menu.value}
      data-state={open ? 'open' : 'closed'}
      tabIndex={bar.active === null || open ? 0 : -1}
      ref={menu.triggerRef}
      onClick={() => bar.open(open ? null : menu.value)}
      onPointerEnter={() => {
        if (bar.active !== null && !open) {
          bar.open(menu.value);
          menu.triggerRef.current?.focus();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          bar.open(menu.value, 'first');
        }
      }}
      className={cn(
        'flex items-center rounded-sm px-2.5 py-1 text-sm font-medium outline-none select-none',
        'hover:bg-accent focus-visible:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring data-[state=open]:bg-accent',
        className,
      )}
      {...props}
    />
  );
}

export function MenubarContent({ align = 'start', ...props }: ComponentProps<'div'> & { align?: 'start' | 'center' | 'end' }) {
  const bar = useBar();
  const menu = useMenu();
  const open = bar.active === menu.value;

  const switchTo = (delta: number) => {
    const next = siblingTrigger(bar.barRef.current, menu.value, delta);
    if (!next?.dataset.value) return;
    bar.open(next.dataset.value, 'first');
    next.focus();
  };

  return (
    <MenuContentBase
      open={open}
      referenceRef={menu.triggerRef}
      insideRefs={[bar.barRef]}
      side="bottom"
      align={align}
      sideOffset={8}
      alignOffset={-4}
      focusOnOpen={bar.focusTarget}
      onKeyDown={(event) => {
        const target = event.target as HTMLElement;
        if (event.key === 'ArrowRight' && target.dataset.slot !== 'menu-sub-trigger') {
          event.preventDefault();
          switchTo(1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          switchTo(-1);
        }
      }}
      onClose={(reason) => {
        if (bar.active !== menu.value) return;
        bar.open(null);
        if (reason !== 'outside') menu.triggerRef.current?.focus();
      }}
      {...props}
    />
  );
}

export const MenubarItem = MenuItem;
export const MenubarCheckboxItem = MenuCheckboxItem;
export const MenubarRadioGroup = MenuRadioGroup;
export const MenubarRadioItem = MenuRadioItem;
export const MenubarLabel = MenuLabel;
export const MenubarSeparator = MenuSeparator;
export const MenubarGroup = MenuGroup;
export const MenubarShortcut = MenuShortcut;
export const MenubarSub = MenuSub;
export const MenubarSubTrigger = MenuSubTrigger;
export const MenubarSubContent = MenuSubContent;
