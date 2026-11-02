/**
 * Checkbox ve CheckboxGroup. Arkada gerçek `<input type="checkbox">` vardır;
 * form gönderimi, `required` ve form reset doğal olarak çalışır.
 *
 * @example
 * <Field orientation="horizontal">
 *   <Checkbox defaultChecked />
 *   <FieldLabel>Sözleşmeyi okudum</FieldLabel>
 * </Field>
 *
 * <Checkbox checked="indeterminate" onCheckedChange={...} aria-label="Tümünü seç" />
 *
 * <CheckboxGroup value={days} onValueChange={setDays} name="days" aria-label="Teslimat günleri">
 *   <CheckboxGroupItem value="mon" label="Pazartesi" />
 *   <CheckboxGroupItem value="tue" label="Salı" description="Öğleden sonra" />
 * </CheckboxGroup>
 */
import { createContext, useContext, useEffect, useId, useRef, type ComponentProps, type ReactNode } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { cn, composeRefs } from '../../lib/utils';
import { CheckIcon, MinusIcon } from '../icons';
import { useFieldControl } from './field';

type CheckedState = boolean | 'indeterminate';

type CheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'checked' | 'defaultChecked' | 'size'> & {
  checked?: CheckedState;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md';
};

const GroupContext = createContext<{
  value: string[];
  toggle: (value: string, checked: boolean) => void;
  name?: string;
  disabled?: boolean;
} | null>(null);

export function Checkbox({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onChange,
  size = 'md',
  className,
  ref,
  value,
  ...rest
}: CheckboxProps) {
  const group = useContext(GroupContext);
  const props = useFieldControl(rest);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const groupChecked = group && value != null ? group.value.includes(String(value)) : undefined;
  const [checked, setChecked] = useControllableState<CheckedState>({
    value: groupChecked ?? checkedProp,
    defaultValue: defaultChecked,
    onChange: (next) => onCheckedChange?.(next === true),
  });
  const indeterminate = checked === 'indeterminate';

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <span data-slot="checkbox" className={cn('relative inline-flex shrink-0', size === 'sm' ? 'size-3.5' : 'size-4', className)}>
      <input
        type="checkbox"
        ref={composeRefs(ref, inputRef)}
        value={value}
        name={props.name ?? group?.name}
        checked={checked === true}
        aria-checked={indeterminate ? 'mixed' : undefined}
        data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
        onChange={(event) => {
          onChange?.(event);
          if (group && value != null) group.toggle(String(value), event.target.checked);
          setChecked(event.target.checked);
        }}
        className={cn(
          'peer size-full shrink-0 cursor-pointer appearance-none rounded-[4px] border border-input bg-background shadow-xs',
          'transition-[background-color,border-color,box-shadow] outline-none',
          'focus-visible:ring-[3px] focus-visible:ring-ring',
          'checked:border-primary checked:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        )}
        {...props}
        disabled={props.disabled ?? group?.disabled}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden items-center justify-center text-primary-foreground peer-checked:flex peer-data-[state=indeterminate]:flex"
      >
        {indeterminate ? <MinusIcon className="size-3" strokeWidth={3} /> : <CheckIcon className="size-3" strokeWidth={3} />}
      </span>
    </span>
  );
}

type CheckboxGroupProps = Omit<ComponentProps<'div'>, 'defaultValue'> & {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  name?: string;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
};

export function CheckboxGroup({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  name,
  disabled,
  orientation = 'vertical',
  className,
  ...props
}: CheckboxGroupProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });
  const toggle = (item: string, checked: boolean) =>
    setValue((prev) => (checked ? [...prev.filter((v) => v !== item), item] : prev.filter((v) => v !== item)));

  return (
    <GroupContext.Provider value={{ value, toggle, name, disabled }}>
      <div
        role="group"
        data-slot="checkbox-group"
        className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap gap-x-6', className)}
        {...props}
      />
    </GroupContext.Provider>
  );
}

type CheckboxGroupItemProps = Omit<CheckboxProps, 'value'> & {
  value: string;
  label: ReactNode;
  description?: ReactNode;
};

export function CheckboxGroupItem({ value, label, description, id, disabled, className, ...props }: CheckboxGroupItemProps) {
  const autoId = useId();
  const inputId = id ?? `cb-${autoId.replace(/:/g, '')}`;
  return (
    <div data-slot="checkbox-group-item" className={cn('flex items-start gap-2.5', className)}>
      <Checkbox id={inputId} value={value} disabled={disabled} className="mt-0.5" {...props} />
      <div className="grid gap-0.5">
        <label htmlFor={inputId} className={cn('text-sm leading-tight font-medium select-none', disabled && 'opacity-50')}>
          {label}
        </label>
        {description && <p className="text-[0.8125rem] text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
