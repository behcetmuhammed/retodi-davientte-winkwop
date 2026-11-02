import fs from 'node:fs';

const FIELD = {
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

const SECTION_TYPES = ['Text', 'RichText', 'SectionMediaGrid', 'SectionFeaturedCollection', 'SectionImageText'];

const PROP_TYPES = [
  'TextProps',
  'RichTextProps',
  'SectionMediaGridProps',
  'SectionFeaturedCollectionProps',
  'SectionImageTextProps',
];

const PROP_LINE = `  sectionContainerWidth: "default" | "extraSmall" | "small" | "medium" | "wide" | "extraWide";`;

function injectSettings(settings) {
  if (settings.some((s) => s.id === 'sectionContainerWidth')) return settings;
  return [FIELD, ...settings];
}

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

for (const type of SECTION_TYPES) {
  const sec = manifest.sections.find((s) => s.type === type);
  if (!sec) throw new Error(`Section ${type} not found`);
  sec.settings = injectSettings(sec.settings);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

let types = fs.readFileSync('src/generated/types.ts', 'utf8');

for (const typeName of PROP_TYPES) {
  const blockRe = new RegExp(`export type ${typeName} = \\{[\\s\\S]*?\\};`);
  const block = types.match(blockRe)?.[0];
  if (!block || block.includes('sectionContainerWidth')) continue;
  types = types.replace(blockRe, block.replace('{', `{\n${PROP_LINE}`));
}

fs.writeFileSync('src/generated/types.ts', types);
console.log('sectionContainerWidth patched for', SECTION_TYPES.join(', '));
