import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

type LabelProps = ComponentProps<'label'> & {
  /** Zorunlu alan işareti gösterir (yalnızca görsel; zorunluluk input'ta tanımlanır). */
  required?: boolean;
};

/**
 * Form alanı etiketi.
 *
 * @example <Label htmlFor="email" required>E-posta</Label>
 */
export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        'inline-flex items-center gap-1 text-sm leading-none font-medium select-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden className="text-destructive">
          *
        </span>
      )}
    </label>
  );
}
