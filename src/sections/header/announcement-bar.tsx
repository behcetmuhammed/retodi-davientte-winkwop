import { useEffect, useState } from 'react';
import { useMounted } from '../../hooks/use-mounted';
import { cn } from '../../lib/utils';

const INTERVAL_MS = 5000;

/** Ortada dönen duyuru metinleri (text1–text3). */
export function AnnouncementBar({ messages, className }: { messages: string[]; className?: string }) {
  const mounted = useMounted();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1 || !mounted) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [messages.length, mounted]);

  if (messages.length === 0) return null;
  const current = messages[index] ?? messages[0];

  return (
    <p
      data-slot="header-announcement"
      className={cn('truncate px-2 text-center text-xs leading-snug', className)}
      aria-live="polite"
    >
      {current}
    </p>
  );
}
