/**
 * Partner panelindeki tema ayarlarını vitrinin beklediği `--wk-*` CSS değişkenlerine çevirir.
 * Canlı vitrinde değişkenler genelde host tarafından enjekte edilir; yerel önizlemede
 * `default-theme.json` → `settings` aynı eşlemeyle uygulanır.
 */

export type WinkwopThemeSettingsColors = {
  primary?: string;
  onPrimary?: string;
  background?: string;
  text?: string;
  muted?: string;
  border?: string;
};

export type WinkwopThemeSettingsTypography = {
  fontFamily?: string;
  headingFont?: string;
  baseSize?: number;
  headingScale?: number;
};

export type WinkwopThemeSettingsLayout = {
  containerWidth?: number;
  radius?: number;
  sectionSpacing?: number;
};

export type WinkwopThemeSettings = {
  colors?: WinkwopThemeSettingsColors;
  typography?: WinkwopThemeSettingsTypography;
  layout?: WinkwopThemeSettingsLayout;
};

const CSS_VAR_KEYS = [
  '--wk-color-primary',
  '--wk-color-on-primary',
  '--wk-color-background',
  '--wk-color-text',
  '--wk-color-muted',
  '--wk-color-border',
  '--wk-container-width',
  '--wk-radius',
  '--wk-font-body',
  '--wk-font-heading',
  '--wk-font-size-base',
  '--wk-section-spacing',
] as const;

function px(value: number | undefined): string | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  return `${value}px`;
}

function fontValue(value: string | undefined): string | undefined {
  if (!value || value.trim() === '' || value === 'theme') return undefined;
  return value.includes(',') ? value : `"${value}", ui-sans-serif, system-ui, sans-serif`;
}

/** Panel `settings` nesnesinden `--wk-*` sözlüğü üretir. */
export function winkwopThemeSettingsToCssVariables(settings: WinkwopThemeSettings | null | undefined) {
  const vars: Record<string, string> = {};
  if (!settings) return vars;

  const { colors, typography, layout } = settings;

  if (colors?.primary) vars['--wk-color-primary'] = colors.primary;
  if (colors?.onPrimary) vars['--wk-color-on-primary'] = colors.onPrimary;
  if (colors?.background) vars['--wk-color-background'] = colors.background;
  if (colors?.text) vars['--wk-color-text'] = colors.text;
  if (colors?.muted) vars['--wk-color-muted'] = colors.muted;
  if (colors?.border) vars['--wk-color-border'] = colors.border;

  const containerWidth = px(layout?.containerWidth);
  if (containerWidth) vars['--wk-container-width'] = containerWidth;

  const radius = px(layout?.radius);
  if (radius) vars['--wk-radius'] = radius;

  const sectionSpacing = px(layout?.sectionSpacing);
  if (sectionSpacing) vars['--wk-section-spacing'] = sectionSpacing;

  const bodyFont = fontValue(typography?.fontFamily);
  if (bodyFont) vars['--wk-font-body'] = bodyFont;

  const headingFont = fontValue(typography?.headingFont);
  if (headingFont) vars['--wk-font-heading'] = headingFont;

  const baseSize = px(typography?.baseSize);
  if (baseSize) vars['--wk-font-size-base'] = baseSize;

  return vars;
}

/** `:root` üzerinde tema değişkenlerini yazar (yerel önizleme / tema bootstrap). */
export function applyWinkwopThemeSettings(
  settings: WinkwopThemeSettings | null | undefined,
  target: HTMLElement = document.documentElement,
) {
  if (typeof document === 'undefined' || !settings) return;

  const vars = winkwopThemeSettingsToCssVariables(settings);
  for (const [key, value] of Object.entries(vars)) {
    target.style.setProperty(key, value);
  }
}

/** Önceki bootstrap'ta yazılan inline `--wk-*` değerlerini temizler. */
export function clearAppliedWinkwopThemeSettings(target: HTMLElement = document.documentElement) {
  if (typeof document === 'undefined') return;
  for (const key of CSS_VAR_KEYS) {
    target.style.removeProperty(key);
  }
}

declare global {
  interface Window {
    /** Vitrin tema ayarlarını JS ile verdiğinde (opsiyonel). */
    __WINKWOP_THEME_SETTINGS__?: WinkwopThemeSettings;
  }
}

/** Tema paketi yüklendiğinde host veya yerel enjektor ayarları uygular. */
export function bootstrapWinkwopThemeSettings() {
  if (typeof document === 'undefined') return;
  const fromHost = typeof window !== 'undefined' ? window.__WINKWOP_THEME_SETTINGS__ : undefined;
  if (fromHost) applyWinkwopThemeSettings(fromHost);
}
