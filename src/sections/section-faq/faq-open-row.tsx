import { panelTextColor } from '../../components/shared/panel-color-style';
import { Heading, Text } from '../../components/ui/typography';
import { cn } from '../../lib/utils';

type FaqOpenRowProps = {
  index: number;
  question: string;
  answer: string;
  titleColor?: string;
};

function formatIndex(n: number): string {
  return String(n).padStart(2, '0');
}

export function FaqOpenRow({ index, question, answer, titleColor }: FaqOpenRowProps) {
  return (
    <li className="border-b border-border py-8 last:border-b-0 md:py-10">
      <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center md:gap-6 lg:gap-8')}>
        <span className="font-heading text-sm tabular-nums text-muted-foreground md:col-span-1" aria-hidden>
          {formatIndex(index)}
        </span>
        <div className="md:col-span-5">
          {question ? (
            <Heading
              level={3}
              className="font-heading text-xl font-normal tracking-tight md:text-xl"
              style={panelTextColor(titleColor)}
            >
              {question}
            </Heading>
          ) : null}
        </div>
        <div className="md:col-span-6">
          {answer ? (
            <Text size="sm" tone="muted" leading="relaxed" className="text-pretty md:text-base">
              {answer}
            </Text>
          ) : null}
        </div>
      </div>
    </li>
  );
}
