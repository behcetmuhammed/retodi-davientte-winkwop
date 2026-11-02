import type { SectionNumberedListProps } from '../generated/types';
import { panelBackgroundColor } from '../components/shared/panel-color-style';
import { Container } from '../components/ui/container';
import { cn } from '../lib/utils';
import { normalizeNumberedListItems } from './section-numbered-list/normalize-items';
import { ServiceRow } from './section-numbered-list/service-row';

const SPACING = {
  small: 'py-10 md:py-12',
  medium: 'py-12 md:py-16',
  large: 'py-16 md:py-20',
  extraLarge: 'py-20 md:py-24',
} as const;

/**
 * Numaralandırılmış hizmet satırları: başlık ve açıklama; en fazla 6 madde.
 */
export default function SectionNumberedList(props: SectionNumberedListProps) {
  const items = normalizeNumberedListItems(props);
  if (items.length === 0) return null;

  const sectionStyle = panelBackgroundColor(props.sectionBgColor);

  return (
    <section
      data-slot="section-numbered-list"
      className={cn('bg-background text-foreground', SPACING[props.spacingPreset] ?? SPACING.medium)}
      style={sectionStyle}
    >
      <Container widthPreset={props.sectionContainerWidth}>
        <ul className="list-none border-y border-border p-0">
          {items.map((item, i) => (
            <ServiceRow
              key={i}
              index={i + 1}
              title={item.title}
              description={item.description}
              titleColor={props.titleColor}
              bodyColor={props.bodyColor}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
