import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * Görsel olarak gizli, ekran okuyucular için görünür içerik.
 *
 * @example <IconButton><TrashIcon /><VisuallyHidden>Sil</VisuallyHidden></IconButton>
 */
export function VisuallyHidden({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="visually-hidden" className={cn('sr-only', className)} {...props} />;
}
