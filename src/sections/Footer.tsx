import type { FooterProps } from '../generated/types';
import { panelBackgroundColor, panelTextColor } from '../components/shared/panel-color-style';
import { Toaster } from '../components/ui/toaster';
import { Container } from '../components/ui/container';
import { Grid } from '../components/ui/grid';
import { cn } from '../lib/utils';
import { FooterContact } from './footer/footer-contact';
import { FooterCopyrightBar } from './footer/footer-copyright-bar';
import { FooterLinkColumn } from './footer/footer-link-column';
import { FooterNewsletter } from './footer/footer-newsletter';

/**
 * Site alt bilgisi: link sütunları, iletişim, bülten ve telif şeridi.
 */
export default function Footer(props: FooterProps) {
  const mainBg = panelBackgroundColor(props.backgroundColor);
  const mainText = panelTextColor(props.textColor);
  const barBg = panelBackgroundColor(props.barBackgroundColor);
  const barText = panelTextColor(props.barTextColor);

  const openLinks = props.openLinksInNewTab;

  return (
    <footer role="contentinfo" data-slot="site-footer" className={cn(!mainBg && 'bg-background', !mainText && 'text-foreground')}>
      <Toaster position="bottom-center" />
      <div className="py-12 md:py-16 lg:py-20" style={mainBg}>
        <Container>
          <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="xl" style={mainText}>
            <FooterLinkColumn
              title={props.customerCareTitle}
              links={props.customerCareLinks}
              openInNewTab={openLinks}
              textStyle={mainText}
            >
              <FooterContact phone={props.contactPhone} email={props.contactEmail} textStyle={mainText} />
            </FooterLinkColumn>
            <FooterLinkColumn
              title={props.corporateTitle}
              links={props.corporateLinks}
              openInNewTab={openLinks}
              textStyle={mainText}
            />
            <FooterLinkColumn title={props.legalTitle} links={props.legalLinks} openInNewTab={openLinks} textStyle={mainText} />
            <FooterNewsletter
              title={props.newsletterTitle}
              description={props.newsletterDescription}
              emailPlaceholder={props.emailPlaceholder}
              subscribeButtonLabel={props.subscribeButtonLabel}
              textStyle={mainText}
              instagramLink={props.instagramLink}
              facebookLink={props.facebookLink}
              xLink={props.xLink}
              openSocialLinksInNewTab={props.openSocialLinksInNewTab}
            />
          </Grid>
        </Container>
      </div>
      <FooterCopyrightBar text={props.copyrightText} barStyle={barBg} textStyle={barText} />
    </footer>
  );
}
