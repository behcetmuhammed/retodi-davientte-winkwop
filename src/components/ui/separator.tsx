/**
 * Yatay veya dikey ayraç. Ortasında etiket gösterebilir.
 *
 * @example
 * <Separator />
 * <Separator orientation="vertical" className="h-5" />
 * <Separator label="veya" />
 */
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type SeparatorProps = ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical';
  /** true ise yalnızca görseldir, ekran okuyuculara bildirilmez. Varsayılan: true */
  decorative?: boolean;
  label?: ReactNode;
};

export function Separator({ orientation = 'horizontal', decorative = true, label, className, ...props }: SeparatorProps) {
  const a11y = decorative ? { role: 'none' as const } : { role: 'separator' as const, 'aria-orientation': orientation };

  if (label) {
    return (
      <div data-slot="separator" className={cn('flex items-center gap-3 text-xs text-muted-foreground', className)} {...a11y} {...props}>
        <span className="h-px flex-1 bg-border" />
        <span>{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <div
      data-slot="separator"
      data-orientation={orientation}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch', className)}
      {...a11y}
      {...props}
    />
  );
}
