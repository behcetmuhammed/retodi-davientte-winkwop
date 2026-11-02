/**
 * İçeriği belirli bir genişlikte ortalar. `size="page"` mağaza ayarındaki
 * içerik genişliğini (`--wk-container-width`) kullanır.
 *
 * @example
 * <Container>...</Container>
 * <Container size="sm" as="section">...</Container>
 * <Container widthPreset="small">...</Container>
 */
import type { ComponentProps, ElementType } from 'react';
import {
  normalizeSectionContainerWidth,
  sectionContainerMaxWidthClass,
  type SectionContainerWidth,
} from '../../lib/section-container-width';
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

type ContainerSize = NonNullable<VariantProps<typeof containerVariants>['size']>;

const SIZE_MAX: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  page: 'max-w-(--container-page)',
  full: 'max-w-none',
};

type ContainerProps = ComponentProps<'div'> &
  VariantProps<typeof containerVariants> & {
    as?: 'div' | 'section' | 'main' | 'header' | 'footer' | 'article';
    /** Mağaza container genişliğine göre daraltma. `size="full"` iken yok sayılır. */
    widthPreset?: SectionContainerWidth | string;
  };

export function Container({
  as = 'div',
  size = 'page',
  padding = 'default',
  widthPreset,
  className,
  ...props
}: ContainerProps) {
  const Tag = as as ElementType;
  const usePreset = !!widthPreset && size !== 'full';
  const maxWidthClass = usePreset
    ? sectionContainerMaxWidthClass(normalizeSectionContainerWidth(String(widthPreset)))
    : SIZE_MAX[size ?? 'page'];

  return (
    <Tag
      data-slot="container"
      className={cn('mx-auto w-full', maxWidthClass, padding === 'default' && 'px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}
