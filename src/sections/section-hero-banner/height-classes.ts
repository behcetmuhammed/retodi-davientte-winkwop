import type { HeroHeightPreset } from './types';

/** Sabit yükseklik ön ayarları (vh tabanlı, mobil öncelikli). */
export function heightPresetClasses(preset: HeroHeightPreset) {
  switch (preset) {
    case 'small':
      return 'min-h-[30vh] md:min-h-[34vh]';
    case 'large':
      return 'min-h-[70vh] md:min-h-[75vh]';
    case 'extraLarge':
      return 'min-h-[85vh] md:min-h-[90vh]';
    case 'medium':
    default:
      return 'min-h-[50vh] md:min-h-[55vh]';
  }
}

export function isAdaptHeightPreset(preset: HeroHeightPreset) {
  return preset === 'adapt';
}
