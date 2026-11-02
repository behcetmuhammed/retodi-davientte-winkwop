import { useState } from 'react';
import type { HeaderProps } from '../generated/types';
import { MainRow } from './header/main-row';
import { UtilityBar } from './header/utility-bar';

/**
 * Site üst bilgisi: duyuru şeridi, yardımcı bağlantılar, logo ve ana menü.
 * Yerleşim `headerLayout` ile panelden seçilir.
 */
export default function Header(props: HeaderProps) {
  const categories = Array.isArray(props.categories) ? props.categories : [];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header role="banner" data-slot="site-header" className="sticky top-0 z-40">
      <UtilityBar
        link1LabelName={props.link1LabelName}
        link1={props.link1}
        link1Icon={props.link1Icon}
        link1IconMobile={props.link1IconMobile}
        link1Position={props.link1Position}
        link2LabelName={props.link2LabelName}
        link2={props.link2}
        link2Icon={props.link2Icon}
        link2IconMobile={props.link2IconMobile}
        link2Position={props.link2Position}
        openLinksInNewTab={props.openLinksInNewTab}
        facebookLink={props.facebookLink}
        instagramLink={props.instagramLink}
        whatsappLink={props.whatsappLink}
        linkedinLink={props.linkedinLink}
        xLink={props.xLink}
        youtubeLink={props.youtubeLink}
        tiktokLink={props.tiktokLink}
        pinterestLink={props.pinterestLink}
        openSocialLinksInNewTab={props.openSocialLinksInNewTab}
        facebookIconMobile={props.facebookIconMobile}
        instagramIconMobile={props.instagramIconMobile}
        whatsappIconMobile={props.whatsappIconMobile}
        linkedinIconMobile={props.linkedinIconMobile}
        xIconMobile={props.xIconMobile}
        youtubeIconMobile={props.youtubeIconMobile}
        tiktokIconMobile={props.tiktokIconMobile}
        pinterestIconMobile={props.pinterestIconMobile}
        text1={props.text1}
        text2={props.text2}
        text3={props.text3}
        backgroundColor={props.backgroundColor}
        textAndIconColor={props.textAndIconColor}
      />
      <MainRow
        layout={props.headerLayout}
        mobileHeaderLayout={props.mobileHeaderLayout}
        logo={props.logo}
        logoWidthWeb={props.logoWidthWeb}
        logoWidthMobile={props.logoWidthMobile}
        invertLogoColors={props.invertLogoColors}
        categories={categories}
        page={props.page}
        menuOpen={menuOpen}
        onMenuOpenChange={setMenuOpen}
        link1LabelName={props.link1LabelName}
        link1={props.link1}
        link1Icon={props.link1Icon}
        link1IconMobile={props.link1IconMobile}
        link1Position={props.link1Position}
        link2LabelName={props.link2LabelName}
        link2={props.link2}
        link2Icon={props.link2Icon}
        link2IconMobile={props.link2IconMobile}
        link2Position={props.link2Position}
        openLinksInNewTab={props.openLinksInNewTab}
      />
    </header>
  );
}
