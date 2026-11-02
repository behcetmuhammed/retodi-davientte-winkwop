/**
 * İnce, temaya uyumlu kaydırma çubuğuyla kaydırılabilir alan. Yerel kaydırmayı
 * kullanır (dokunmatik ve klavye davranışı tarayıcıya bırakılır).
 *
 * @example
 * <ScrollArea className="h-72 rounded-md border">
 *   <div className="p-4">...uzun liste...</div>
 * </ScrollArea>
 *
 * <ScrollArea orientation="horizontal" fade>...yatay kartlar...</ScrollArea>
 */
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

type ScrollAreaProps = ComponentProps<'div'> & {
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Kenarlarda içeriğin devam ettiğini gösteren yumuşak geçiş. */
  fade?: boolean;
  /** Kaydırma çubuğunu gizler (kaydırma yine çalışır). */
  hideScrollbar?: boolean;
};

export function ScrollArea({ orientation = 'vertical', fade, hideScrollbar, className, tabIndex, ...props }: ScrollAreaProps) {
  return (
    <div
      data-slot="scroll-area"
      data-orientation={orientation}
      tabIndex={tabIndex ?? 0}
      className={cn(
        'relative min-h-0 overscroll-contain rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring',
        orientation === 'vertical' && 'overflow-x-hidden overflow-y-auto',
        orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
        orientation === 'both' && 'overflow-auto',
        hideScrollbar ? 'dv-scrollbar-none' : 'dv-scrollbar',
        fade &&
          (orientation === 'horizontal'
            ? '[mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)]'
            : '[mask-image:linear-gradient(to_bottom,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)]'),
        className,
      )}
      {...props}
    />
  );
}
