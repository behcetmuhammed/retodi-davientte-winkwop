import type { SectionContactProps } from '../generated/types';
import { panelBackgroundColor } from '../components/shared/panel-color-style';
import { Container } from '../components/ui/container';
import { Grid } from '../components/ui/grid';
import { Toaster } from '../components/ui/toaster';
import { cn } from '../lib/utils';
import { ContactFormPanel } from './section-contact/contact-form-panel';
import { ContactInfoGroups } from './section-contact/contact-info-groups';

/**
 * İletişim: sol bilgi blokları, sağ form paneli.
 */
export default function SectionContact(props: SectionContactProps) {
  const groups = [
    { title: props.group1Title, body: props.group1Body },
    { title: props.group2Title, body: props.group2Body },
    { title: props.group3Title, body: props.group3Body },
  ];

  const hasContent =
    groups.some((g) => g.title.trim() || g.body.trim()) ||
    props.namePlaceholder ||
    props.emailPlaceholder;

  if (!hasContent) return null;

  const sectionStyle = panelBackgroundColor(props.sectionBgColor);

  return (
    <section data-slot="section-contact" className="bg-background py-10 md:py-14 lg:py-16" style={sectionStyle}>
      <Toaster position="bottom-center" />
      <Container widthPreset={props.sectionContainerWidth}>
        <Grid cols={{ base: 1, md: 2 }} gap="xl" className="items-start">
          <ContactInfoGroups groups={groups} />
          <ContactFormPanel
            namePlaceholder={props.namePlaceholder}
            emailPlaceholder={props.emailPlaceholder}
            messagePlaceholder={props.messagePlaceholder}
            submitButtonLabel={props.submitButtonLabel}
            className={cn('md:min-h-full')}
          />
        </Grid>
      </Container>
    </section>
  );
}
