/**
 * Sekmeler. Ok tuşları ile geçiş; `activationMode="manual"` ise Enter/Space ile seçilir.
 *
 * @example
 * <Tabs defaultValue="aciklama">
 *   <TabsList>
 *     <TabsTrigger value="aciklama">Açıklama</TabsTrigger>
 *     <TabsTrigger value="yorumlar">Yorumlar</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="aciklama">...</TabsContent>
 *   <TabsContent value="yorumlar">...</TabsContent>
 * </Tabs>
 *
 * <TabsList variant="line"> ... </TabsList>   // alt çizgili görünüm
 */
import { createContext, use, useId, useRef, type ComponentProps } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useRovingFocus } from '../../hooks/use-roving-focus';
import { cn, composeEventHandlers } from '../../lib/utils';

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  activationMode: 'automatic' | 'manual';
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);
const ListVariantContext = createContext<'default' | 'line'>('default');

function useTabs() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error('Tabs bileşenleri <Tabs> içinde kullanılmalı.');
  return ctx;
}

const idFor = (base: string, kind: 'trigger' | 'content', value: string) => `${base}-${kind}-${value.replace(/\s+/g, '-')}`;

type TabsProps = Omit<ComponentProps<'div'>, 'defaultValue' | 'dir'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
};

export function Tabs({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  className,
  ...props
}: TabsProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const baseId = useId();
  return (
    <TabsContext value={{ value, setValue, orientation, activationMode, baseId }}>
      <div
        data-slot="tabs"
        data-orientation={orientation}
        className={cn('flex gap-3', orientation === 'horizontal' ? 'flex-col' : 'flex-row', className)}
        {...props}
      />
    </TabsContext>
  );
}

type TabsListProps = ComponentProps<'div'> & { variant?: 'default' | 'line' };

export function TabsList({ variant = 'default', className, onKeyDown, ...props }: TabsListProps) {
  const { orientation } = useTabs();
  const ref = useRef<HTMLDivElement>(null);
  const roving = useRovingFocus(ref, { orientation, typeahead: false, selector: '[role="tab"]:not(:disabled)' });

  return (
    <ListVariantContext value={variant}>
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        data-slot="tabs-list"
        data-variant={variant}
        onKeyDown={composeEventHandlers(onKeyDown, roving)}
        className={cn(
          'inline-flex w-fit shrink-0 text-muted-foreground',
          orientation === 'vertical' ? 'flex-col items-stretch' : 'items-center',
          variant === 'default' && 'gap-1 rounded-lg bg-muted p-1',
          variant === 'line' && (orientation === 'horizontal' ? 'gap-4 border-b' : 'gap-1 border-l'),
          'max-w-full overflow-x-auto dv-scrollbar-none',
          className,
        )}
        {...props}
      />
    </ListVariantContext>
  );
}

type TabsTriggerProps = ComponentProps<'button'> & { value: string };

export function TabsTrigger({ value, className, onClick, onFocus, onKeyDown, disabled, ...props }: TabsTriggerProps) {
  const ctx = useTabs();
  const variant = use(ListVariantContext);
  const selected = ctx.value === value;

  return (
    <button
      type="button"
      role="tab"
      id={idFor(ctx.baseId, 'trigger', value)}
      aria-selected={selected}
      aria-controls={idFor(ctx.baseId, 'content', value)}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-state={selected ? 'active' : 'inactive'}
      data-slot="tabs-trigger"
      onClick={composeEventHandlers(onClick, () => ctx.setValue(value))}
      onFocus={composeEventHandlers(onFocus, () => {
        if (ctx.activationMode === 'automatic' && !selected) ctx.setValue(value);
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          ctx.setValue(value);
        }
      })}
      className={cn(
        'relative inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap outline-none',
        'transition-colors focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variant === 'default' &&
          'h-8 rounded-md px-3 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs',
        variant === 'line' &&
          (ctx.orientation === 'horizontal'
            ? 'h-10 rounded-xs px-0.5 hover:text-foreground data-[state=active]:text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent data-[state=active]:after:bg-foreground'
            : 'h-9 justify-start rounded-xs px-3 hover:text-foreground data-[state=active]:text-foreground after:absolute after:inset-y-0 after:-left-px after:w-0.5 after:bg-transparent data-[state=active]:after:bg-foreground'),
        className,
      )}
      {...props}
    />
  );
}

type TabsContentProps = ComponentProps<'div'> & {
  value: string;
  /** Pasifken de DOM'da (gizli) tutar; form durumunu korumak için. */
  forceMount?: boolean;
};

export function TabsContent({ value, forceMount, className, ...props }: TabsContentProps) {
  const ctx = useTabs();
  const selected = ctx.value === value;
  if (!selected && !forceMount) return null;
  return (
    <div
      role="tabpanel"
      id={idFor(ctx.baseId, 'content', value)}
      aria-labelledby={idFor(ctx.baseId, 'trigger', value)}
      tabIndex={0}
      hidden={!selected}
      data-state={selected ? 'active' : 'inactive'}
      data-slot="tabs-content"
      className={cn('flex-1 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring', className)}
      {...props}
    />
  );
}
