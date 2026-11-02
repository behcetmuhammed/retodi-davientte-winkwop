import fs from 'node:fs';

const STYLE_SELECT = {
  type: 'select',
  default: 'solid',
  options: [
    { label: 'Dolu', value: 'solid' },
    { label: 'Çerçeveli', value: 'outline' },
    { label: 'Etiket (altı çizili)', value: 'label' },
    { label: 'İkincil', value: 'secondary' },
  ],
};

function field(id, label, defaultValue) {
  return { id, label, type: 'select', default: defaultValue, options: STYLE_SELECT.options };
}

function injectAfter(settings, afterId, fields) {
  if (settings.some((s) => fields.some((f) => f.id === s.id))) return settings;
  const idx = settings.findIndex((s) => s.id === afterId);
  const at = idx === -1 ? settings.length : idx + 1;
  return [...settings.slice(0, at), ...fields, ...settings.slice(at)];
}

const manifestPath = 'src/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const textFields = [
  field('primaryButtonStyle', 'Birincil düğme stili', 'solid'),
  field('secondaryButtonStyle', 'İkincil düğme stili', 'outline'),
];

for (const type of ['Text', 'RichText']) {
  const sec = manifest.sections.find((s) => s.type === type);
  sec.settings = injectAfter(sec.settings, 'secondaryUrl', textFields);
}

const hero = manifest.sections.find((s) => s.type === 'HeroBanner');
hero.settings = injectAfter(hero.settings, 'openLinksInNewTab', [
  field('primaryButtonStyle', 'Birincil düğme stili (tüm slaytlar)', 'solid'),
  field('secondaryButtonStyle', 'İkincil düğme stili (tüm slaytlar)', 'outline'),
]);

const mg = manifest.sections.find((s) => s.type === 'SectionMediaGrid');
mg.settings = injectAfter(mg.settings, 'enableMediaHoverZoom', [
  field('itemButtonStyle', 'Kutu düğme stili', 'solid'),
]);

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const styleUnion = '"solid" | "outline" | "label" | "secondary"';

let types = fs.readFileSync('src/generated/types.ts', 'utf8');

function addToType(typeName, lines) {
  const re = new RegExp(
    `(export type ${typeName}Props = \\{[\\s\\S]*?)(  /\\*\\* Bu sayfanın neyle ilgili olduğu \\*\\*/\\n  page: WinkwopPageContext;\\n\\};)`,
  );
  if (!re.test(types)) throw new Error(`${typeName}Props not found`);
  const block = types.match(re)[0];
  if (block.includes(lines.trim().split('\n')[0])) return;
  types = types.replace(re, `$1${lines}$2`);
}

addToType(
  'Text',
  `
  /** Birincil düğme stili */
  primaryButtonStyle: ${styleUnion};
  /** İkincil düğme stili */
  secondaryButtonStyle: ${styleUnion};
`,
);

addToType(
  'RichText',
  `
  /** Birincil düğme stili */
  primaryButtonStyle: ${styleUnion};
  /** İkincil düğme stili */
  secondaryButtonStyle: ${styleUnion};
`,
);

addToType(
  'HeroBanner',
  `
  /** Birincil düğme stili (tüm slaytlar) */
  primaryButtonStyle: ${styleUnion};
  /** İkincil düğme stili (tüm slaytlar) */
  secondaryButtonStyle: ${styleUnion};
`,
);

if (types.includes('SectionMediaGridProps')) {
  const mgRe = /(export type SectionMediaGridProps = \{[\s\S]*?)(  page: WinkwopPageContext;\n\};)/;
  const block = types.match(mgRe)?.[0] ?? '';
  if (block && !block.includes('itemButtonStyle')) {
    types = types.replace(mgRe, `$1  itemButtonStyle: ${styleUnion};\n$2`);
  }
}

fs.writeFileSync('src/generated/types.ts', types);
console.log('Button style fields patched');
