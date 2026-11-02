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

function faqFields(n) {
  const L = `Soru ${n} — `;
  return [
    { id: `faq${n}Question`, label: `${L}Soru`, type: 'text', default: '' },
    { id: `faq${n}Answer`, label: `${L}Cevap`, type: 'textarea', default: '' },
  ];
}

const settings = [
  sectionContainerWidthSelect,
  { id: 'sectionTitle', label: 'Bölüm başlığı', type: 'text', default: '' },
  {
    id: 'titleAlign',
    label: 'Başlık hizası',
    type: 'select',
    default: 'left',
    options: [
      { label: 'Sol', value: 'left' },
      { label: 'Orta', value: 'center' },
    ],
  },
  {
    id: 'headingStyle',
    label: 'Başlık stili',
    type: 'select',
    default: 'default',
    options: [
      { label: 'Varsayılan', value: 'default' },
      { label: 'Editoryal (büyük harf)', value: 'editorial' },
    ],
  },
  { id: 'spacingPreset', label: 'Dikey boşluk', ...spacingSelect },
  { id: 'sectionBgColor', label: 'Bölüm arka plan rengi', type: 'color', default: '' },
  { id: 'titleColor', label: 'Başlık rengi', type: 'color', default: '' },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].flatMap(faqFields),
];

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const footerIdx = manifest.sections.findIndex((s) => s.type === 'Footer');
const existing = manifest.sections.findIndex((s) => s.type === 'SectionFaq');
const entry = {
  type: 'SectionFaq',
  name: 'Sıkça sorulan sorular',
  description: 'Açılır-kapanır soru ve cevap listesi; en fazla 10 madde.',
  settings,
};

if (existing >= 0) manifest.sections[existing] = entry;
else if (footerIdx >= 0) manifest.sections.splice(footerIdx, 0, entry);
else manifest.sections.push(entry);

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const widthUnion = '"default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide"';
const spacingUnion = '"small" | "medium" | "large" | "extraLarge"';
const faqType = (n) => `
  faq${n}Question: string;
  faq${n}Answer: string;`;

const propsType = `export type SectionFaqProps = {
  sectionContainerWidth: ${widthUnion};
  sectionTitle: string;
  titleAlign: "left" | "center";
  headingStyle: "default" | "editorial";
  spacingPreset: ${spacingUnion};
  sectionBgColor: string;
  titleColor: string;${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(faqType).join('')}
  page: WinkwopPageContext;
};`;

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
types = types.replace(/export type SectionFaqProps = \{[\s\S]*?\};\n\n?/g, '');
types = types.replace(/export type FooterProps = \{/, `${propsType}\n\nexport type FooterProps = {`);
fs.writeFileSync('src/generated/types.ts', types);

console.log('SectionFaq manifest + types', settings.length);
