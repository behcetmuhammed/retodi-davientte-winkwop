import type { HeaderProps, WinkwopLink, WinkwopPageContext } from '../../generated/types';

export type HeaderLayout = HeaderProps['headerLayout'];

export type UtilityBarProps = Pick<
  HeaderProps,
  | 'link1LabelName'
  | 'link1'
  | 'link1Icon'
  | 'link1IconMobile'
  | 'link1Position'
  | 'link2LabelName'
  | 'link2'
  | 'link2Icon'
  | 'link2IconMobile'
  | 'link2Position'
  | 'openLinksInNewTab'
  | 'facebookLink'
  | 'instagramLink'
  | 'whatsappLink'
  | 'linkedinLink'
  | 'xLink'
  | 'youtubeLink'
  | 'tiktokLink'
  | 'pinterestLink'
  | 'openSocialLinksInNewTab'
  | 'facebookIconMobile'
  | 'instagramIconMobile'
  | 'whatsappIconMobile'
  | 'linkedinIconMobile'
  | 'xIconMobile'
  | 'youtubeIconMobile'
  | 'tiktokIconMobile'
  | 'pinterestIconMobile'
  | 'text1'
  | 'text2'
  | 'text3'
  | 'backgroundColor'
  | 'textAndIconColor'
>;

export type MainRowProps = Pick<
  HeaderProps,
  | 'link1LabelName'
  | 'link1'
  | 'link1Icon'
  | 'link1IconMobile'
  | 'link1Position'
  | 'link2LabelName'
  | 'link2'
  | 'link2Icon'
  | 'link2IconMobile'
  | 'link2Position'
  | 'openLinksInNewTab'
  | 'mobileHeaderLayout'
> & {
  layout: HeaderLayout;
  logo: string;
  logoWidthWeb: number;
  logoWidthMobile: number;
  invertLogoColors: boolean;
  categories: WinkwopLink[];
  page: WinkwopPageContext;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
};

export type NavLinksProps = {
  categories: WinkwopLink[];
  page: WinkwopPageContext;
  className?: string;
  /** Mobil menüde dikey liste. */
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
};
