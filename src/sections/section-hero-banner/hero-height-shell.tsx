import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { heightPresetClasses, isAdaptHeightPreset } from './height-classes';
import type { HeroHeightPreset } from './types';
import { useAdaptImageAspect } from './use-adapt-image-aspect';

type HeroHeightShellProps = {
  preset: HeroHeightPreset;
  /** `adapt` modunda oran için kullanılan görsel (genelde ilk slayt). */
  adaptImageSrc?: string;
  className?: string;
  children: ReactNode;
};

export function HeroHeightShell({ preset, adaptImageSrc, className, children }: HeroHeightShellProps) {
  const adapt = isAdaptHeightPreset(preset);
  const aspectRatio = useAdaptImageAspect(adapt ? adaptImageSrc : undefined);

  const style: CSSProperties | undefined = adapt
    ? { aspectRatio: String(aspectRatio) }
    : undefined;

  return (
    <div
      data-slot="hero-height"
      data-height-preset={preset}
      className={cn('relative w-full', !adapt && heightPresetClasses(preset), className)}
      style={style}
    >
      {children}
    </div>
  );
}
