/**
 * Metin stillerini standartlaştırır. Başlıklar mağazanın başlık fontunu
 * (`--wk-font-heading`) kullanır.
 *
 * @example
 * <Heading level={1}>Kurumsal çözümler</Heading>
 * <Heading level={2} as="h3">Görsel olarak h2, semantik olarak h3</Heading>
 * <Text tone="muted" size="sm">İkincil açıklama</Text>
 * <Text as="span" weight="medium">Satır içi</Text>
 * <Lead>Sayfa giriş paragrafı</Lead>
 * <Prose dangerouslySetInnerHTML={{ __html: html }} />   // zengin metin içeriği
 */
import type { ComponentProps, ElementType } from 'react';
import { cn, variants, type VariantProps } from '../../lib/utils';

const headingVariants = variants({
  base: 'font-heading text-foreground text-balance',
  variants: {
    level: {
      1: 'text-3xl leading-tight font-semibold tracking-tight md:text-4xl',
      2: 'text-2xl leading-tight font-semibold tracking-tight md:text-3xl',
      3: 'text-xl leading-snug font-semibold tracking-tight',
      4: 'text-lg leading-snug font-semibold',
      5: 'text-base leading-snug font-semibold',
      6: 'text-sm leading-snug font-semibold',
    },
  },
  defaultVariants: { level: 2 },
});

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = ComponentProps<'h2'> & {
  level?: HeadingLevel;
  /** Görsel seviyeden farklı bir etiket gerekiyorsa. */
  as?: `h${HeadingLevel}` | 'p' | 'span' | 'div';
};

export function Heading({ level = 2, as, className, ...props }: HeadingProps) {
  const Tag = (as ?? `h${level}`) as ElementType;
  return <Tag data-slot="heading" className={cn(headingVariants({ level }), className)} {...props} />;
}

const textVariants = variants({
  base: '',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      destructive: 'text-destructive',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    leading: {
      tight: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
    },
  },
  defaultVariants: { size: 'md', tone: 'default', weight: 'normal', leading: 'relaxed' },
});

type TextProps = ComponentProps<'p'> & VariantProps<typeof textVariants> & { as?: 'p' | 'span' | 'div' | 'small' | 'strong' | 'label' };

export function Text({ as = 'p', size, tone, weight, leading, className, ...props }: TextProps) {
  const Tag = as as ElementType;
  return <Tag data-slot="text" className={cn(textVariants({ size, tone, weight, leading }), className)} {...props} />;
}

export function Lead({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="lead" className={cn('text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl', className)} {...props} />;
}

export function Eyebrow({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="eyebrow" className={cn('text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase', className)} {...props} />;
}

export function Muted({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function InlineCode({ className, ...props }: ComponentProps<'code'>) {
  return <code className={cn('rounded-xs bg-muted px-1.5 py-0.5 font-mono text-[0.85em]', className)} {...props} />;
}

export function Blockquote({ className, ...props }: ComponentProps<'blockquote'>) {
  return <blockquote className={cn('border-l-2 pl-4 text-foreground/90 italic', className)} {...props} />;
}

/** Zengin metin (CMS, ürün açıklaması, yasal metin) için tipografi. */
export function Prose({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="prose"
      className={cn(
        'max-w-prose text-[0.9375rem] leading-relaxed text-foreground',
        '[&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight',
        '[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight',
        '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-semibold',
        '[&_p]:my-4 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4',
        '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1',
        '[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic',
        '[&_hr]:my-8 [&_hr]:border-border [&_strong]:font-semibold',
        '[&_code]:rounded-xs [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em]',
        '[&_table]:my-6 [&_table]:w-full [&_table]:text-sm [&_td]:border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left',
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        className,
      )}
      {...props}
    />
  );
}
