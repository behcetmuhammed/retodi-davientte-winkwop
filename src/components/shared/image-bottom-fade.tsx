import type { CSSProperties } from 'react';
import { cn } from '../../lib/utils';

type ImageBottomFadeProps = {
  /** Geçişin bittiği renk (hex veya `var(--color-background)`). */
  fadeTo: string;
  heightPx: number;
  className?: string;
};

/**
 * Görselin alt kenarında sayfa arka planına yumuşak geçiş (sis/bulut).
 */
export function ImageBottomFade({ fadeTo, heightPx, className }: ImageBottomFadeProps) {
  const to = fadeTo.trim() || 'var(--color-background)';
  const height = Math.max(40, Math.min(480, heightPx || 200));

  const style: CSSProperties = {
    height,
    background: `linear-gradient(to bottom, transparent, ${to})`,
  };

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-x-0 bottom-0', className)} style={style} />
  );
}

/** Panel renk alanlarından sis hedef rengi. */
export function resolveFadeToColor(fadeToColor: string | undefined, sectionBgColor: string | undefined): string {
  const fade = fadeToColor?.trim();
  if (fade) return fade;
  const bg = sectionBgColor?.trim();
  if (bg) return bg;
  return 'var(--color-background)';
}
