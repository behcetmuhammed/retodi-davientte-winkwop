import type { ThemeButtonStyle } from '../../components/shared/theme-section-button';
import { themeButtonVariant } from '../../components/shared/theme-section-button';
import { cn } from '../../lib/utils';

/** Açık metin tonlu slaytta düğme kontrastı. */
export function heroLinkButtonClass(
  light: boolean,
  style: ThemeButtonStyle | string | undefined,
  role: 'primary' | 'secondary',
): string | undefined {
  if (!light) return undefined;
  const variant = themeButtonVariant(style);
  if (variant === 'link') return 'text-background hover:text-background/90';
  if (variant === 'outline' || variant === 'secondary') {
    return 'border-background/40 bg-background/10 text-background hover:bg-background/20';
  }
  if (role === 'primary') return 'bg-background text-foreground hover:bg-background/90';
  return undefined;
}

export function heroPrimaryVariant(
  light: boolean,
  style: ThemeButtonStyle | string | undefined,
): ReturnType<typeof themeButtonVariant> {
  if (light && themeButtonVariant(style) === 'default') return 'secondary';
  return themeButtonVariant(style);
}
