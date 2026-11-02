import { useEffect, useState } from 'react';

const FALLBACK_RATIO = 16 / 9;

/** İlk slayt görselinin en-boy oranı (SSR/hydration: 16/9). */
export function useAdaptImageAspect(imageSrc: string | undefined) {
  const [ratio, setRatio] = useState(FALLBACK_RATIO);

  useEffect(() => {
    const src = imageSrc?.trim();
    if (!src) {
      setRatio(FALLBACK_RATIO);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const { naturalWidth, naturalHeight } = img;
      if (naturalWidth > 0 && naturalHeight > 0) {
        setRatio(naturalWidth / naturalHeight);
      } else {
        setRatio(FALLBACK_RATIO);
      }
    };
    img.onerror = () => {
      if (!cancelled) setRatio(FALLBACK_RATIO);
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  return ratio;
}
