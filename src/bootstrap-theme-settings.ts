/**
 * Registry ile birlikte yüklenir: vitrin `--wk-*` enjekte ettiyse dokunulmaz;
 * `__WINKWOP_THEME_SETTINGS__` varsa uygulanır. Yerel `theme.js` derlemesinde
 * ayarlar `winkwop.dev.ts` tarafından paket başına eklenir.
 */
import { bootstrapWinkwopThemeSettings } from './lib/winkwop-theme-settings';

bootstrapWinkwopThemeSettings();
