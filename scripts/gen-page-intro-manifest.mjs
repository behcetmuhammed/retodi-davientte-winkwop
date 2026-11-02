import fs from 'node:fs';

const alignSelect = {
  type: 'select',
  default: 'center',
  options: [
    { label: 'Sol', value: 'left' },
    { label: 'Orta', value: 'center' },
    { label: 'Sağ', value: 'right' },
  ],
};

const widthSelect = {
  type: 'select',
  default: 'medium',
  options: [
    { label: 'Dar', value: 'narrow' },
    { label: 'Orta', value: 'medium' },
    { label: 'Geniş', value: 'wide' },
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

const headingStyleSelect = {
  type: 'select',
  default: 'default',
  options: [
    { label: 'Varsayılan', value: 'default' },
    { label: 'Editoryal (büyük harf)', value: 'editorial' },
  ],
};

const settings = [
  { id: 'image', label: 'Görsel', type: 'image', default: '' },
  { id: 'imageMobile', label: 'Görsel (mobil)', type: 'image', default: '' },
  { id: 'imageHeight', label: 'Görsel yüksekliği (masaüstü)', type: 'range', default: 420, min: 200, max: 800, step: 10, unit: 'px' },
  { id: 'imageHeightMobile', label: 'Görsel yüksekliği (mobil)', type: 'range', default: 320, min: 160, max: 600, step: 10, unit: 'px' },
  { id: 'showBottomFade', label: 'Alt sis geçişi', type: 'boolean', default: true },
  { id: 'fadeHeight', label: 'Sis yüksekliği', type: 'range', default: 200, min: 80, max: 400, step: 10, unit: 'px' },
  { id: 'fadeToColor', label: 'Sis hedef rengi', type: 'color', default: '' },
  { id: 'heading', label: 'Başlık', type: 'text', default: '' },
  { id: 'eyebrow', label: 'Etiket (başlık altında)', type: 'text', default: '' },
  { id: 'description', label: 'Açıklama', type: 'textarea', default: '' },
  {
    id: 'descriptionAlign',
    label: 'Açıklama hizası',
    type: 'select',
    default: 'center',
    options: [
      { label: 'Sola hizalı', value: 'left' },
      { label: 'Ortalı', value: 'center' },
      { label: 'Sağa hizalı', value: 'right' },
      { label: 'İki yana yasla (justify)', value: 'justify' },
    ],
  },
  { id: 'headingStyle', label: 'Başlık stili', ...headingStyleSelect },
  { id: 'eyebrowColor', label: 'Etiket rengi', type: 'color', default: '' },
  { id: 'headingColor', label: 'Başlık rengi', type: 'color', default: '' },
  { id: 'bodyColor', label: 'Açıklama rengi', type: 'color', default: '' },
  { id: 'sectionBgColor', label: 'Bölüm arka plan rengi', type: 'color', default: '' },
  { id: 'contentAlign', label: 'Başlık ve etiket hizası', ...alignSelect },
  { id: 'contentWidth', label: 'Metin genişliği', ...widthSelect },
  { id: 'spacingPreset', label: 'Metin alt boşluk', ...spacingSelect },
];

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const footerIdx = manifest.sections.findIndex((s) => s.type === 'Footer');
const existing = manifest.sections.findIndex((s) => s.type === 'SectionPageIntro');
const entry = {
  type: 'SectionPageIntro',
  name: 'Sayfa üst görseli',
  description: 'Tam genişlik görsel, alt sis geçişi; başlık, etiket ve açıklama.',
  settings,
};

if (existing >= 0) manifest.sections[existing] = entry;
else if (footerIdx >= 0) manifest.sections.splice(footerIdx, 0, entry);
else manifest.sections.push(entry);

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const propsType = `export type SectionPageIntroProps = {
  image: string;
  imageMobile: string;
  imageHeight: number;
  imageHeightMobile: number;
  showBottomFade: boolean;
  fadeHeight: number;
  fadeToColor: string;
  heading: string;
  eyebrow: string;
  description: string;
  descriptionAlign: "left" | "center" | "right" | "justify";
  headingStyle: "default" | "editorial";
  eyebrowColor: string;
  headingColor: string;
  bodyColor: string;
  sectionBgColor: string;
  contentAlign: "left" | "center" | "right";
  contentWidth: "narrow" | "medium" | "wide";
  spacingPreset: "small" | "medium" | "large" | "extraLarge";
  page: WinkwopPageContext;
};`;

let types = fs.readFileSync('src/generated/types.ts', 'utf8');
types = types.replace(/export type SectionPageIntroProps = \{[\s\S]*?\};\n\n?/g, '');
types = types.replace(/export type FooterProps = \{/, `${propsType}\n\nexport type FooterProps = {`);
fs.writeFileSync('src/generated/types.ts', types);

console.log('SectionPageIntro manifest + types', settings.length);
