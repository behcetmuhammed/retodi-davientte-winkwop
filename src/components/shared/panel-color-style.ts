import type { CSSProperties } from 'react';

/** Panel `color` alanı: doluysa inline renk, boşsa semantik sınıflar geçerli kalır. */
export function panelTextColor(value: string | undefined): CSSProperties | undefined {
  const color = value?.trim();
  return color ? { color } : undefined;
}

export function panelBackgroundColor(value: string | undefined): CSSProperties | undefined {
  const backgroundColor = value?.trim();
  return backgroundColor ? { backgroundColor } : undefined;
}
