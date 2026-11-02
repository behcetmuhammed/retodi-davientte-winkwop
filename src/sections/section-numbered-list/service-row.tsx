import { panelTextColor } from '../../components/shared/panel-color-style';
import { Heading, Text } from '../../components/ui/typography';
import { cn } from '../../lib/utils';

type ServiceRowProps = {
  index: number;
  title: string;
  description: string;
  titleColor?: string;
  bodyColor?: string;
};

function formatIndex(n: number): string {
  return String(n).padStart(2, '0');
}

export function ServiceRow({ index, title, description, titleColor, bodyColor }: ServiceRowProps) {
  const bodyStyle = panelTextColor(bodyColor);

  return (
    <li className="border-b border-border py-8 last:border-b-0 md:py-10">
      <div
        className={cn(
          'grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center md:gap-6 lg:gap-8',
        )}
      >
        <span
          className="font-heading text-sm tabular-nums text-muted-foreground md:col-span-1"
          aria-hidden
        >
          {formatIndex(index)}
        </span>
        <div className="md:col-span-5">
          {title ? (
            <Heading
              level={3}
              className="font-heading text-xl font-normal tracking-tight md:text-xl"
              style={panelTextColor(titleColor)}
            >
              {title}
            </Heading>
          ) : null}
        </div>
        <div className="md:col-span-6">
          {description ? (
            <Text
              size="sm"
              tone={bodyStyle ? 'default' : 'muted'}
              leading="relaxed"
              className="text-pretty md:text-base"
              style={bodyStyle}
            >
              {description}
            </Text>
          ) : null}
        </div>
      </div>
    </li>
  );
}
