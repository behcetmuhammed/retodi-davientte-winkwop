import type { CSSProperties } from 'react';
import { BrandSocialLinks, hasAnyBrandSocialLink } from '../../components/shared/brand-social-links';
import { Container } from '../../components/ui/container';
import { cn } from '../../lib/utils';
import { AnnouncementBar } from './announcement-bar';
import type { UtilityBarProps } from './types';

type Side = 'left' | 'right';

function UtilityLink({
  label,
  href,
  icon,
  newTab,
}: {
  label: string;
  href: string;
  icon: string;
  newTab: boolean;
}) {
  if (!label.trim() || !href.trim()) return null;
  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className="inline-flex max-w-40 items-center gap-1.5 truncate text-xs leading-snug transition-opacity hover:opacity-80 md:max-w-none"
    >
      {icon ? <img src={icon} alt="" className="size-3.5 shrink-0 object-contain" /> : null}
      <span className="truncate">{label}</span>
    </a>
  );
}

function linkSlot(
  side: Side,
  position: Side,
  label: string,
  href: string,
  icon: string,
  newTab: boolean,
) {
  if (position !== side) return null;
  return <UtilityLink label={label} href={href} icon={icon} newTab={newTab} />;
}

export function UtilityBar(props: UtilityBarProps) {
  const {
    link1LabelName,
    link1,
    link1Icon,
    link1Position,
    link2LabelName,
    link2,
    link2Icon,
    link2Position,
    openLinksInNewTab,
    text1,
    text2,
    text3,
    backgroundColor,
    textAndIconColor,
    ...social
  } = props;

  const announcements = [text1, text2, text3].map((t) => t.trim()).filter(Boolean);
  const barStyle = {
    backgroundColor: backgroundColor || undefined,
    color: textAndIconColor || undefined,
  } as CSSProperties;

  const left = (
    <div className="flex min-w-0 flex-1 items-center justify-start gap-4 md:gap-6">
      {linkSlot('left', link1Position, link1LabelName, link1, link1Icon, openLinksInNewTab)}
      {linkSlot('left', link2Position, link2LabelName, link2, link2Icon, openLinksInNewTab)}
    </div>
  );

  const right = (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-3 md:gap-4">
      {linkSlot('right', link1Position, link1LabelName, link1, link1Icon, openLinksInNewTab)}
      {linkSlot('right', link2Position, link2LabelName, link2, link2Icon, openLinksInNewTab)}
      <BrandSocialLinks
        facebookLink={social.facebookLink}
        instagramLink={social.instagramLink}
        whatsappLink={social.whatsappLink}
        linkedinLink={social.linkedinLink}
        xLink={social.xLink}
        youtubeLink={social.youtubeLink}
        tiktokLink={social.tiktokLink}
        pinterestLink={social.pinterestLink}
        openInNewTab={social.openSocialLinksInNewTab}
        className="hidden shrink-0 sm:flex"
      />
    </div>
  );

  const hasBar =
    announcements.length > 0 ||
    [link1, link2].some((u) => u.trim()) ||
    hasAnyBrandSocialLink(social);

  if (!hasBar) return null;

  return (
    <div
      data-slot="header-utility"
      className="border-b border-border/10 text-xs leading-snug text-current [&_svg]:text-current"
      style={barStyle}
    >
      <Container className="relative flex min-h-9 items-center gap-2 py-1.5 md:min-h-10 md:py-2">
        {left}
        <div className="pointer-events-none absolute inset-x-4 flex justify-center md:inset-x-16">
          <div className="pointer-events-auto max-w-[min(100%,20rem)] md:max-w-md">
            <AnnouncementBar messages={announcements} />
          </div>
        </div>
        {right}
      </Container>
    </div>
  );
}
