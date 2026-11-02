import type { CSSProperties } from 'react';
import { FacebookIcon, InstagramIcon, XBrandIcon } from '../../components/icons';
import { cn } from '../../lib/utils';

type FooterSocialProps = {
  instagramLink: string;
  facebookLink: string;
  xLink: string;
  openInNewTab: boolean;
  iconStyle?: CSSProperties;
  className?: string;
};

export function FooterSocial({ instagramLink, facebookLink, xLink, openInNewTab, iconStyle, className }: FooterSocialProps) {
  const items = [
    { href: instagramLink, label: 'Instagram', Icon: InstagramIcon },
    { href: facebookLink, label: 'Facebook', Icon: FacebookIcon },
    { href: xLink, label: 'X', Icon: XBrandIcon },
  ].filter((item) => item.href.trim() && item.href.trim() !== '#');

  if (items.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href.trim()}
          aria-label={label}
          className={cn('transition-opacity hover:opacity-70', !iconStyle && 'text-foreground')}
          style={iconStyle}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          <Icon className="size-5" aria-hidden />
        </a>
      ))}
    </div>
  );
}
