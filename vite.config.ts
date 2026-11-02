import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { winkwopDev } from './winkwop.dev';

export default defineConfig({
  // Tailwind yalnızca `src/tailwind.css` içe aktarıldığında devreye girer;
  // o dosyayı silerseniz eklenti bir şey üretmez. `winkwopDev`, partner
  // panelindeki "Yerel editör"ün bağlandığı köprü (bkz. winkwop.dev.ts).
  plugins: [react(), tailwindcss(), winkwopDev()],
  server: { port: 3333 },
  build: {
    // The registry is the theme's entry point: Winkwop renders your sections by
    // looking them up in the map it exports.
    lib: {
      entry: 'src/generated/registry.ts',
      name: 'WinkwopTheme',
      fileName: 'theme',
      formats: ['es'],
    },
    rollupOptions: {
      // React is provided by the Winkwop storefront, never bundled with the theme.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
