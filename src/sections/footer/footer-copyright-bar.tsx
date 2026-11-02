import type { CSSProperties } from 'react';
import { cn } from '../../lib/utils';

type FooterCopyrightBarProps = {
  text: string;
  barStyle?: CSSProperties;
  textStyle?: CSSProperties;
  className?: string;
};

export function FooterCopyrightBar({ text, barStyle, textStyle, className }: FooterCopyrightBarProps) {
  if (!text.trim()) return null;

  return (
    <div className={cn('w-full py-3', !barStyle && 'bg-foreground', className)} style={barStyle}>
      <p className={cn('text-center text-sm', !textStyle && 'text-background')} style={textStyle}>
        {text}
      </p>
    </div>
  );
}
