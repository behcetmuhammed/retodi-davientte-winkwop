import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MoonIcon, SunIcon } from '../components/icons';
import { IconButton } from '../components/ui';
import { CoreDemos } from './demos-core';
import { IconDemos } from './demos-icons';
import './kit.css';

function Kit() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="font-heading text-sm font-semibold tracking-tight">Davientte UI Kit</span>
          <IconButton aria-label={dark ? 'Açık tema' : 'Koyu tema'} onClick={() => setDark((v) => !v)}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <CoreDemos />
        <IconDemos />
      </main>
    </div>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Kit />
  </StrictMode>,
);
