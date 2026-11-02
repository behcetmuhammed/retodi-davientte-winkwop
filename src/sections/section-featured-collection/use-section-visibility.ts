import { useIsMobile } from '../../hooks/use-media-query';

export function useFeaturedCollectionVisible(hideOnDesktop: boolean, hideOnMobile: boolean): boolean {
  const isMobile = useIsMobile();
  if (hideOnDesktop && !isMobile) return false;
  if (hideOnMobile && isMobile) return false;
  return true;
}
