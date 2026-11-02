import { useEffect } from 'react';

let lockCount = 0;
let previous: { overflow: string; paddingRight: string } | null = null;

/**
 * Açıkken sayfanın kaymasını engeller. İç içe modallarda sayaç tutar; son
 * modal kapanınca eski stil geri yüklenir. Kaydırma çubuğu kaybolunca içerik
 * kaymasın diye genişliği kadar boşluk eklenir.
 */
export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    const body = document.body;

    if (lockCount === 0) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      body.style.overflow = 'hidden';
      if (scrollbar > 0) {
        const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${current + scrollbar}px`;
      }
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0 && previous) {
        body.style.overflow = previous.overflow;
        body.style.paddingRight = previous.paddingRight;
        previous = null;
      }
    };
  }, [enabled]);
}
