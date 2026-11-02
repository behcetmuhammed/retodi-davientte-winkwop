/**
 * Tıklanınca açılan işlem menüsü.
 *
 * @example
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <IconButton aria-label="İşlemler"><MoreHorizontalIcon /></IconButton>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent align="end">
 *     <DropdownMenuLabel>Sipariş #1042</DropdownMenuLabel>
 *     <DropdownMenuItem onSelect={edit}>Düzenle <DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
 *     <DropdownMenuSub>
 *       <DropdownMenuSubTrigger>Durum</DropdownMenuSubTrigger>
 *       <DropdownMenuSubContent>
 *         <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
 *           <DropdownMenuRadioItem value="pending">Beklemede</DropdownMenuRadioItem>
 *           <DropdownMenuRadioItem value="shipped">Kargoda</DropdownMenuRadioItem>
 *         </DropdownMenuRadioGroup>
 *       </DropdownMenuSubContent>
 *     </DropdownMenuSub>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem variant="destructive" onSelect={remove}><TrashIcon /> Sil</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 */
import { createContext, useContext, useId, useRef, type ComponentProps, type ReactNode, type RefObject } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import type { Align, Side } from '../../lib/floating';
import { composeEventHandlers, composeRefs } from '../../lib/utils';
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

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean, focus?: FocusTarget) => void;
  focusTarget: RefObject<FocusTarget>;
  triggerRef: RefObject<HTMLElement | null>;
  contentId: string;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('DropdownMenu bileşenleri <DropdownMenu> içinde kullanılmalı.');
  return ctx;
}

type DropdownMenuProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function DropdownMenu({ open: openProp, defaultOpen = false, onOpenChange, children }: DropdownMenuProps) {
  const [open, setOpenState] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const focusTarget = useRef<FocusTarget>('content');
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = `menu-${useId().replace(/:/g, '')}`;
  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen: (next, focus = 'content') => {
          focusTarget.current = focus;
          setOpenState(next);
        },
        focusTarget,
        triggerRef,
        contentId,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, onClick, onKeyDown, ref, ...props }: ComponentProps<'button'> & { asChild?: boolean }) {
  const ctx = useDropdown();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-haspopup="menu"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.contentId : undefined}
      data-state={ctx.open ? 'open' : 'closed'}
      data-slot="dropdown-menu-trigger"
      ref={composeRefs(ref as never, ctx.triggerRef)}
      onClick={composeEventHandlers(onClick as never, () => ctx.setOpen(!ctx.open))}
      onKeyDown={composeEventHandlers(onKeyDown as never, (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          ctx.setOpen(true, 'first');
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          ctx.setOpen(true, 'last');
        }
      })}
      {...(props as object)}
    />
  );
}

type ContentProps = ComponentProps<'div'> & { side?: Side; align?: Align; sideOffset?: number; alignOffset?: number };

export function DropdownMenuContent({ side = 'bottom', align = 'start', sideOffset = 4, alignOffset, ...props }: ContentProps) {
  const ctx = useDropdown();
  return (
    <MenuContentBase
      id={ctx.contentId}
      open={ctx.open}
      referenceRef={ctx.triggerRef}
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      focusOnOpen={ctx.focusTarget.current}
      onClose={(reason) => {
        ctx.setOpen(false);
        if (reason !== 'outside') ctx.triggerRef.current?.focus();
      }}
      {...props}
    />
  );
}

export const DropdownMenuItem = MenuItem;
export const DropdownMenuCheckboxItem = MenuCheckboxItem;
export const DropdownMenuRadioGroup = MenuRadioGroup;
export const DropdownMenuRadioItem = MenuRadioItem;
export const DropdownMenuLabel = MenuLabel;
export const DropdownMenuSeparator = MenuSeparator;
export const DropdownMenuGroup = MenuGroup;
export const DropdownMenuShortcut = MenuShortcut;
export const DropdownMenuSub = MenuSub;
export const DropdownMenuSubTrigger = MenuSubTrigger;
export const DropdownMenuSubContent = MenuSubContent;
