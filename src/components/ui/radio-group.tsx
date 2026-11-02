/**
 * Bir gruptan tek seçenek seçimi. Arkada gerçek radio input'lar vardır;
 * ok tuşlarıyla gezinme tarayıcıdan gelir.
 *
 * @example
 * <RadioGroup value={shipping} onValueChange={setShipping} aria-label="Kargo">
 *   <RadioGroupItem value="standard" label="Standart" description="2-4 iş günü" />
 *   <RadioGroupItem value="express" label="Hızlı" description="Ertesi gün" />
 * </RadioGroup>
 *
 * <RadioGroup variant="card" orientation="horizontal">...</RadioGroup>
 */
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { cn } from '../../lib/utils';
import { useFieldContext } from './field';

type RadioContextValue = {
  name: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  variant: 'default' | 'card';
};

const RadioContext = createContext<RadioContextValue | null>(null);

type RadioGroupProps = Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
  /** `card`: her seçenek çerçeveli, seçili olan vurgulu. */
  variant?: 'default' | 'card';
};

export function RadioGroup({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  name,
  disabled,
  required,
  orientation = 'vertical',
  variant = 'default',
  className,
  ...props
}: RadioGroupProps) {
  const field = useFieldContext();
  const autoName = useId();
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange: onValueChange });

  return (
    <RadioContext.Provider
      value={{
        name: name ?? `radio-${autoName.replace(/:/g, '')}`,
        value,
        setValue,
        disabled: disabled ?? field?.disabled,
        required: required ?? field?.required,
        invalid: field?.invalid,
        variant,
      }}
    >
      <div
        role="radiogroup"
        aria-orientation={orientation}
        aria-required={required || undefined}
        aria-invalid={field?.invalid || undefined}
        aria-describedby={field ? field.descriptionId : undefined}
        data-slot="radio-group"
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-x-6 gap-y-3',
          variant === 'card' && orientation === 'horizontal' && 'grid auto-cols-fr grid-flow-col gap-3',
          variant === 'card' && orientation === 'vertical' && 'gap-2',
          className,
        )}
        {...props}
      />
    </RadioContext.Provider>
  );
}

type RadioGroupItemProps = Omit<ComponentProps<'input'>, 'type' | 'value'> & {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
};

export function RadioGroupItem({ value, label, description, id, disabled: disabledProp, className, ...props }: RadioGroupItemProps) {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('RadioGroupItem, <RadioGroup> içinde kullanılmalı.');
  const autoId = useId();
  const inputId = id ?? `radio-${autoId.replace(/:/g, '')}`;
  const disabled = disabledProp ?? ctx.disabled;
  const checked = ctx.value === value;

  const control = (
    <input
      type="radio"
      id={inputId}
      name={ctx.name}
      value={value}
      checked={checked}
      required={ctx.required}
      disabled={disabled}
      aria-invalid={ctx.invalid || undefined}
      data-state={checked ? 'checked' : 'unchecked'}
      onChange={() => ctx.setValue(value)}
      className={cn(
        'peer relative size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-input bg-background shadow-xs',
        'transition-[border-color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring',
        'checked:border-primary checked:after:absolute checked:after:inset-[3px] checked:after:rounded-full checked:after:bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
        !label && className,
      )}
      {...props}
    />
  );

  if (!label) return control;

  return (
    <label
      htmlFor={inputId}
      data-slot="radio-group-item"
      data-state={checked ? 'checked' : 'unchecked'}
      data-disabled={disabled || undefined}
      className={cn(
        'flex cursor-pointer items-start gap-2.5 data-disabled:cursor-not-allowed data-disabled:opacity-60',
        ctx.variant === 'card' &&
          'rounded-lg border p-3.5 transition-colors hover:bg-muted/60 data-[state=checked]:border-primary data-[state=checked]:bg-primary/[0.03] has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring',
        className,
      )}
    >
      <span className="mt-0.5 flex">{control}</span>
      <span className="grid gap-0.5">
        <span className="text-sm leading-tight font-medium">{label}</span>
        {description && <span className="text-[0.8125rem] text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}
