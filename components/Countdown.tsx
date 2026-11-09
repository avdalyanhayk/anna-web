'use client';

import { useSyncExternalStore } from 'react';
import { todayIso } from '@/lib/dates';
import { cn } from './ui/cn';

const noSubscribe = () => () => {};

/** Today's ISO date on the client; null during SSR/prerender so a cached page never shows a stale count. */
export function useToday(): string | null {
  return useSyncExternalStore(noSubscribe, () => todayIso(), () => null);
}

export type CountdownLabels = { today: string; tomorrow: string; inDays: string };

/** "Today" / "Tomorrow" / "In 12 days" for the next performance (shown for the next 60 days). */
export function Countdown({ date, labels, className }: { date: string; labels: CountdownLabels; className?: string }) {
  const today = useToday();
  if (!today) return null;
  const days = Math.round((Date.parse(date) - Date.parse(today)) / 86_400_000);
  if (days < 0 || days > 60) return null;
  const text = days === 0 ? labels.today : days === 1 ? labels.tomorrow : labels.inDays.replace('{n}', String(days));

  return (
    <span className={cn('inline-flex items-center gap-2 eyebrow', className)}>
      <span aria-hidden className="countdown-dot size-1.5 rounded-full bg-current" />
      {text}
    </span>
  );
}
