import type { CSSProperties, ReactNode } from 'react';
import type { WinkwopLink } from '../../generated/types';
import { cn } from '../../lib/utils';

type FooterLinkColumnProps = {
  title: string;
  links: WinkwopLink[];
  openInNewTab: boolean;
  textStyle?: CSSProperties;
  className?: string;
  children?: ReactNode;
};

export function FooterLinkColumn({ title, links, openInNewTab, textStyle, className, children }: FooterLinkColumnProps) {
  const items = Array.isArray(links) ? links : [];

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {title.trim() ? (
        <h2 className="font-heading text-sm font-medium tracking-widest uppercase" style={textStyle}>
          {title}
        </h2>
      ) : null}
      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={`${item.url}-${item.label}`}>
              <a
                href={item.url}
                className="text-sm transition-colors hover:underline"
                style={textStyle}
                target={openInNewTab ? '_blank' : undefined}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {children}
    </div>
  );
}
