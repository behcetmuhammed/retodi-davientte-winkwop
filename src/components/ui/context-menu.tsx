/**
 * Sağ tıklamayla (veya klavyede Menü tuşu / Shift+F10 ile) açılan menü.
 * Dokunmatik cihazlarda uzun basma ile açılır.
 *
 * @example
 * <ContextMenu>
 *   <ContextMenuTrigger className="rounded-lg border border-dashed p-10">Sağ tıklayın</ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem>Yeniden adlandır</ContextMenuItem>
 *     <ContextMenuItem variant="destructive">Sil</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 */
import { createContext, useContext, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import type { VirtualPoint } from '../../hooks/use-floating';
import { cn } from '../../lib/utils';
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
import { Slot } from './slot';

type ContextValue = {
  point: VirtualPoint | null;
  openAt: (point: VirtualPoint, focus?: FocusTarget) => void;
  close: () => void;
  focusTarget: FocusTarget;
  disabled?: boolean;
};

const ContextMenuContext = createContext<ContextValue | null>(null);

function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error('ContextMenu bileşenleri <ContextMenu> içinde kullanılmalı.');
  return ctx;
}

export function ContextMenu({ children, onOpenChange, disabled }: { children: ReactNode; onOpenChange?: (open: boolean) => void; disabled?: boolean }) {
  const [point, setPoint] = useState<VirtualPoint | null>(null);
  const [focusTarget, setFocusTarget] = useState<FocusTarget>('content');
  return (
    <ContextMenuContext.Provider
      value={{
        point,
        focusTarget,
        disabled,
        openAt: (next, focus = 'content') => {
          setFocusTarget(focus);
          setPoint(next);
          onOpenChange?.(true);
        },
        close: () => {
          setPoint(null);
          onOpenChange?.(false);
        },
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

export function ContextMenuTrigger({ asChild, className, onContextMenu, onKeyDown, onTouchStart, onTouchEnd, onTouchMove, ...props }: ComponentProps<'div'> & { asChild?: boolean }) {
  const ctx = useContextMenu();
  const longPress = useRef(0);
  const Comp = asChild ? Slot : 'div';
  const cancelLongPress = () => window.clearTimeout(longPress.current);

  return (
    <Comp
      data-slot="context-menu-trigger"
      data-state={ctx.point ? 'open' : 'closed'}
      onContextMenu={(event: React.MouseEvent<HTMLDivElement>) => {
        onContextMenu?.(event);
        if (ctx.disabled || event.defaultPrevented) return;
        event.preventDefault();
        ctx.openAt({ x: event.clientX, y: event.clientY });
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (ctx.disabled) return;
        if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          ctx.openAt({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, 'first');
        }
      }}
      onTouchStart={(event: React.TouchEvent<HTMLDivElement>) => {
        onTouchStart?.(event);
        const touch = event.touches[0];
        cancelLongPress();
        longPress.current = window.setTimeout(() => ctx.openAt({ x: touch.clientX, y: touch.clientY }), 600);
      }}
      onTouchEnd={(event: React.TouchEvent<HTMLDivElement>) => {
        onTouchEnd?.(event);
        cancelLongPress();
      }}
      onTouchMove={(event: React.TouchEvent<HTMLDivElement>) => {
        onTouchMove?.(event);
        cancelLongPress();
      }}
      className={cn('select-none [-webkit-touch-callout:none]', className)}
      {...(props as object)}
    />
  );
}

export function ContextMenuContent(props: ComponentProps<'div'>) {
  const ctx = useContextMenu();
  return (
    <MenuContentBase
      open={ctx.point !== null}
      point={ctx.point}
      side="bottom"
      align="start"
      sideOffset={2}
      focusOnOpen={ctx.focusTarget}
      onClose={ctx.close}
      {...props}
    />
  );
}

export const ContextMenuItem = MenuItem;
export const ContextMenuCheckboxItem = MenuCheckboxItem;
export const ContextMenuRadioGroup = MenuRadioGroup;
export const ContextMenuRadioItem = MenuRadioItem;
export const ContextMenuLabel = MenuLabel;
export const ContextMenuSeparator = MenuSeparator;
export const ContextMenuGroup = MenuGroup;
export const ContextMenuShortcut = MenuShortcut;
export const ContextMenuSub = MenuSub;
export const ContextMenuSubTrigger = MenuSubTrigger;
export const ContextMenuSubContent = MenuSubContent;
