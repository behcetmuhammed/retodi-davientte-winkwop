import fs from 'node:fs';

const sectionContainerWidthSelect = {
  id: 'sectionContainerWidth',
  label: 'Genel genişlik',
  type: 'select',
  default: 'default',
  options: [
    { label: 'Varsayılan', value: 'default' },
    { label: 'Çok Küçük', value: 'extraSmall' },
    { label: 'Küçük', value: 'small' },
    { label: 'Orta', value: 'medium' },
    { label: 'Geniş', value: 'wide' },
    { label: 'Çok Geniş', value: 'extraWide' },
  ],
};

const spacingSelect = {
  type: 'select',
  default: 'medium',
  options: [
    { label: 'Küçük', value: 'small' },
    { label: 'Orta', value: 'medium' },
    { label: 'Büyük', value: 'large' },
    { label: 'Çok büyük', value: 'extraLarge' },
  ],
};

function itemFields(n) {
  const L = `Madde ${n} — `;
  return [
    { id: `item${n}Title`, label: `${L}Başlık`, type: 'text', default: '' },
    { id: `item${n}Description`, label: `${L}Açıklama`, type: 'textarea', default: '' },
  ];
}

const settings = [
  sectionContainerWidthSelect,
  { id: 'spacingPreset', label: 'Dikey boşluk', ...spacingSelect },
  { id: 'sectionBgColor', label: 'Bölüm arka plan rengi', type: 'color', default: '' },
  { id: 'titleColor', label: 'Başlık rengi', type: 'color', default: '' },
  { id: 'bodyColor', label: 'Açıklama rengi', type: 'color', default: '' },
  ...[1, 2, 3, 4, 5, 6].flatMap(itemFields),
];

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const footerIdx = manifest.sections.findIndex((s) => s.type === 'Footer');
const existing = manifest.sections.findIndex((s) => s.type === 'SectionNumberedList');
const entry = {
  type: 'SectionNumberedList',
  name: 'Numaralı hizmet listesi',
  description: 'Numaralandırılmış satırlarda başlık ve açıklama; en fazla 6 madde.',
  settings,
};

if (existing >= 0) manifest.sections[existing] = entry;
else if (footerIdx >= 0) manifest.sections.splice(footerIdx, 0, entry);
else manifest.sections.push(entry);

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const widthUnion = '"default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide"';
const spacingUnion = '"small" | "medium" | "large" | "extraLarge"';
const itemType = (n) => `
  item${n}Title: string;
  item${n}Description: string;`;

const propsType = `export type SectionNumberedListProps = {
  sectionContainerWidth: ${widthUnion};
  spacingPreset: ${spacingUnion};
  sectionBgColor: string;
  titleColor: string;
  bodyColor: string;${[1, 2, 3, 4, 5, 6].map(itemType).join('')}
  page: WinkwopPageContext;
};`;

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
types = types.replace(/export type SectionNumberedListProps = \{[\s\S]*?\};\n\n?/g, '');
types = types.replace(/export type FooterProps = \{/, `${propsType}\n\nexport type FooterProps = {`);
fs.writeFileSync('src/generated/types.ts', types);

console.log('SectionNumberedList manifest + types', settings.length);
