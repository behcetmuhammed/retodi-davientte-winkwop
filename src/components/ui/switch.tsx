/**
 * Açık/kapalı anahtarı. Arkada `role="switch"` olan gerçek bir checkbox vardır.
 *
 * @example
 * <Field orientation="horizontal">
 *   <FieldContent>
 *     <FieldLabel>E-posta bildirimleri</FieldLabel>
 *     <FieldDescription>Kampanyalardan haberdar olun.</FieldDescription>
 *   </FieldContent>
 *   <Switch checked={enabled} onCheckedChange={setEnabled} />
 * </Field>
 */
import type { ComponentProps } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state';
import { cn } from '../../lib/utils';
import { useFieldControl } from './field';

type SwitchProps = Omit<ComponentProps<'input'>, 'type' | 'size' | 'checked' | 'defaultChecked'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md';
};

export function Switch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onChange,
  size = 'md',
  className,
  ...rest
}: SwitchProps) {
  const props = useFieldControl(rest);
  const [checked, setChecked] = useControllableState({ value: checkedProp, defaultValue: defaultChecked, onChange: onCheckedChange });

  return (
    <span
      data-slot="switch"
      data-state={checked ? 'checked' : 'unchecked'}
      className={cn('relative inline-flex shrink-0', size === 'sm' ? 'h-4 w-7' : 'h-5 w-9', className)}
    >
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        aria-checked={checked}
        onChange={(event) => {
          onChange?.(event);
          setChecked(event.target.checked);
        }}
        className={cn(
          'peer size-full cursor-pointer appearance-none rounded-full border border-transparent bg-input shadow-xs',
          'transition-[background-color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring',
          'checked:bg-primary disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:ring-[3px] aria-invalid:ring-destructive/25',
        )}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1/2 left-0.5 -translate-y-1/2 rounded-full bg-background shadow-sm transition-transform duration-150',
          'peer-checked:bg-primary-foreground',
          size === 'sm' ? 'size-3 peer-checked:translate-x-3' : 'size-4 peer-checked:translate-x-4',
        )}
      />
    </span>
  );
}
