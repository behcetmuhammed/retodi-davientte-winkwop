import type { CSSProperties } from 'react';
import {
  BrandSocialLinks,
  hasAnyBrandSocialLink,
  headerMobileSocialIconImages,
} from '../../components/shared/brand-social-links';
import { Container } from '../../components/ui/container';
import { AnnouncementBar } from './announcement-bar';
import type { UtilityBarProps } from './types';
import { UtilityBarSideLinks } from './utility-nav-links';

export function UtilityBar(props: UtilityBarProps) {
  const { text1, text2, text3, backgroundColor, textAndIconColor, ...rest } = props;

  const announcements = [text1, text2, text3].map((t) => t.trim()).filter(Boolean);
  const barStyle = {
    backgroundColor: backgroundColor || undefined,
    color: textAndIconColor || undefined,
  } as CSSProperties;

  const social = {
    facebookLink: rest.facebookLink,
    instagramLink: rest.instagramLink,
    whatsappLink: rest.whatsappLink,
    linkedinLink: rest.linkedinLink,
    xLink: rest.xLink,
    youtubeLink: rest.youtubeLink,
    tiktokLink: rest.tiktokLink,
    pinterestLink: rest.pinterestLink,
    openInNewTab: rest.openSocialLinksInNewTab,
  };

  const mobileIconImages = headerMobileSocialIconImages(rest);

  const showSocial = hasAnyBrandSocialLink(rest);
  const showMobileBlock = announcements.length > 0 || showSocial;

  const hasBar =
    announcements.length > 0 ||
    [rest.link1, rest.link2].some((u) => u.trim()) ||
    showSocial;

  if (!hasBar) return null;

  return (
    <div
      data-slot="header-utility"
      className="border-b border-border/10 text-xs leading-snug text-current [&_svg]:text-current"
      style={barStyle}
    >
      <Container>
        {showMobileBlock ? (
          <div className="flex flex-col items-center gap-2 py-2 md:hidden">
            {announcements.length > 0 ? (
              <div className="flex w-full justify-center px-2">
                <AnnouncementBar messages={announcements} className="max-w-full whitespace-normal" />
              </div>
            ) : null}
            {showSocial ? (
              <BrandSocialLinks
                {...social}
                iconImages={mobileIconImages}
                iconClassName="size-4"
                className="shrink-0"
              />
            ) : null}
          </div>
        ) : null}

        <div className="relative hidden min-h-10 items-center gap-2 py-2 md:flex">
          <UtilityBarSideLinks side="left" {...rest} className="min-w-0 flex-1 justify-start" />
          <div className="pointer-events-none absolute inset-x-16 flex justify-center">
            <div className="pointer-events-auto max-w-md">
              <AnnouncementBar messages={announcements} />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3 md:gap-4">
            <UtilityBarSideLinks side="right" {...rest} />
            <BrandSocialLinks {...social} className="hidden shrink-0 md:flex" />
          </div>
        </div>
      </Container>
    </div>
  );
}
