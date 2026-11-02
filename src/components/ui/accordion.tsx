/**
 * Akordeon (SSS, filtre grupları, ürün detayları). Başlıklar arasında
 * ok tuşları / Home / End ile gezilir.
 *
 * @example
 * <Accordion type="single" collapsible defaultValue="kargo">
 *   <AccordionItem value="kargo">
 *     <AccordionTrigger>Kargo ne zaman gelir?</AccordionTrigger>
 *     <AccordionContent>1-3 iş günü içinde teslim edilir.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 *
 * <Accordion type="multiple" defaultValue={['a', 'b']}>...</Accordion>
 */
import { createContext, use, useRef, type ComponentProps } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useRovingFocus } from '../../hooks/use-roving-focus';
import { cn } from '../../lib/utils';
import { ChevronDownIcon } from '../icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

type AccordionContextValue = {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  canClose: boolean;
  disabled: boolean;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<{ value: string; disabled: boolean }>({ value: '', disabled: false });

type SingleProps = {
  type: 'single';
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Açık öğeye tekrar tıklayınca kapanabilsin. */
  collapsible?: boolean;
};

type MultipleProps = {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type AccordionProps = Omit<ComponentProps<'div'>, 'defaultValue' | 'dir'> &
  (SingleProps | MultipleProps) & {
    disabled?: boolean;
    variant?: 'default' | 'card';
  };

export function Accordion(props: AccordionProps) {
  const { type, value, defaultValue, onValueChange, disabled = false, variant = 'default', className, ...rest } = props;
  const collapsible = type === 'single' ? (props as SingleProps).collapsible : true;
  delete (rest as Record<string, unknown>).collapsible;

  const toArray = (v: unknown): string[] | undefined => (v === undefined ? undefined : v === null ? [] : Array.isArray(v) ? v : [v as string]);

  const [open, setOpen] = useControllableState<string[]>({
    value: toArray(value),
    defaultValue: toArray(defaultValue) ?? [],
    onChange: (next) => {
      if (type === 'single') (onValueChange as SingleProps['onValueChange'])?.(next[0] ?? null);
      else (onValueChange as MultipleProps['onValueChange'])?.(next);
    },
  });

  const listRef = useRef<HTMLDivElement>(null);
  const onKeyDown = useRovingFocus(listRef, { typeahead: false, selector: '[data-slot="accordion-trigger"]:not(:disabled)' });

  const ctx: AccordionContextValue = {
    isOpen: (v) => open.includes(v),
    toggle: (v) => {
      if (open.includes(v)) {
        if (type === 'single' && !collapsible) return;
        setOpen(open.filter((x) => x !== v));
      } else {
        setOpen(type === 'single' ? [v] : [...open, v]);
      }
    },
    canClose: !!collapsible,
    disabled,
  };

  return (
    <AccordionContext value={ctx}>
      <div
        ref={listRef}
        data-slot="accordion"
        data-variant={variant}
        onKeyDown={onKeyDown}
        className={cn('group/accordion flex w-full flex-col', variant === 'card' && 'gap-2', className)}
        {...rest}
      />
    </AccordionContext>
  );
}

type AccordionItemProps = ComponentProps<'div'> & { value: string; disabled?: boolean };

export function AccordionItem({ value, disabled, className, ...props }: AccordionItemProps) {
  const ctx = use(AccordionContext);
  if (!ctx) throw new Error('<AccordionItem> bir <Accordion> içinde olmalı.');
  const isDisabled = disabled || ctx.disabled;
  return (
    <ItemContext value={{ value, disabled: isDisabled }}>
      <Collapsible
        open={ctx.isOpen(value)}
        onOpenChange={() => ctx.toggle(value)}
        disabled={isDisabled}
        data-slot="accordion-item"
        className={cn(
          'border-b last:border-b-0',
          'group-data-[variant=card]/accordion:rounded-lg group-data-[variant=card]/accordion:border group-data-[variant=card]/accordion:px-4 group-data-[variant=card]/accordion:last:border-b',
          className,
        )}
        {...props}
      />
    </ItemContext>
  );
}

type AccordionTriggerProps = ComponentProps<'button'> & {
  /** Başlık etiketi; sayfanın başlık hiyerarşisine göre seçin. Varsayılan: h3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  hideIcon?: boolean;
};

export function AccordionTrigger({ headingLevel = 3, hideIcon, className, children, ...props }: AccordionTriggerProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Heading className="flex">
      <CollapsibleTrigger
        data-slot="accordion-trigger"
        className={cn(
          'group/trigger flex flex-1 items-start justify-between gap-4 rounded-sm py-4 text-left text-sm font-medium outline-none',
          'transition-colors hover:underline focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
        {!hideIcon && (
          <ChevronDownIcon className="pointer-events-none mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/trigger:rotate-180" />
        )}
      </CollapsibleTrigger>
    </Heading>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <CollapsibleContent role="region" data-slot="accordion-content" className="text-sm" {...props}>
      <div className={cn('pb-4 text-muted-foreground', className)}>{children}</div>
    </CollapsibleContent>
  );
}
