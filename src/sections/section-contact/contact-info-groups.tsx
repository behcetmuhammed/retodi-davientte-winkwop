import { Heading, Text } from '../../components/ui/typography';
import { cn } from '../../lib/utils';

type ContactGroup = { title: string; body: string };

type ContactInfoGroupsProps = {
  groups: ContactGroup[];
  className?: string;
};

export function ContactInfoGroups({ groups, className }: ContactInfoGroupsProps) {
  const visible = groups.filter((g) => g.title.trim() || g.body.trim());
  if (visible.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-8 md:gap-10', className)}>
      {visible.map((group, index) => (
        <div key={`${group.title}-${index}`} className="flex flex-col gap-2">
          {group.title.trim() ? (
            <Heading level={3} className="font-heading text-lg font-semibold tracking-tight md:text-xl">
              {group.title}
            </Heading>
          ) : null}
          {group.body.trim() ? (
            <Text size="sm" tone="muted" leading="relaxed" className="whitespace-pre-line text-pretty">
              {group.body}
            </Text>
          ) : null}
        </div>
      ))}
    </div>
  );
}
