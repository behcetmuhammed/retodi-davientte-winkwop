/**
 * Site / bölüm navigasyonu: düz bağlantılar ve üzerine gelince açılan
 * içerik panelleri (mega menü). Bağlantılar düz `<a>`; vitrin sayfa
 * yenilemeden gezinmeyi kendisi yapar.
 *
 * @example
 * <NavigationMenu>
 *   <NavigationMenuList>
 *     <NavigationMenuItem value="products">
 *       <NavigationMenuTrigger>Ürünler</NavigationMenuTrigger>
 *       <NavigationMenuContent className="w-[480px] grid-cols-2">
 *         <NavigationMenuLink href="/kategori/ofis" title="Ofis mobilyası" description="Masa, sandalye, dolap" />
 *         <NavigationMenuLink href="/kategori/aydinlatma" title="Aydınlatma" />
 *       </NavigationMenuContent>
 *     </NavigationMenuItem>
 *     <NavigationMenuItem>
 *       <NavigationMenuLink href="/iletisim" active={path === '/iletisim'}>İletişim</NavigationMenuLink>
 *     </NavigationMenuItem>
 *   </NavigationMenuList>
 * </NavigationMenu>
 */
import { createContext, useContext, useEffect, useId, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from 'react';
import { useDismissableLayer } from '../../hooks/use-dismissable-layer';
import { useRovingFocus } from '../../hooks/use-roving-focus';
import { cn, composeRefs } from '../../lib/utils';
import { ChevronDownIcon } from '../icons';

type NavContextValue = {
  value: string | null;
  setValue: (value: string | null) => void;
  schedule: (value: string | null, delay: number) => void;
  rootRef: RefObject<HTMLElement | null>;
};

const NavContext = createContext<NavContextValue | null>(null);
const ItemContext = createContext<{ value: string; triggerRef: RefObject<HTMLButtonElement | null>; contentId: string } | null>(null);

function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('NavigationMenu bileşenleri <NavigationMenu> içinde kullanılmalı.');
  return ctx;
}

export function NavigationMenu({ className, ref, children, ...props }: ComponentProps<'nav'>) {
  const [value, setValue] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useDismissableLayer(value !== null, [rootRef], () => setValue(null));

  return (
    <NavContext.Provider
      value={{
        value,
        setValue: (next) => {
          window.clearTimeout(timer.current);
          setValue(next);
        },
        schedule: (next, delay) => {
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setValue(next), delay);
        },
        rootRef,
      }}
    >
      <nav
        aria-label={props['aria-label'] ?? 'Ana menü'}
        data-slot="navigation-menu"
        ref={composeRefs(ref, rootRef)}
        className={cn('relative flex max-w-max flex-1 items-center', className)}
        {...props}
      >
        {children}
      </nav>
    </NavContext.Provider>
  );
}

export function NavigationMenuList({ className, ref, ...props }: ComponentProps<'ul'>) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const roving = useRovingFocus(listRef, {
    orientation: 'horizontal',
    typeahead: false,
    selector: ':scope > li > [data-slot=navigation-menu-trigger], :scope > li > [data-slot=navigation-menu-link]',
  });
  return (
    <ul
      data-slot="navigation-menu-list"
      ref={composeRefs(ref, listRef)}
      onKeyDown={(event) => {
        const slot = (event.target as HTMLElement).dataset.slot;
        if (slot === 'navigation-menu-trigger' || slot === 'navigation-menu-link') roving(event);
      }}
      className={cn('m-0 flex flex-1 list-none items-center justify-center gap-1 p-0', className)}
      {...props}
    />
  );
}

export function NavigationMenuItem({ value, className, ...props }: ComponentProps<'li'> & { value?: string }) {
  const nav = useNav();
  const autoValue = useId();
  const itemValue = value ?? autoValue;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  return (
    <ItemContext.Provider value={{ value: itemValue, triggerRef, contentId: `nav-${autoValue.replace(/:/g, '')}` }}>
      <li
        data-slot="navigation-menu-item"
        onPointerLeave={(event) => event.pointerType === 'mouse' && nav.value === itemValue && nav.schedule(null, 200)}
        className={cn('relative', className)}
        {...props}
      />
    </ItemContext.Provider>
  );
}

export const navigationMenuTriggerStyle = cn(
  'inline-flex h-9 items-center justify-center gap-1 rounded-md px-3 text-sm font-medium transition-colors outline-none',
  'hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring',
  'data-[state=open]:bg-accent/70 data-[active=true]:text-foreground data-[active=true]:bg-accent/50',
);

export function NavigationMenuTrigger({ className, children, ...props }: ComponentProps<'button'>) {
  const nav = useNav();
  const item = useContext(ItemContext);
  if (!item) throw new Error('NavigationMenuTrigger, NavigationMenuItem içinde kullanılmalı.');
  const open = nav.value === item.value;
  return (
    <button
      type="button"
      ref={item.triggerRef}
      aria-expanded={open}
      aria-controls={item.contentId}
      data-slot="navigation-menu-trigger"
      data-state={open ? 'open' : 'closed'}
      onPointerEnter={(event) => event.pointerType === 'mouse' && nav.schedule(item.value, nav.value === null ? 150 : 0)}
      onClick={() => nav.setValue(open ? null : item.value)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' && open) {
          event.preventDefault();
          document.getElementById(item.contentId)?.querySelector<HTMLElement>('a,button')?.focus();
        }
      }}
      className={cn(navigationMenuTriggerStyle, 'group', className)}
      {...props}
    >
      {children}
      <ChevronDownIcon aria-hidden className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </button>
  );
}

export function NavigationMenuContent({ className, children, align = 'start', ...props }: ComponentProps<'div'> & { align?: 'start' | 'center' | 'end' }) {
  const nav = useNav();
  const item = useContext(ItemContext);
  if (!item) throw new Error('NavigationMenuContent, NavigationMenuItem içinde kullanılmalı.');
  const open = nav.value === item.value;
  return (
    <div
      id={item.contentId}
      data-slot="navigation-menu-content"
      data-state={open ? 'open' : 'closed'}
      hidden={!open}
      onPointerEnter={() => nav.setValue(item.value)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          nav.setValue(null);
          item.triggerRef.current?.focus();
        }
      }}
      className={cn(
        'absolute top-full z-50 mt-1.5 grid gap-1 rounded-lg border bg-popover p-2 text-popover-foreground shadow-md',
        'data-[state=open]:animate-dv-zoom-in',
        align === 'start' && 'left-0',
        align === 'center' && 'left-1/2 -translate-x-1/2',
        align === 'end' && 'right-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type LinkProps = ComponentProps<'a'> & {
  active?: boolean;
  /** Panel içi zengin bağlantı: başlık + açıklama. */
  title?: string;
  description?: ReactNode;
};

export function NavigationMenuLink({ active, title, description, className, children, onClick, ...props }: LinkProps) {
  const nav = useNav();
  const inPanel = Boolean(title);
  return (
    <a
      data-slot="navigation-menu-link"
      data-active={active || undefined}
      aria-current={active ? 'page' : undefined}
      onClick={(event) => {
        onClick?.(event);
        nav.setValue(null);
      }}
      className={cn(
        inPanel
          ? 'flex flex-col gap-1 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring'
          : navigationMenuTriggerStyle,
        className,
      )}
      {...props}
    >
      {inPanel ? (
        <>
          <span className="font-medium">{title}</span>
          {description && <span className="line-clamp-2 text-[0.8125rem] leading-snug text-muted-foreground">{description}</span>}
          {children}
        </>
      ) : (
        children
      )}
    </a>
  );
}
