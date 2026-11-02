/**
 * Klavye ile aranabilen komut / hızlı işlem listesi. Odak arama kutusunda
 * kalır; ok tuşları etkin öğeyi değiştirir, Enter seçer.
 *
 * @example
 * <Command label="Hızlı işlemler">
 *   <CommandInput placeholder="Komut veya sayfa ara..." />
 *   <CommandList>
 *     <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
 *     <CommandGroup heading="Sayfalar">
 *       <CommandItem onSelect={() => go('/siparisler')}>Siparişler</CommandItem>
 *       <CommandItem keywords={['müşteri', 'kullanıcı']} onSelect={...}>Müşteriler</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 *
 * // ⌘K ile açılan pencere
 * <CommandDialog open={open} onOpenChange={setOpen}>...</CommandDialog>
 */
import {
  createContext,
  isValidElement,
  useContext,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect';
import { cn } from '../../lib/utils';
import { SearchIcon } from '../icons';
import { Dialog, DialogDescription, DialogPopup, DialogTitle, type DialogProps } from './dialog';

type CommandContextValue = {
  search: string;
  setSearch: (value: string) => void;
  active: string | null;
  setActive: (id: string | null) => void;
  listRef: RefObject<HTMLDivElement | null>;
  listId: string;
  filter: (text: string, search: string) => boolean;
  shouldFilter: boolean;
  visibleCount: number;
};

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommand() {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error('Command bileşenleri <Command> içinde kullanılmalı.');
  return ctx;
}

const normalize = (value: string) =>
  value
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i');

/** Aramadaki her kelime metinde geçiyorsa eşleşir; Türkçe karakterlere duyarsız. */
export function defaultCommandFilter(text: string, search: string): boolean {
  const haystack = normalize(text);
  return normalize(search)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

type CommandProps = ComponentProps<'div'> & {
  label?: string;
  filter?: (text: string, search: string) => boolean;
  /** false: filtrelemeyi siz yaparsınız (sunucu araması vb.). */
  shouldFilter?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
};

const ITEM = '[data-command-item]:not([data-disabled])';

/** JSX ağacındaki düz metni toplar (ikon + metin içeren öğeler için). */
function nodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join(' ');
  if (isValidElement(node)) return nodeText((node.props as { children?: ReactNode }).children);
  return '';
}

export function Command({
  label = 'Komut menüsü',
  filter = defaultCommandFilter,
  shouldFilter = true,
  search: searchProp,
  onSearchChange,
  className,
  children,
  ...props
}: CommandProps) {
  const [innerSearch, setInnerSearch] = useState('');
  const search = searchProp ?? innerSearch;
  const [active, setActive] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const listId = `command-${useId().replace(/:/g, '')}`;

  useIsomorphicLayoutEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>(ITEM) ?? []);
    setVisibleCount(listRef.current?.querySelectorAll('[data-command-item]').length ?? 0);
    if (!items.some((el) => el.id === active)) setActive(items[0]?.id ?? null);
  });

  return (
    <CommandContext.Provider
      value={{
        search,
        setSearch: (value) => {
          setInnerSearch(value);
          onSearchChange?.(value);
        },
        active,
        setActive,
        listRef,
        listId,
        filter,
        shouldFilter,
        visibleCount,
      }}
    >
      <div
        aria-label={label}
        data-slot="command"
        className={cn('flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground', className)}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

export function CommandInput({ className, onKeyDown, ...props }: Omit<ComponentProps<'input'>, 'value' | 'onChange'>) {
  const ctx = useCommand();

  const move = (delta: number | 'first' | 'last') => {
    const items = Array.from(ctx.listRef.current?.querySelectorAll<HTMLElement>(ITEM) ?? []);
    if (items.length === 0) return;
    const index = items.findIndex((el) => el.id === ctx.active);
    const next =
      delta === 'first' ? 0 : delta === 'last' ? items.length - 1 : (index + delta + items.length) % items.length;
    ctx.setActive(items[next].id);
    items[next].scrollIntoView({ block: 'nearest' });
  };

  return (
    <div data-slot="command-input-wrapper" className="flex h-11 items-center gap-2 border-b px-3">
      <SearchIcon className="size-4 opacity-50" />
      <input
        role="combobox"
        aria-expanded
        aria-controls={ctx.listId}
        aria-activedescendant={ctx.active ?? undefined}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        data-slot="command-input"
        value={ctx.search}
        onChange={(event) => ctx.setSearch(event.target.value)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === 'ArrowDown') move(1);
          else if (event.key === 'ArrowUp') move(-1);
          else if (event.key === 'Home' && event.ctrlKey) move('first');
          else if (event.key === 'End' && event.ctrlKey) move('last');
          else if (event.key === 'Enter' && ctx.active) {
            document.getElementById(ctx.active)?.click();
          } else return;
          event.preventDefault();
        }}
        className={cn('flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50', className)}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, ...props }: ComponentProps<'div'>) {
  const ctx = useCommand();
  return (
    <div
      id={ctx.listId}
      role="listbox"
      ref={ctx.listRef}
      data-slot="command-list"
      className={cn('max-h-80 scroll-py-1 overflow-x-hidden overflow-y-auto p-1 dv-scrollbar', className)}
      {...props}
    />
  );
}

export function CommandEmpty({ className, ...props }: ComponentProps<'div'>) {
  const ctx = useCommand();
  if (ctx.visibleCount > 0) return null;
  return <div role="presentation" data-slot="command-empty" className={cn('py-6 text-center text-sm text-muted-foreground', className)} {...props} />;
}

export function CommandGroup({ heading, className, children, ...props }: ComponentProps<'div'> & { heading?: ReactNode }) {
  const headingId = `cg-${useId().replace(/:/g, '')}`;
  return (
    <div
      role="group"
      aria-labelledby={heading ? headingId : undefined}
      data-slot="command-group"
      className={cn('overflow-hidden p-1 text-foreground [&:not(:has([data-command-item]))]:hidden', className)}
      {...props}
    >
      {heading && (
        <div id={headingId} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

export function CommandSeparator({ className, alwaysRender, ...props }: ComponentProps<'div'> & { alwaysRender?: boolean }) {
  const ctx = useCommand();
  if (ctx.search && !alwaysRender) return null;
  return <div role="separator" data-slot="command-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}

type CommandItemProps = Omit<ComponentProps<'div'>, 'onSelect'> & {
  /** Arama için metin; verilmezse çocukların metni kullanılır. */
  value?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
  /** Arama ne olursa olsun göster. */
  forceMount?: boolean;
};

export function CommandItem({ value, keywords = [], disabled, onSelect, forceMount, className, children, ...props }: CommandItemProps) {
  const ctx = useCommand();
  const id = `ci-${useId().replace(/:/g, '')}`;
  const text = value ?? nodeText(children);

  const visible = forceMount || !ctx.shouldFilter || !ctx.search || ctx.filter([text, ...keywords].join(' '), ctx.search);
  if (!visible) return null;
  const active = ctx.active === id;

  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      aria-disabled={disabled || undefined}
      data-command-item=""
      data-selected={active || undefined}
      data-disabled={disabled || undefined}
      data-slot="command-item"
      onPointerMove={() => !disabled && !active && ctx.setActive(id)}
      onClick={() => !disabled && onSelect?.()}
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none',
        'data-selected:bg-accent data-selected:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CommandShortcut({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="command-shortcut" className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />;
}

type CommandDialogProps = DialogProps & {
  title?: string;
  description?: string;
  className?: string;
  commandProps?: Omit<CommandProps, 'children'>;
};

export function CommandDialog({
  title = 'Komut menüsü',
  description = 'Bir komut veya sayfa arayın',
  className,
  commandProps,
  children,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogPopup
        className={cn(
          'top-[15%] left-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-lg border bg-popover p-0 shadow-lg',
          'data-[state=open]:animate-dv-zoom-in data-[state=closed]:animate-dv-zoom-out',
          className,
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command {...commandProps}>{children}</Command>
      </DialogPopup>
    </Dialog>
  );
}
