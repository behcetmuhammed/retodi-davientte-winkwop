import fs from 'node:fs';

const FIELDS = [
  { id: 'link1IconMobile', label: 'Bağlantı 1 ikonu (mobil)', type: 'image', default: '' },
  { id: 'link2IconMobile', label: 'Bağlantı 2 ikonu (mobil)', type: 'image', default: '' },
];

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const header = manifest.sections.find((s) => s.type === 'Header');
if (!header) throw new Error('Header section not found');

if (!header.settings.some((s) => s.id === 'link1IconMobile')) {
  const idx1 = header.settings.findIndex((s) => s.id === 'link1Icon');
  if (idx1 >= 0) header.settings.splice(idx1 + 1, 0, FIELDS[0]);
  else header.settings.push(FIELDS[0]);
}

if (!header.settings.some((s) => s.id === 'link2IconMobile')) {
  const idx2 = header.settings.findIndex((s) => s.id === 'link2Icon');
  if (idx2 >= 0) header.settings.splice(idx2 + 1, 0, FIELDS[1]);
  else header.settings.push(FIELDS[1]);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
if (!types.includes('link1IconMobile:')) {
  types = types.replace(
    /  \/\*\* Bağlantı 1 İkonu \*\/\n  link1Icon: string;\n/,
    `  /** Bağlantı 1 İkonu */\n  link1Icon: string;\n  /** Bağlantı 1 ikonu (mobil) */\n  link1IconMobile: string;\n`,
  );
}
if (!types.includes('link2IconMobile:')) {
  types = types.replace(
    /  \/\*\* Bağlantı 2 İkonu \*\/\n  link2Icon: string;\n/,
    `  /** Bağlantı 2 İkonu */\n  link2Icon: string;\n  /** Bağlantı 2 ikonu (mobil) */\n  link2IconMobile: string;\n`,
  );
}
fs.writeFileSync('src/generated/types.ts', types);

console.log('Header link mobile icon fields patched');
