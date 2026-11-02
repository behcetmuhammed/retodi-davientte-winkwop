/**
 * Yönetim paneli / hesap sayfası yan menüsü. Masaüstünde daraltılabilir
 * (`collapsible="icon"` ise yalnızca ikonlar kalır), mobilde Sheet olarak açılır.
 * Ctrl/⌘ + B ile açılıp kapanır.
 *
 * @example
 * <SidebarProvider>
 *   <Sidebar collapsible="icon">
 *     <SidebarHeader>Davientte</SidebarHeader>
 *     <SidebarContent>
 *       <SidebarGroup>
 *         <SidebarGroupLabel>Hesabım</SidebarGroupLabel>
 *         <SidebarMenu>
 *           <SidebarMenuItem>
 *             <SidebarMenuButton isActive tooltip="Siparişler" asChild>
 *               <a href="/hesap/siparisler"><ShoppingBagIcon /><span>Siparişler</span></a>
 *             </SidebarMenuButton>
 *             <SidebarMenuBadge>3</SidebarMenuBadge>
 *           </SidebarMenuItem>
 *         </SidebarMenu>
 *       </SidebarGroup>
 *     </SidebarContent>
 *     <SidebarFooter>...</SidebarFooter>
 *     <SidebarRail />
 *   </Sidebar>
 *   <SidebarInset>
 *     <header><SidebarTrigger /></header>
 *     ...
 *   </SidebarInset>
 * </SidebarProvider>
 */
import { createContext, use, useCallback, useEffect, useMemo, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useIsMobile } from '../../hooks/use-media-query';
import { cn, composeEventHandlers, variants, type VariantProps } from '../../lib/utils';
import { PanelLeftIcon } from '../icons';
import { Button } from './button';
import { Separator } from './separator';
import { SheetContent, Sheet, SheetTitle, SheetDescription } from './sheet';
import { Skeleton } from './skeleton';
import { Slot } from './slot';
import { Tooltip } from './tooltip';
import { VisuallyHidden } from './visually-hidden';

const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';

type SidebarContextValue = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = use(SidebarContext);
  if (!ctx) throw new Error('useSidebar bir <SidebarProvider> içinde kullanılmalı.');
  return ctx;
}

type ProviderProps = ComponentProps<'div'> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Klavye kısayolu (Ctrl/⌘ + tuş). `false` ile kapatılır. Varsayılan: 'b' */
  shortcut?: string | false;
};

export function SidebarProvider({
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  shortcut = 'b',
  className,
  style,
  ...props
}: ProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });

  const toggleSidebar = useCallback(() => (isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o)), [isMobile, setOpen]);

  useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === shortcut && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shortcut, toggleSidebar]);

  const value = useMemo<SidebarContextValue>(
    () => ({ state: open ? 'expanded' : 'collapsed', open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }),
    [open, setOpen, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext value={value}>
      <div
        data-slot="sidebar-wrapper"
        style={{ '--sidebar-width': SIDEBAR_WIDTH, '--sidebar-width-icon': SIDEBAR_WIDTH_ICON, ...style } as CSSProperties}
        className={cn('group/sidebar-wrapper flex min-h-svh w-full', className)}
        {...props}
      />
    </SidebarContext>
  );
}

type SidebarProps = ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  /** offcanvas: tamamen gizlenir, icon: ikon şeridi kalır, none: daraltılamaz. */
  collapsible?: 'offcanvas' | 'icon' | 'none';
};

export function Sidebar({ side = 'left', variant = 'sidebar', collapsible = 'offcanvas', className, children, ...props }: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div data-slot="sidebar" className={cn('flex h-full w-(--sidebar-width) flex-col bg-muted/40 text-foreground', className)} {...props}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          showCloseButton={false}
          data-slot="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) max-w-[85vw] p-0"
          style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as CSSProperties}
        >
          <VisuallyHidden>
            <SheetTitle>Menü</SheetTitle>
            <SheetDescription>Gezinme menüsü</SheetDescription>
          </VisuallyHidden>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-foreground md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* Akışta yer tutan boşluk */}
      <div
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+--spacing(4))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      />
      <div
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+--spacing(4)+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className={cn(
            'flex h-full w-full flex-col bg-muted/40',
            variant === 'floating' && 'rounded-lg border bg-background shadow-sm',
            variant === 'inset' && 'bg-transparent',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function SidebarTrigger({ className, onClick, ...props }: ComponentProps<typeof Button>) {
  const { toggleSidebar, open, isMobile, openMobile } = useSidebar();
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      aria-label="Menüyü aç/kapat"
      aria-expanded={isMobile ? openMobile : open}
      className={className}
      onClick={composeEventHandlers(onClick, toggleSidebar)}
      {...props}
    >
      <PanelLeftIcon />
    </Button>
  );
}

/** Kenardaki ince şerit: tıklayınca sidebar'ı açar/kapatır. */
export function SidebarRail({ className, ...props }: ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      data-slot="sidebar-rail"
      aria-label="Menüyü aç/kapat"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Menüyü aç/kapat"
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear sm:flex',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 hover:after:bg-border',
        'group-data-[side=left]:-right-4 group-data-[side=right]:left-0',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarInset({ className, ...props }: ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'relative flex w-full min-w-0 flex-1 flex-col bg-background',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sidebar-header" className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sidebar-footer" className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
}

export function SidebarSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator data-slot="sidebar-separator" className={cn('mx-2 w-auto', className)} {...props} />;
}

export function SidebarContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto dv-scrollbar group-data-[collapsible=icon]:overflow-hidden', className)}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sidebar-group" className={cn('relative flex w-full min-w-0 flex-col p-2', className)} {...props} />;
}

export function SidebarGroupLabel({ asChild, className, ...props }: ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      data-slot="sidebar-group-label"
      className={cn(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground outline-none',
        'transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupAction({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      data-slot="sidebar-group-action"
      className={cn(
        'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-muted-foreground outline-none',
        'hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sidebar-group-content" className={cn('w-full text-sm', className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: ComponentProps<'ul'>) {
  return <ul data-slot="sidebar-menu" className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: ComponentProps<'li'>) {
  return <li data-slot="sidebar-menu-item" className={cn('group/menu-item relative', className)} {...props} />;
}

const sidebarMenuButtonVariants = variants({
  base: [
    'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none',
    'transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    'data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground',
    'group-has-data-[slot=sidebar-menu-action]/menu-item:pr-8',
    'group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
    '[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  ].join(' '),
  variants: {
    size: {
      sm: 'h-7 text-xs',
      md: 'h-8 text-sm',
      lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
    },
  },
  defaultVariants: { size: 'md' },
});

type MenuButtonProps = ComponentProps<'button'> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    asChild?: boolean;
    isActive?: boolean;
    /** Sidebar ikon moduna daraltıldığında gösterilen ipucu. */
    tooltip?: ReactNode;
  };

export function SidebarMenuButton({ asChild, isActive = false, size, tooltip, className, ...props }: MenuButtonProps) {
  const { state, isMobile } = useSidebar();
  const Comp = asChild ? Slot : 'button';
  const button = (
    <Comp
      type={asChild ? undefined : 'button'}
      data-slot="sidebar-menu-button"
      data-active={isActive}
      aria-current={isActive ? 'page' : undefined}
      className={cn(sidebarMenuButtonVariants({ size }), className)}
      {...(props as ComponentProps<'button'>)}
    />
  );
  if (!tooltip) return button;
  return (
    <Tooltip content={tooltip} side="right" disabled={state !== 'collapsed' || isMobile}>
      {button}
    </Tooltip>
  );
}

export function SidebarMenuAction({ showOnHover, className, ...props }: ComponentProps<'button'> & { showOnHover?: boolean }) {
  return (
    <button
      type="button"
      data-slot="sidebar-menu-action"
      className={cn(
        'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-muted-foreground outline-none',
        'hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:hidden',
        showOnHover && 'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenuBadge({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={cn(
        'pointer-events-none absolute top-1.5 right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenuSkeleton({ showIcon, className, ...props }: ComponentProps<'div'> & { showIcon?: boolean }) {
  const width = useMemo(() => `${50 + ((Math.random() * 40) | 0)}%`, []);
  return (
    <div data-slot="sidebar-menu-skeleton" className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)} {...props}>
      {showIcon && <Skeleton className="size-4 rounded-md" />}
      <Skeleton className="h-4 flex-1" style={{ maxWidth: width }} suppressHydrationWarning />
    </div>
  );
}

export function SidebarMenuSub({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn('mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden', className)}
      {...props}
    />
  );
}

export function SidebarMenuSubItem({ className, ...props }: ComponentProps<'li'>) {
  return <li data-slot="sidebar-menu-sub-item" className={cn('group/menu-sub-item relative', className)} {...props} />;
}

export function SidebarMenuSubButton({
  asChild,
  isActive,
  size = 'md',
  className,
  ...props
}: ComponentProps<'a'> & { asChild?: boolean; isActive?: boolean; size?: 'sm' | 'md' }) {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-active={isActive}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-muted-foreground outline-none',
        'hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring',
        'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
        size === 'sm' ? 'text-xs' : 'text-sm',
        '[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...(props as ComponentProps<'a'>)}
    />
  );
}
