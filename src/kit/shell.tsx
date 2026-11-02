import type { ReactNode } from 'react';

export function Demo({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section id={title.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20 border-b border-border py-10 first:pt-0">
      <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}

export function Row({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
