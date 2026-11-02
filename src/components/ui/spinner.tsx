import type { ComponentProps } from 'react';
import { cn, variants, type VariantProps } from '../../lib/utils';

const spinner = variants({
  base: 'inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent',
  variants: {
    size: {
      xs: 'size-3 border-[1.5px]',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-8 border-[3px]',
    },
  },
  defaultVariants: { size: 'sm' },
});

type SpinnerProps = ComponentProps<'span'> & VariantProps<typeof spinner> & { label?: string };

/**
 * Yükleme göstergesi. Rengini metin renginden alır.
 *
 * @example <Spinner size="md" className="text-muted-foreground" />
 */
export function Spinner({ size, label = 'Yükleniyor', className, ...props }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} data-slot="spinner" className={cn(spinner({ size }), className)} {...props} />
  );
}
