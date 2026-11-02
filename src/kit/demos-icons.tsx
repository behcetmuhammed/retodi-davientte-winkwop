import { useState, type ComponentType } from 'react';
import * as Icons from '../components/icons';
import { Input } from '../components/ui';
import { Demo } from './shell';

type IconComponent = ComponentType<{ className?: string }>;

const ALL = (Object.entries(Icons) as [string, unknown][])
  .filter((entry): entry is [string, IconComponent] => entry[0].endsWith('Icon') && typeof entry[1] === 'function')
  .sort(([a], [b]) => a.localeCompare(b));

export function IconDemos() {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const list = q ? ALL.filter(([name]) => name.toLowerCase().includes(q)) : ALL;

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
    } catch {
      /* pano izni yoksa sessizce geç */
    }
  };

  return (
    <Demo title="İkonlar" description={`${ALL.length} ikon. Ada tıklayınca panoya kopyalanır. Lucide (ISC) ve marka ikonları Simple Icons (CC0).`}>
      <Input type="search" placeholder="İkon ara (ör. cart, heart, mail)" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-2">
        {list.map(([name, Icon]) => (
          <button
            key={name}
            type="button"
            onClick={() => copy(name)}
            title={name}
            className="flex flex-col items-center gap-2 rounded-md border p-3 text-center outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            <Icon className="size-5" />
            <span className="w-full truncate text-[0.6875rem] text-muted-foreground">{copied === name ? 'Kopyalandı' : name.replace(/Icon$/, '')}</span>
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="text-sm text-muted-foreground">Eşleşen ikon yok.</p>}
    </Demo>
  );
}
