/**
 * Tek veya çoklu seçimli toggle grubu (beden, renk, görünüm seçimi...).
 * Ok tuşlarıyla öğeler arasında gezilir.
 *
 * @example
 * <ToggleGroup type="single" value={size} onValueChange={setSize} variant="outline" aria-label="Beden">
 *   <ToggleGroupItem value="s">S</ToggleGroupItem>
 *   <ToggleGroupItem value="m">M</ToggleGroupItem>
 *   <ToggleGroupItem value="l" disabled>L</ToggleGroupItem>
 * </ToggleGroup>
 *
 * <ToggleGroup type="multiple" defaultValue={['bold']}>...</ToggleGroup>
 */
import { createContext, useContext, useRef, type ComponentProps } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useRovingFocus } from '../../hooks/use-roving-focus';
import { cn, composeRefs } from '../../lib/utils';
import { toggleVariants } from './toggle';

type Variant = 'default' | 'outline';
type Size = 'sm' | 'md' | 'lg';

type GroupContextValue = {
  isOn: (value: string) => boolean;
  toggle: (value: string) => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  attached: boolean;
};

const ToggleGroupContext = createContext<GroupContextValue | null>(null);

type Common = Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  /** Öğeleri bitişik çizer. Varsayılan: outline varyantında true */
  attached?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

type SingleProps = Common & {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type MultipleProps = Common & {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export function ToggleGroup(props: SingleProps | MultipleProps) {
  const { type, variant, size, disabled, attached = variant === 'outline', orientation = 'horizontal', className, ref, ...rest } = props;
  const listRef = useRef<HTMLDivElement | null>(null);
  const onKeyDown = useRovingFocus(listRef, { orientation, typeahead: false, selector: '[data-slot=toggle-group-item]:not(:disabled)' });

  const [value, setValue] = useControllableState<string | string[]>({
    value: props.value,
    defaultValue: props.defaultValue ?? (type === 'single' ? '' : []),
    onChange: props.onValueChange as (value: string | string[]) => void,
  });

  const isOn = (item: string) => (Array.isArray(value) ? value.includes(item) : value === item);
  const toggle = (item: string) => {
    if (type === 'single') setValue(value === item ? '' : item);
    else {
      const list = value as string[];
      setValue(list.includes(item) ? list.filter((v) => v !== item) : [...list, item]);
    }
  };

  const { value: _v, defaultValue: _d, onValueChange: _o, ...domProps } = rest as Record<string, unknown>;

  return (
    <ToggleGroupContext.Provider value={{ isOn, toggle, variant, size, disabled, attached }}>
      <div
        role="group"
        data-slot="toggle-group"
        data-orientation={orientation}
        ref={composeRefs(ref, listRef)}
        onKeyDown={onKeyDown}
        className={cn(
          'flex w-fit items-center',
          orientation === 'vertical' && 'flex-col items-stretch',
          attached
            ? orientation === 'horizontal'
              ? '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none'
              : '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none'
            : 'gap-1',
          className,
        )}
        {...(domProps as ComponentProps<'div'>)}
      />
    </ToggleGroupContext.Provider>
  );
}

type ItemProps = ComponentProps<'button'> & { value: string };

export function ToggleGroupItem({ value, className, disabled, onClick, ...props }: ItemProps) {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error('ToggleGroupItem, <ToggleGroup> içinde kullanılmalı.');
  const on = ctx.isOn(value);
  return (
    <button
      type="button"
      aria-pressed={on}
      data-slot="toggle-group-item"
      data-state={on ? 'on' : 'off'}
      disabled={disabled ?? ctx.disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.toggle(value);
      }}
      className={cn(
        toggleVariants({ variant: ctx.variant, size: ctx.size }),
        'focus-visible:z-10',
        ctx.attached && 'shadow-none',
        className,
      )}
      {...props}
    />
  );
}
