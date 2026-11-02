import fs from 'node:fs';

const FIELD = {
  id: 'mobileHeaderLayout',
  label: 'Mobil üst menü düzeni',
  type: 'select',
  default: 'trailingActions',
  options: [
    { label: 'Klasik mobil', value: 'trailingActions' },
    { label: 'Ortalı logo', value: 'leadingIconsCenterLogo' },
  ],
};

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const header = manifest.sections.find((s) => s.type === 'Header');
if (!header) throw new Error('Header section not found');

if (!header.settings.some((s) => s.id === 'mobileHeaderLayout')) {
  const idx = header.settings.findIndex((s) => s.id === 'headerLayout');
  const at = idx === -1 ? 0 : idx + 1;
  header.settings.splice(at, 0, FIELD);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
if (!types.includes('mobileHeaderLayout:')) {
  types = types.replace(
    /  \/\*\* Üst Menü Yerleşim Düzeni \*\/\n  headerLayout:[^\n]+\n/,
    `  /** Üst Menü Yerleşim Düzeni */\n  headerLayout: "logoLeftMenuCenter" | "logoCenterMenuLeft" | "logoCenterMenuBelow" | "logoLeftMenuBelow" | "logoLeftMenuLeft";\n  /** Mobil üst menü düzeni */\n  mobileHeaderLayout: "trailingActions" | "leadingIconsCenterLogo";\n`,
  );
}
fs.writeFileSync('src/generated/types.ts', types);

console.log('Header mobileHeaderLayout patched');
