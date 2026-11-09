'use client';

import { useId, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { PerformanceType, PerformanceView } from '@/lib/content';
import Image from 'next/image';
import { AddToCalendar } from './AddToCalendar';
import { Countdown, type CountdownLabels } from './Countdown';
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
} & CountdownLabels;

type PastProduction = {
  key: string;
  title: string;
  composer: string;
  role: string;
  type: PerformanceType;
  venue: string;
  place: string;
  url: string | null;
};

/**
 * The past archive by opera season (newest first), without dates (client
 * request): one row per production, venue and role in each season, with the
 * role always shown, linking to the production page when one was entered.
 */
function pastBySeason(list: PerformanceView[]): { season: string; items: PastProduction[] }[] {
  const groups: { season: string; items: PastProduction[] }[] = [];
  for (const p of list) {
    let group = groups.find((g) => g.season === p.season);
    if (!group) {
      group = { season: p.season, items: [] };
      groups.push(group);
    }
    const venue = (p.venue || p.city).trim();
    const key = `${p.title.trim()}|${venue}|${p.role.trim()}`.toLowerCase();
    const existing = group.items.find((i) => i.key === key);
    if (existing) existing.url ??= p.productionUrl;
    else
      group.items.push({
        key,
        title: p.title.trim(),
        composer: p.composer,
        role: p.role.trim(),
        type: p.type,
        venue,
        place: [p.city.trim(), p.country.trim()].filter(Boolean).join(', '),
        url: p.productionUrl,
      });
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
            {upcomingList.map((p, i) => (
              <li
                key={p.slug}
                className={cn(
                  'group grid grid-cols-[4.75rem_1fr] gap-x-5 gap-y-6 border-b border-rule py-10 md:gap-x-10 md:py-14',
                  p.photo ? 'md:grid-cols-[8.5rem_1fr_13rem]' : 'md:grid-cols-[8.5rem_1fr]',
                )}
              >
                {/* Playbill date */}
                <div>
                  <p className="font-display text-6xl leading-[0.85] font-semibold tabular-nums transition-colors duration-500 group-hover:text-accent md:text-[6.5rem]">
                    {p.day}
                  </p>
                  <p className="eyebrow mt-3 text-ink">
                    {p.month} <span className="text-muted">{p.year}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {p.weekday}
                    {p.time && ` · ${p.time}`}
                  </p>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <p className="eyebrow text-accent">{labels[p.type]}</p>
                    {i === 0 && <Countdown date={p.date} labels={labels} className="text-ink" />}
                  </div>
                  <h2 className="mt-3 font-display text-[2rem] leading-[1.05] font-semibold text-balance md:text-[2.75rem]">{p.title}</h2>
                  {p.composer && <p className="mt-2 text-muted">{p.composer}</p>}
                  {p.role && (
                    <p className="mt-5 flex flex-wrap items-baseline gap-x-3">
                      <span className="eyebrow text-muted">{labels.role}</span>
                      <span className="font-display text-xl font-medium text-accent md:text-2xl">{p.role}</span>
                    </p>
                  )}
                  <div className="mt-5 border-l border-champagne pl-4">
                    {p.venue && <p className="eyebrow text-ink">{p.venue}</p>}
                    {p.place && <p className="mt-1 text-sm text-muted">{p.place}</p>}
                  </div>
                  {p.notes && <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{p.notes}</p>}
                  <p className="sr-only">{p.longDate}</p>

                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {p.productionUrl && (
                      <a
                        href={p.productionUrl}
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
                </div>

                {/* Production photo from the gallery: comes into colour on hover. */}
                {p.photo && (
                  <div className="col-start-2 max-w-[13rem] overflow-hidden md:col-start-auto">
                    <Image
                      src={p.photo.src}
                      alt={p.photo.alt}
                      width={p.photo.width}
                      height={p.photo.height}
                      sizes="208px"
                      className="h-auto w-full grayscale-[70%] transition-[filter,transform] duration-700 ease-(--ease-out-soft) group-hover:scale-[1.04] group-hover:grayscale-0"
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        ) : (
          pastSeasons.map((group) => (
            <section key={group.season} aria-labelledby={`${baseId}-season-${group.season}`}>
              <h2 id={`${baseId}-season-${group.season}`} className="mt-14 flex items-baseline gap-5 first:mt-10">
                <span className="eyebrow text-muted">{labels.season}</span>
                <span className="font-display text-3xl font-semibold tabular-nums md:text-4xl">{group.season}</span>
                <span aria-hidden className="h-px flex-1 self-center bg-champagne/70" />
              </h2>
              <ul className="mt-4">
                {group.items.map((item) => {
                  const body = (
                    <>
                      <span className="min-w-0">
                        <span className="block font-display text-2xl leading-tight font-semibold">{item.title}</span>
                        {item.composer && <span className="mt-1 block text-sm text-muted">{item.composer}</span>}
                      </span>
                      {/* The role is the point of the archive: always shown, in the accent serif. */}
                      <span className="min-w-0">
                        <span className="eyebrow block text-[0.6875rem] text-muted">{labels.role}</span>
                        <span className="mt-0.5 block font-display text-xl font-medium text-accent">
                          {item.role || labels[item.type]}
                        </span>
                      </span>
                      <span className="min-w-0 border-l border-champagne pl-4 md:border-0 md:pl-0 md:text-right">
                        <span className="block font-medium">{item.venue}</span>
                        {item.place && <span className="block text-sm text-muted">{item.place}</span>}
                      </span>
                      {item.url ? (
                        <ArrowUpRight
                          aria-hidden
                          className="hidden size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:block"
                          strokeWidth={1.75}
                        />
                      ) : (
                        <span aria-hidden className="hidden md:block" />
                      )}
                    </>
                  );
                  const rowClass =
                    'group grid gap-3 border-b border-rule py-6 md:grid-cols-[1.3fr_1fr_1fr_1.25rem] md:items-center md:gap-8 md:px-4';
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
