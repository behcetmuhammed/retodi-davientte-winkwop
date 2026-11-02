/**
 * Öğeleri dikey veya yatay dizer.
 *
 * @example
 * <Stack gap="lg">...</Stack>
 * <Stack direction="row" align="center" justify="between">...</Stack>
 * <HStack gap="sm" wrap>...</HStack>
 * <Stack direction={{ base: 'column', md: 'row' }}>...</Stack>
 */
import type { ComponentProps, ElementType } from 'react';
import { cn } from '../../lib/utils';
import { GAP } from './grid';

type Direction = 'row' | 'column';

const DIR = {
  base: { row: 'flex-row', column: 'flex-col' },
  sm: { row: 'sm:flex-row', column: 'sm:flex-col' },
  md: { row: 'md:flex-row', column: 'md:flex-col' },
  lg: { row: 'lg:flex-row', column: 'lg:flex-col' },
};

const ALIGN = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch', baseline: 'items-baseline' };
const JUSTIFY = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between', around: 'justify-around' };

type StackProps = ComponentProps<'div'> & {
  direction?: Direction | Partial<Record<keyof typeof DIR, Direction>>;
  gap?: keyof typeof GAP;
  align?: keyof typeof ALIGN;
  justify?: keyof typeof JUSTIFY;
  wrap?: boolean;
  as?: 'div' | 'section' | 'ul' | 'ol' | 'nav' | 'header' | 'footer';
};

export function Stack({ direction = 'column', gap = 'md', align, justify, wrap, as = 'div', className, ...props }: StackProps) {
  const Tag = as as ElementType;
  const dirs = typeof direction === 'string' ? { base: direction } : direction;
  return (
    <Tag
      data-slot="stack"
      className={cn(
        'flex',
        Object.entries(dirs).map(([bp, d]) => DIR[bp as keyof typeof DIR][d as Direction]),
        GAP[gap],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        wrap && 'flex-wrap',
        className,
      )}
      {...props}
    />
  );
}

export function HStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="row" align="center" {...props} />;
}

export function VStack(props: Omit<StackProps, 'direction'>) {
  return <Stack direction="column" {...props} />;
}
