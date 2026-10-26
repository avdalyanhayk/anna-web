'use client';

import { useId, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { PerformanceType, PerformanceView } from '@/lib/content';
import { AddToCalendar } from './AddToCalendar';
import { cn } from './ui/cn';

type Tab = 'upcoming' | 'past';
type Filter = 'all' | PerformanceType;

export type ScheduleLabels = {
  upcoming: string;
  past: string;
  all: string;
  opera: string;
  concert: string;
  role: string;
  venueLink: string;
  season: string;
  emptyUpcoming: string;
  emptyPast: string;
  filterLabel: string;
  tickets: string;
  addToCalendar: string;
};

type PastProduction = {
  key: string;
  title: string;
  composer: string;
  venue: string;
  place: string;
  url: string | null;
};

/**
 * The past archive lists productions, not dates (client request): one row per
 * production and venue in each opera season (newest first), linking to the
 * production page when one was entered.
 */
function pastBySeason(list: PerformanceView[]): { season: string; items: PastProduction[] }[] {
  const groups: { season: string; items: PastProduction[] }[] = [];
  for (const p of list) {
    let group = groups[groups.length - 1];
    if (!group || group.season !== p.season) {
      group = { season: p.season, items: [] };
      groups.push(group);
    }
    const key = `${p.title}|${p.venue}`.toLowerCase();
    const existing = group.items.find((i) => i.key === key);
    if (existing) existing.url ??= p.venueUrl;
    else group.items.push({ key, title: p.title, composer: p.composer, venue: p.venue, place: p.place, url: p.venueUrl });
  }
  return groups;
}

export function ScheduleList({
  upcoming,
  past,
  labels,
}: {
  upcoming: PerformanceView[];
  past: PerformanceView[];
  labels: ScheduleLabels;
}) {
  const [tab, setTab] = useState<Tab>(upcoming.length === 0 && past.length > 0 ? 'past' : 'upcoming');
  const [filter, setFilter] = useState<Filter>('all');
  const baseId = useId();
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ upcoming: null, past: null });

  const byType = (p: PerformanceView) => filter === 'all' || p.type === filter;
  const upcomingList = upcoming.filter(byType);
  const pastSeasons = pastBySeason(past.filter(byType));
  const pastCount = pastBySeason(past).reduce((n, g) => n + g.items.length, 0);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'upcoming', label: labels.upcoming, count: upcoming.length },
    { key: 'past', label: labels.past, count: pastCount },
  ];
  const filters: Filter[] = ['all', 'opera', 'concert'];
  const isEmpty = tab === 'upcoming' ? upcomingList.length === 0 : pastSeasons.length === 0;

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next: Tab = tab === 'upcoming' ? 'past' : 'upcoming';
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-rule md:flex-row md:items-end md:justify-between">
        <div role="tablist" aria-label="Schedule" className="flex gap-8" onKeyDown={onTabKey}>
          {tabs.map((t) => (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[t.key] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls={`${baseId}-panel`}
              tabIndex={tab === t.key ? 0 : -1}
              onClick={() => setTab(t.key)}
              className={cn(
                'relative -mb-px border-b py-4 font-display text-2xl transition-colors md:text-3xl',
                tab === t.key ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink',
              )}
            >
              {t.label}
              <sup className="ml-1.5 font-sans text-xs not-italic text-muted">{t.count}</sup>
            </button>
          ))}
        </div>

        <div
          role="group"
          aria-label={labels.filterLabel}
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'min-h-10 shrink-0 rounded-full border px-4 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase transition-colors',
                filter === f ? 'border-ink bg-ink text-paper' : 'border-rule text-ink-soft hover:border-ink',
              )}
            >
              {labels[f]}
            </button>
          ))}
        </div>
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${tab}`}>
        {isEmpty ? (
          <p className="py-20 text-center font-display text-2xl text-muted">
            {tab === 'upcoming' ? labels.emptyUpcoming : labels.emptyPast}
          </p>
        ) : tab === 'upcoming' ? (
          <ol>
            {upcomingList.map((p) => (
              <li
                key={p.slug}
                className="group grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-4 border-b border-rule py-8 transition-colors duration-300 md:grid-cols-[7rem_1.4fr_1fr_auto] md:items-center md:gap-x-8 md:px-4 md:hover:bg-paper-deep"
              >
                <div className="row-span-2 md:row-span-1">
                  <p className="font-display text-5xl leading-none tabular-nums transition-colors group-hover:text-accent md:text-6xl">
                    {p.day}
                  </p>
                  <p className="eyebrow mt-2 text-ink">
                    {p.month} <span className="text-muted">{p.year}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {p.weekday}
                    {p.time && ` · ${p.time}`}
                  </p>
                </div>

                <div>
                  <p className="eyebrow text-accent">{labels[p.type]}</p>
                  <h2 className="mt-2 font-display text-2xl leading-tight md:text-[1.75rem]">{p.title}</h2>
                  {p.composer && <p className="mt-1 text-sm text-muted">{p.composer}</p>}
                  {p.role && (
                    <p className="mt-2 text-sm">
                      <span className="text-muted">{labels.role}: </span>
                      {p.role}
                    </p>
                  )}
                </div>

                <div className="col-start-2 md:col-start-auto">
                  {p.venue &&
                    (p.venueUrl ? (
                      <a
                        href={p.venueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/venue inline-flex items-center gap-1.5 font-medium underline decoration-champagne decoration-1 underline-offset-4 hover:decoration-ink"
                      >
                        {p.venue}
                        <ArrowUpRight
                          aria-hidden
                          className="size-3.5 transition-transform group-hover/venue:-translate-y-0.5"
                          strokeWidth={1.75}
                        />
                        <span className="sr-only">({labels.venueLink})</span>
                      </a>
                    ) : (
                      <p className="font-medium">{p.venue}</p>
                    ))}
                  {p.place && <p className="text-sm text-muted">{p.place}</p>}
                  {p.notes && <p className="mt-2 text-sm leading-relaxed text-muted">{p.notes}</p>}
                  <p className="sr-only">{p.longDate}</p>
                </div>

                <div className="col-start-2 flex flex-wrap items-center gap-x-6 gap-y-3 md:col-start-auto md:flex-col md:items-end">
                  {p.ticketsUrl && (
                    <a
                      href={p.ticketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 bg-ink px-5 text-[0.8125rem] font-semibold tracking-[0.12em] text-paper uppercase transition-colors hover:bg-accent"
                    >
                      {labels.tickets}
                      <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.5} />
                      <span className="sr-only">
                        — {p.title}, {p.longDate}
                      </span>
                    </a>
                  )}
                  <AddToCalendar performance={p} label={labels.addToCalendar} />
                </div>
              </li>
            ))}
          </ol>
        ) : (
          pastSeasons.map((group) => (
            <section key={group.season} aria-labelledby={`${baseId}-season-${group.season}`}>
              <h2 id={`${baseId}-season-${group.season}`} className="mt-12 flex items-center gap-4 first:mt-8">
                <span className="eyebrow text-ink">
                  {labels.season} {group.season}
                </span>
                <span aria-hidden className="h-px flex-1 bg-champagne/70" />
              </h2>
              <ul>
                {group.items.map((item) => {
                  const body = (
                    <>
                      <span className="min-w-0">
                        <span className="block font-display text-2xl leading-tight">{item.title}</span>
                        {item.composer && <span className="mt-1 block text-sm text-muted">{item.composer}</span>}
                      </span>
                      <span className="min-w-0 md:text-right">
                        <span className="block font-medium">{item.venue}</span>
                        {item.place && <span className="block text-sm text-muted">{item.place}</span>}
                      </span>
                      {item.url && (
                        <ArrowUpRight
                          aria-hidden
                          className="hidden size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:block"
                          strokeWidth={1.75}
                        />
                      )}
                    </>
                  );
                  const rowClass =
                    'group grid gap-3 border-b border-rule py-6 md:grid-cols-[1.3fr_1fr_1.25rem] md:items-center md:gap-8 md:px-4';
                  return (
                    <li key={item.key}>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(rowClass, 'transition-colors duration-300 hover:bg-paper-deep')}
                        >
                          {body}
                          <span className="sr-only">({labels.venueLink})</span>
                        </a>
                      ) : (
                        <div className={rowClass}>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
