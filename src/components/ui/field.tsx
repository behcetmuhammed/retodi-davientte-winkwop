/**
 * Field: etiket, açıklama ve hata mesajını bir form kontrolüne bağlar.
 *
 * İçindeki Input, Textarea, Select, Checkbox, Switch... `id`,
 * `aria-describedby`, `aria-invalid`, `disabled` ve `required` değerlerini
 * Field'dan otomatik alır.
 *
 * @example
 * <Field invalid={!!errors.email} required>
 *   <FieldLabel>E-posta</FieldLabel>
 *   <Input type="email" />
 *   <FieldDescription>Sipariş bildirimleri bu adrese gelir.</FieldDescription>
 *   <FieldError>{errors.email}</FieldError>
 * </Field>
 *
 * <Field orientation="horizontal">
 *   <Switch />
 *   <FieldLabel>Bülten aboneliği</FieldLabel>
 * </Field>
 */
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Label } from './label';

type FieldContextValue = {
  id: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  return useContext(FieldContext);
}

type ControlProps = {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
  'aria-describedby'?: string;
};

/**
 * Form kontrollerinin Field bağlamını kendi prop'larıyla birleştirmesi için.
 * Açıkça verilen prop'lar her zaman önceliklidir.
 */
export function useFieldControl<P extends ControlProps>(props: P): P {
  const field = useContext(FieldContext);
  if (!field) return props;
  const describedBy = [props['aria-describedby'], field.descriptionId, field.invalid ? field.errorId : null]
    .filter(Boolean)
    .join(' ');
  return {
    ...props,
    id: props.id ?? field.id,
    disabled: props.disabled ?? (field.disabled || undefined),
    required: props.required ?? (field.required || undefined),
    'aria-invalid': props['aria-invalid'] ?? (field.invalid || undefined),
    'aria-describedby': describedBy || undefined,
  };
}

type FieldProps = ComponentProps<'div'> & {
  orientation?: 'vertical' | 'horizontal';
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Kontrolün id'si; verilmezse otomatik üretilir. */
  id?: string;
};

export function Field({
  orientation = 'vertical',
  invalid = false,
  disabled = false,
  required = false,
  id,
  className,
  ...props
}: FieldProps) {
  const autoId = useId();
  const base = id ?? `field-${autoId.replace(/:/g, '')}`;
  const value: FieldContextValue = {
    id: base,
    descriptionId: `${base}-description`,
    errorId: `${base}-error`,
    invalid,
    disabled,
    required,
  };

  return (
    <FieldContext.Provider value={value}>
      <div
        role="group"
        data-slot="field"
        data-orientation={orientation}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          'group/field flex w-full gap-2',
          orientation === 'vertical' ? 'flex-col' : 'flex-row items-center [&>[data-slot=field-content]]:flex-1',
          className,
        )}
        {...props}
      />
    </FieldContext.Provider>
  );
}

/** Yatay alanlarda etiket ve açıklamayı alt alta toplar. */
export function FieldContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field-content" className={cn('flex flex-col gap-1', className)} {...props} />;
}

export function FieldLabel({ className, htmlFor, required, ...props }: ComponentProps<typeof Label>) {
  const field = useContext(FieldContext);
  return (
    <Label
      data-slot="field-label"
      htmlFor={htmlFor ?? field?.id}
      required={required ?? field?.required}
      className={cn(field?.disabled && 'cursor-not-allowed opacity-50', field?.invalid && 'text-destructive', className)}
      {...props}
    />
  );
}

export function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  const field = useContext(FieldContext);
  return (
    <p
      id={field?.descriptionId}
      data-slot="field-description"
      className={cn('text-[0.8125rem] leading-normal text-muted-foreground', className)}
      {...props}
    />
  );
}

type FieldErrorProps = Omit<ComponentProps<'p'>, 'children'> & {
  children?: ReactNode;
  /** Birden fazla hata mesajı; ilk boş olmayan gösterilir. */
  errors?: Array<string | undefined | null>;
};

/** Field `invalid` değilse ya da mesaj yoksa hiçbir şey çizmez. */
export function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
  const field = useContext(FieldContext);
  const message = children ?? errors?.find(Boolean);
  if (!message || (field && !field.invalid)) return null;
  return (
    <p
      id={field?.errorId}
      role="alert"
      data-slot="field-error"
      className={cn('text-[0.8125rem] leading-normal font-medium text-destructive', className)}
      {...props}
    >
      {message}
    </p>
  );
}

/** İlgili alanları başlıkla gruplar (adres bilgileri, fatura bilgileri...). */
export function FieldSet({ className, ...props }: ComponentProps<'fieldset'>) {
  return <fieldset data-slot="field-set" className={cn('flex flex-col gap-5 border-0 p-0', className)} {...props} />;
}

export function FieldLegend({ className, ...props }: ComponentProps<'legend'>) {
  return <legend data-slot="field-legend" className={cn('mb-1 text-base font-semibold', className)} {...props} />;
}

export function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field-group" className={cn('flex flex-col gap-5', className)} {...props} />;
}
