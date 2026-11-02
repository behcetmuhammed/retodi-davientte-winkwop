/**
 * Açılır listeden tek seçenek seçimi.
 *
 * @example
 * <Select value={city} onValueChange={setCity} name="city">
 *   <SelectTrigger className="w-56"><SelectValue placeholder="Şehir seçin" /></SelectTrigger>
 *   <SelectContent>
 *     <SelectGroup>
 *       <SelectLabel>Marmara</SelectLabel>
 *       <SelectItem value="istanbul">İstanbul</SelectItem>
 *       <SelectItem value="bursa">Bursa</SelectItem>
 *     </SelectGroup>
 *     <SelectSeparator />
 *     <SelectItem value="ankara" disabled>Ankara</SelectItem>
 *   </SelectContent>
 * </Select>
 */
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useDismissableLayer } from '../../hooks/use-dismissable-layer';
import { useFloating } from '../../hooks/use-floating';
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect';
import { usePresence } from '../../hooks/use-presence';
import { focusFirst, useRovingFocus } from '../../hooks/use-roving-focus';
import { cn, composeEventHandlers, composeRefs } from '../../lib/utils';
import { CheckIcon, ChevronDownIcon } from '../icons';
import { useFieldControl } from './field';
import { Portal } from './portal';

type ItemRecord = { label: ReactNode; text: string; disabled: boolean };

type SelectContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  select: (value: string) => void;
  disabled: boolean;
  items: Map<string, ItemRecord>;
  register: (value: string, record: ItemRecord) => void;
  floating: ReturnType<typeof useFloating>;
  contentRef: RefObject<HTMLDivElement | null>;
  contentId: string;
};

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Select bileşenleri <Select> içinde kullanılmalı.');
  return ctx;
}

type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Form gönderimi için gizli input adı. */
  name?: string;
  required?: boolean;
  children: ReactNode;
};

export function Select({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  name,
  required,
  children,
}: SelectProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const itemsRef = useRef(new Map<string, ItemRecord>());
  const [, setVersion] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentId = `select-${useId().replace(/:/g, '')}`;
  const floating = useFloating({ open, side: 'bottom', align: 'start', sideOffset: 4 });

  const register = useCallback((key: string, record: ItemRecord) => {
    const prev = itemsRef.current.get(key);
    itemsRef.current.set(key, record);
    if (!prev || prev.text !== record.text || prev.disabled !== record.disabled) setVersion((v) => v + 1);
  }, []);

  const select = useCallback(
    (next: string) => {
      setValue(next);
      setOpen(false);
      floating.referenceRef.current?.focus();
    },
    [setValue, setOpen, floating.referenceRef],
  );

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen: (next) => !disabled && setOpen(next),
        value,
        select,
        disabled,
        items: itemsRef.current,
        register,
        floating,
        contentRef,
        contentId,
      }}
    >
      {children}
      {name && <input type="hidden" name={name} value={value} required={required} />}
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  size = 'md',
  onClick,
  onKeyDown,
  ref,
  ...rest
}: ComponentProps<'button'> & { size?: 'sm' | 'md' | 'lg' }) {
  const ctx = useSelect();
  const props = useFieldControl({ ...rest, disabled: rest.disabled ?? (ctx.disabled || undefined) });

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      ctx.setOpen(true);
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const entries = [...ctx.items.entries()].filter(([, r]) => !r.disabled);
      const start = entries.findIndex(([v]) => v === ctx.value);
      const ordered = [...entries.slice(start + 1), ...entries.slice(0, start + 1)];
      const match = ordered.find(([, r]) => r.text.toLocaleLowerCase('tr').startsWith(event.key.toLocaleLowerCase('tr')));
      if (match) ctx.select(match[0]);
    }
  };

  return (
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.contentId : undefined}
      data-slot="select-trigger"
      data-state={ctx.open ? 'open' : 'closed'}
      data-placeholder={ctx.value ? undefined : ''}
      ref={composeRefs(ref, ctx.floating.referenceRef)}
      onClick={composeEventHandlers(onClick, () => ctx.setOpen(!ctx.open))}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background text-left whitespace-nowrap shadow-xs',
        'transition-[color,box-shadow,border-color] outline-none',
        'focus-visible:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        'data-placeholder:text-muted-foreground',
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        size === 'sm' && 'h-8 px-2.5 text-[0.8125rem]',
        size === 'md' && 'h-9 px-3 text-sm',
        size === 'lg' && 'h-10 px-3.5 text-[0.9375rem]',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className={cn('text-muted-foreground opacity-70 transition-transform duration-150', ctx.open && 'rotate-180')}
      />
    </button>
  );
}

export function SelectValue({ placeholder, className }: { placeholder?: ReactNode; className?: string }) {
  const ctx = useSelect();
  const record = ctx.value ? ctx.items.get(ctx.value) : undefined;
  return (
    <span data-slot="select-value" className={cn('flex min-w-0 items-center gap-2 truncate', className)}>
      {record ? record.label : placeholder}
    </span>
  );
}

export function SelectContent({ className, children, ...props }: ComponentProps<'div'>) {
  const ctx = useSelect();
  const present = usePresence(ctx.open, 120);
  const onRovingKeyDown = useRovingFocus(ctx.contentRef);

  useDismissableLayer(ctx.open, [ctx.contentRef, ctx.floating.referenceRef], (reason) => {
    ctx.setOpen(false);
    if (reason === 'escape') ctx.floating.referenceRef.current?.focus();
  });

  useIsomorphicLayoutEffect(() => {
    if (!ctx.open) return;
    const frame = requestAnimationFrame(() => focusFirst(ctx.contentRef.current, '[data-dv-item][aria-selected="true"]'));
    return () => cancelAnimationFrame(frame);
  }, [ctx.open]);

  if (!present) {
    return (
      <div hidden aria-hidden>
        {children}
      </div>
    );
  }

  return (
    <Portal>
      <div
        id={ctx.contentId}
        role="listbox"
        tabIndex={-1}
        data-slot="select-content"
        data-dv-layer=""
        data-state={ctx.open ? 'open' : 'closed'}
        data-side={ctx.floating.side}
        ref={composeRefs(ctx.contentRef, ctx.floating.setFloating)}
        style={{ ...ctx.floating.style, minWidth: 'var(--dv-anchor-width)' }}
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            event.preventDefault();
            ctx.setOpen(false);
            ctx.floating.referenceRef.current?.focus();
            return;
          }
          onRovingKeyDown(event);
        }}
        className={cn(
          'z-50 flex max-h-[min(var(--dv-available-height,20rem),20rem)] flex-col overflow-y-auto overscroll-contain rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none dv-scrollbar',
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

type SelectItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  value: string;
  disabled?: boolean;
  /** Typeahead ve seçili değer metni; verilmezse çocukların metni kullanılır. */
  textValue?: string;
  children: ReactNode;
};

export function SelectItem({ value, disabled = false, textValue, className, children, ...props }: SelectItemProps) {
  const ctx = useSelect();
  const selected = ctx.value === value;
  const text = textValue ?? (typeof children === 'string' || typeof children === 'number' ? String(children) : value);

  useIsomorphicLayoutEffect(() => {
    ctx.register(value, { label: children, text, disabled });
  });

  return (
    <div
      role="option"
      tabIndex={-1}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-slot="select-item"
      data-dv-item=""
      data-text-value={text}
      data-state={selected ? 'checked' : 'unchecked'}
      data-disabled={disabled || undefined}
      onClick={() => !disabled && ctx.select(value)}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
          event.preventDefault();
          ctx.select(value);
        }
      }}
      onPointerMove={(event) => {
        if (!disabled && document.activeElement !== event.currentTarget) event.currentTarget.focus({ preventScroll: true });
      }}
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2 truncate">{children}</span>
      {selected && (
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
          <CheckIcon className="size-4" />
        </span>
      )}
    </div>
  );
}

export function SelectGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div role="group" data-slot="select-group" className={cn('py-0.5', className)} {...props} />;
}

export function SelectLabel({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="select-label" className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)} {...props} />;
}

export function SelectSeparator({ className, ...props }: ComponentProps<'div'>) {
  return <div role="separator" data-slot="select-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}
