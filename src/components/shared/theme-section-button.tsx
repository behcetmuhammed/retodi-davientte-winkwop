import type { ComponentProps } from 'react';
import { Button, type ButtonProps } from '../ui/button';
import { cn } from '../../lib/utils';

/** Panelden seçilen bölüm CTA stili. */
export type ThemeButtonStyle = 'solid' | 'outline' | 'label' | 'secondary';

export function themeButtonVariant(style: ThemeButtonStyle | string | undefined): NonNullable<ButtonProps['variant']> {
  switch (style) {
    case 'outline':
      return 'outline';
    case 'label':
      return 'link';
    case 'secondary':
      return 'secondary';
    case 'solid':
    default:
      return 'default';
  }
}

type ThemeSectionLinkButtonProps = {
  style: ThemeButtonStyle | string | undefined;
  href: string;
  label: string;
  openInNewTab?: boolean;
  size?: ButtonProps['size'];
  className?: string;
};

export function ThemeSectionLinkButton({
  style,
  href,
  label,
  openInNewTab = false,
  size = 'md',
  className,
}: ThemeSectionLinkButtonProps) {
  return (
    <Button asChild variant={themeButtonVariant(style)} size={size} className={cn(className)}>
      <a
        href={href}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {label}
      </a>
    </Button>
  );
}
