/**
 * İçeriği belirli bir genişlikte ortalar. `size="page"` mağaza ayarındaki
 * içerik genişliğini (`--wk-container-width`) kullanır.
 *
 * @example
 * <Container>...</Container>
 * <Container size="sm" as="section">...</Container>
 */
import type { ComponentProps, ElementType } from 'react';
import { cn, variants, type VariantProps } from '../../lib/utils';

const containerVariants = variants({
  base: 'mx-auto w-full',
  variants: {
    size: {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      page: 'max-w-(--container-page)',
      full: 'max-w-none',
    },
    padding: {
      none: '',
      default: 'px-4 sm:px-6 lg:px-8',
    },
  },
  defaultVariants: { size: 'page', padding: 'default' },
});

type ContainerProps = ComponentProps<'div'> &
  VariantProps<typeof containerVariants> & { as?: 'div' | 'section' | 'main' | 'header' | 'footer' | 'article' };

export function Container({ as = 'div', size, padding, className, ...props }: ContainerProps) {
  const Tag = as as ElementType;
  return <Tag data-slot="container" className={cn(containerVariants({ size, padding }), className)} {...props} />;
}
