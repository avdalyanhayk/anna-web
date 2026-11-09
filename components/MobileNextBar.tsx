'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { stripLocale } from '@/lib/i18n';
import { Countdown, type CountdownLabels } from './Countdown';
import { ListenButton, useListen } from './ListenPlayer';
import { cn } from './ui/cn';

export type NextPerformanceSummary = {
  date: string;
  day: string;
  month: string;
  title: string;
  venue: string;
  productionUrl: string | null;
};

/**
 * Phones only: a slim bar pinned to the bottom with the next performance and
 * the Listen control — the two things a visitor on a phone most often wants.
 * It slides in once the visitor scrolls (the home hero already shows both).
 */
export function MobileNextBar({
  next,
  scheduleHref,
  labels,
}: {
  next: NextPerformanceSummary | null;
  scheduleHref: string;
  labels: CountdownLabels & { nextPerformance: string };
}) {
  const pathname = usePathname();
  const listen = useListen();
  const [shown, setShown] = useState(false);
  const onSchedule = stripLocale(pathname) === '/schedule';

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showNext = next && !onSchedule;
  if (!showNext && !listen?.defaultTrack) return null;
  const external = Boolean(next?.productionUrl);

  return (
    <div
      style={{ viewTransitionName: 'mobile-next-bar' }}
      className={cn(
        'on-dark fixed inset-x-0 bottom-0 z-30 border-t border-champagne/25 bg-night/95 pb-[env(safe-area-inset-bottom)] text-paper backdrop-blur-md transition-transform duration-500 ease-(--ease-out-soft) md:hidden',
        shown || listen?.track ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4">
        {showNext ? (
          <Link
            href={next.productionUrl ?? scheduleHref}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <span className="shrink-0 border-r border-champagne/40 pr-3 text-center leading-none">
              <span className="block font-display text-2xl font-semibold tabular-nums">{next.day}</span>
              <span className="eyebrow mt-0.5 block text-[0.625rem] text-champagne">{next.month}</span>
            </span>
            <span className="min-w-0">
              <span className="block text-[0.6875rem]">
                <Countdown date={next.date} labels={labels} className="text-[0.6875rem] text-champagne" />
              </span>
              <span className="block truncate text-sm font-semibold">{next.title}</span>
              <span className="block truncate text-xs text-paper/75">{next.venue}</span>
            </span>
            <ArrowUpRight aria-hidden className="ml-auto size-4 shrink-0 text-paper/80" strokeWidth={1.75} />
            <span className="sr-only">{labels.nextPerformance}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        <ListenButton variant="round" />
      </div>
    </div>
  );
}
