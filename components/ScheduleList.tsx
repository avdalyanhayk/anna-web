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
  recital: string;
  role: string;
  emptyUpcoming: string;
  emptyPast: string;
  filterLabel: string;
  tickets: string;
  addToCalendar: string;
};

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

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'upcoming', label: labels.upcoming, count: upcoming.length },
    { key: 'past', label: labels.past, count: past.length },
  ];
  const filters: Filter[] = ['all', 'opera', 'concert', 'recital'];
  const list = (tab === 'upcoming' ? upcoming : past).filter((p) => filter === 'all' || p.type === filter);

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

        <div role="group" aria-label={labels.filterLabel} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'min-h-10 shrink-0 rounded-full border px-4 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase transition-colors',
                filter === f ? 'border-accent bg-accent text-paper' : 'border-rule text-ink-soft hover:border-ink',
              )}
            >
              {labels[f]}
            </button>
          ))}
        </div>
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${tab}`}>
        {list.length === 0 ? (
          <p className="py-20 text-center font-display text-2xl text-muted">
            {tab === 'upcoming' ? labels.emptyUpcoming : labels.emptyPast}
          </p>
        ) : (
          <ol>
            {list.map((p) => (
              <li
                key={p.slug}
                className={cn(
                  'group grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-4 border-b border-rule py-8 transition-colors duration-300 md:grid-cols-[7rem_1.4fr_1fr_auto] md:items-center md:gap-x-8 md:px-4 md:hover:bg-paper-deep',
                  tab === 'past' && 'text-ink-soft',
                )}
              >
                <div className="row-span-2 md:row-span-1">
                  <p className="font-display text-5xl leading-none tabular-nums transition-colors group-hover:text-accent md:text-6xl">{p.day}</p>
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
                  {p.venue && <p className="text-[0.9375rem]">{p.venue}</p>}
                  {p.place && <p className="text-sm text-muted">{p.place}</p>}
                  {p.notes && <p className="mt-2 text-sm leading-relaxed text-muted">{p.notes}</p>}
                  <p className="sr-only">{p.longDate}</p>
                </div>

                {tab === 'upcoming' && (
                  <div className="col-start-2 flex flex-wrap items-center gap-x-6 gap-y-3 md:col-start-auto md:flex-col md:items-end">
                    {p.ticketsUrl && (
                      <a
                        href={p.ticketsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 bg-accent px-5 text-[0.8125rem] font-semibold tracking-[0.12em] text-paper uppercase transition-colors hover:bg-accent-soft"
                      >
                        {labels.tickets}
                        <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.5} />
                        <span className="sr-only">— {p.title}, {p.longDate}</span>
                      </a>
                    )}
                    <AddToCalendar performance={p} label={labels.addToCalendar} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
