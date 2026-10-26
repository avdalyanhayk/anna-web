import { ArrowUpRight } from 'lucide-react';
import type { PerformanceView } from '@/lib/content';

/** Compact, scannable list of the next performances (home page, right under the hero). */
export function UpcomingPerformances({
  performances,
  labels,
}: {
  performances: PerformanceView[];
  labels: { tickets: string; types: Record<PerformanceView['type'], string> };
}) {
  return (
    <ol className="border-t border-champagne">
      {performances.map((p) => (
        <li
          key={p.slug}
          className="grid grid-cols-[4.5rem_1fr] items-start gap-x-5 gap-y-3 border-b border-rule py-6 md:grid-cols-[7rem_1.3fr_1fr_auto] md:items-center md:gap-x-8"
        >
          <p className="row-span-2 md:row-span-1">
            <span className="block font-display text-4xl leading-none font-semibold tabular-nums md:text-5xl">{p.day}</span>
            <span className="eyebrow mt-2 block text-ink">
              {p.month} {p.year}
            </span>
          </p>
          <div>
            <p className="eyebrow text-accent">{labels.types[p.type]}</p>
            <h3 className="mt-1 font-display text-2xl leading-tight font-semibold">{p.title}</h3>
            <p className="mt-1 text-ink-soft">{[p.role, p.composer].filter(Boolean).join(' · ')}</p>
          </div>
          <div className="col-start-2 md:col-start-auto">
            <p className="font-medium">{p.venue}</p>
            <p className="text-muted">
              {p.place}
              {p.time && ` · ${p.weekday} ${p.time}`}
            </p>
          </div>
          {p.ticketsUrl && (
            <a
              href={p.ticketsUrl}
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
        </li>
      ))}
    </ol>
  );
}
