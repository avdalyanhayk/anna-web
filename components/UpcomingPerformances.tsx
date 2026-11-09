import { ArrowUpRight } from 'lucide-react';
import type { PerformanceView } from '@/lib/content';
import { Countdown, type CountdownLabels } from './Countdown';
import { Reveal } from './ui';

/** Playbill-style list of the next performances (home page, right under the hero). */
export function UpcomingPerformances({
  performances,
  labels,
}: {
  performances: PerformanceView[];
  labels: CountdownLabels & { tickets: string; types: Record<PerformanceView['type'], string> };
}) {
  return (
    <ol className="border-t border-champagne">
      {performances.map((p, i) => (
        <Reveal
          as="li"
          key={p.slug}
          delay={i * 0.06}
          className="group grid grid-cols-[4.75rem_1fr] items-start gap-x-5 gap-y-4 border-b border-rule py-8 md:grid-cols-[8rem_1.4fr_1fr_auto] md:items-center md:gap-x-10 md:py-10"
        >
          <p className="row-span-2 md:row-span-1">
            <span className="block font-display text-5xl leading-[0.85] font-semibold tabular-nums transition-colors duration-500 group-hover:text-accent md:text-7xl">
              {p.day}
            </span>
            <span className="eyebrow mt-3 block text-ink">
              {p.month} <span className="text-muted">{p.year}</span>
            </span>
          </p>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="eyebrow text-accent">{labels.types[p.type]}</p>
              {i === 0 && <Countdown date={p.date} labels={labels} className="text-ink" />}
            </div>
            <h3 className="mt-2 font-display text-[1.75rem] leading-[1.1] font-semibold md:text-[2.125rem]">{p.title}</h3>
            {p.role && <p className="mt-2 font-display text-lg font-medium text-accent">{p.role}</p>}
            {p.composer && <p className="mt-1 text-sm text-muted">{p.composer}</p>}
          </div>
          <div className="col-start-2 border-l border-champagne pl-4 md:col-start-auto">
            <p className="eyebrow text-ink">{p.venue}</p>
            <p className="mt-1 text-sm text-muted">
              {p.place}
              {p.time && ` · ${p.weekday} ${p.time}`}
            </p>
          </div>
          {p.productionUrl && (
            <a
              href={p.productionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-start-2 inline-flex min-h-11 items-center justify-center gap-2 justify-self-start bg-ink px-5 text-[0.8125rem] font-semibold tracking-[0.12em] text-paper uppercase transition-colors hover:bg-accent md:col-start-auto md:justify-self-end"
            >
              {labels.tickets}
              <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.75} />
              <span className="sr-only">
                — {p.title}, {p.longDate}
              </span>
            </a>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
