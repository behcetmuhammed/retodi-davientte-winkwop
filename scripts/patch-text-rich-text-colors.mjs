import fs from 'node:fs';

const COLOR_FIELDS = [
  { id: 'eyebrowColor', label: 'Üst etiket rengi', type: 'color', default: '' },
  { id: 'headingColor', label: 'Başlık rengi', type: 'color', default: '' },
  { id: 'bodyColor', label: 'Gövde metni rengi', type: 'color', default: '' },
  { id: 'sectionBgColor', label: 'Bölüm arka plan rengi', type: 'color', default: '' },
];

function injectColors(settings) {
  if (settings.some((s) => s.id === 'eyebrowColor')) return settings;
  const idx = settings.findIndex((s) => s.id === 'headingStyle');
  const at = idx === -1 ? settings.length : idx + 1;
  return [...settings.slice(0, at), ...COLOR_FIELDS, ...settings.slice(at)];
}

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

for (const type of ['Text', 'RichText']) {
  const sec = manifest.sections.find((s) => s.type === type);
  if (!sec) throw new Error(`Section ${type} not found`);
  sec.settings = injectColors(sec.settings);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const colorPropsTs = `  /** Üst etiket rengi */
  eyebrowColor: string;
  /** Başlık rengi */
  headingColor: string;
  /** Gövde metni rengi */
  bodyColor: string;
  /** Bölüm arka plan rengi */
  sectionBgColor: string;
`;

let types = fs.readFileSync('src/generated/types.ts', 'utf8');

function patchProps(typeName) {
  const blockRe = new RegExp(
    `export type ${typeName}Props = \\{[\\s\\S]*?openLinksInNewTab: boolean;\\n\\}`,
  );
  const block = types.match(blockRe)?.[0];
  if (!block) throw new Error(`${typeName}Props block not found`);
  if (block.includes('eyebrowColor')) return;
  const next = block.replace(
    '  openLinksInNewTab: boolean;\n}',
    `  openLinksInNewTab: boolean;\n${colorPropsTs}}`,
  );
  types = types.replace(block, next);
}

patchProps('Text');
patchProps('RichText');

fs.writeFileSync('src/generated/types.ts', types);
console.log('Text/RichText color fields patched');
