import type { SectionMediaGridProps } from '../../generated/types';

export type MediaGridPosition = SectionMediaGridProps['item1Position'];

export type MediaGridItem = {
  mediaType: 'image' | 'video';
  image: string;
  imageMobile: string;
  videoUrl: string;
  videoUrlMobile: string;
  columnSpan: number;
  rowSpan: number;
  position: MediaGridPosition;
  subTitle: string;
  title: string;
  content: string;
  titleColor: string;
  subTitleColor: string;
  buttonLabel: string;
  buttonUrl: string;
  openLinkInNewTab: boolean;
  showImageOverlay: boolean;
};

export type MediaGridSectionConfig = Pick<
  SectionMediaGridProps,
  | 'headerEyebrow'
  | 'headerEyebrowColor'
  | 'headerTitle'
  | 'headerTitleColor'
  | 'headerSubTitle'
  | 'headerSubTitleColor'
  | 'bgColor'
  | 'desktopRowHeight'
  | 'mobileRowHeight'
  | 'columnSpacing'
  | 'enableMediaHoverZoom'
  | 'useFullWidth'
  | 'useFullWidthMobile'
  | 'marginTop'
  | 'marginBottom'
  | 'marginTopMobile'
  | 'marginBottomMobile'
>;
