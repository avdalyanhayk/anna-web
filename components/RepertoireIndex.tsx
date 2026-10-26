'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { ArrowUpRight, Pause, Play, Search, X } from 'lucide-react';
import type { RepertoireCategory, RepertoireItem } from '@/lib/content';
import { RecordingEmbed } from './RecordingEmbed';
import { cn } from './ui/cn';

type Labels = Record<RepertoireCategory, string> & {
  search: string;
  performed: string;
  inPreparation: string;
  listen: string;
  closeRecording: string;
  openRecording: string;
  noResults: string;
};

type Status = 'performed' | 'preparation';

const CATEGORY_ORDER: RepertoireCategory[] = ['opera', 'concert', 'song'];

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Index by surname, like a libretto index: "Wolfgang Amadeus Mozart" → "Mozart". */
const surname = (composer: string) => composer.trim().split(/\s+/).pop() ?? composer;

type ComposerGroup = { composer: string; letter: string; works: RepertoireItem[] };

function groupByCategory(items: RepertoireItem[]) {
  return CATEGORY_ORDER.map((category) => {
    const byComposer = new Map<string, RepertoireItem[]>();
    for (const item of items.filter((i) => i.category === category)) {
      const list = byComposer.get(item.composer) ?? [];
      list.push(item);
      byComposer.set(item.composer, list);
    }
    const composers: ComposerGroup[] = [...byComposer.entries()]
      .map(([composer, works]) => ({
        composer,
        letter: normalize(surname(composer)).charAt(0).toUpperCase(),
        works: works.sort((a, b) => a.work.localeCompare(b.work)),
      }))
      .sort((a, b) => surname(a.composer).localeCompare(surname(b.composer)));
    return { category, composers };
  }).filter((g) => g.composers.length > 0);
}

export function RepertoireIndex({ items, labels }: { items: RepertoireItem[]; labels: Labels }) {
  const [query, setQuery] = useState('');
  const [playing, setPlaying] = useState<string | null>(null);
  const deferred = useDeferredValue(query);

  const groups = useMemo(() => {
    const q = normalize(deferred.trim());
    const filtered = q
      ? items.filter((i) => normalize(`${i.work} ${i.composer} ${i.role}`).includes(q))
      : items;
    // Performed roles first, roles in development in their own section (client brief).
    return (['performed', 'preparation'] as Status[])
      .map((status) => ({
        status,
        categories: groupByCategory(filtered.filter((i) => i.inPreparation === (status === 'preparation'))),
      }))
      .filter((g) => g.categories.length > 0);
  }, [items, deferred]);

  return (
    <div>
      <div className="relative max-w-xl">
        <label htmlFor="repertoire-search" className="sr-only">
          {labels.search}
        </label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-0 size-5 -translate-y-1/2 text-muted" strokeWidth={1.75} />
        <input
          id="repertoire-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.search}
          autoComplete="off"
          className="w-full appearance-none border-0 border-b border-ink/30 bg-transparent py-4 pr-10 pl-9 text-lg placeholder:text-muted focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute top-1/2 right-0 flex size-10 -translate-y-1/2 items-center justify-center text-muted hover:text-ink"
          >
            <X aria-hidden className="size-4" strokeWidth={1.75} />
            <span className="sr-only">Clear</span>
          </button>
        )}
      </div>

      <div aria-live="polite" className="mt-16 space-y-24">
        {groups.length === 0 && <p className="text-lg text-muted">{labels.noResults}</p>}
        {groups.map(({ status, categories }) => (
          <section key={status} aria-labelledby={`rep-${status}`}>
            <div className="flex items-center gap-5">
              <h2 id={`rep-${status}`} className="font-display text-3xl font-semibold md:text-4xl">
                {status === 'performed' ? labels.performed : labels.inPreparation}
              </h2>
              <span aria-hidden className="h-px flex-1 bg-champagne" />
            </div>

            <div className="mt-10 space-y-14">
              {categories.map(({ category, composers }) => (
                <div key={category}>
                  <h3 className="eyebrow border-b border-rule pb-3 text-accent">{labels[category]}</h3>
                  <div className="mt-8 gap-16 md:columns-2">
                    {composers.map((c, i) => (
                      <div key={c.composer} className="mb-10 break-inside-avoid">
                        {(i === 0 || composers[i - 1].letter !== c.letter) && (
                          <p aria-hidden className="mb-4 flex items-center gap-4 font-display text-xl text-muted">
                            {c.letter}
                            <span className="h-px flex-1 bg-rule" />
                          </p>
                        )}
                        <h4 className="eyebrow text-ink">{c.composer}</h4>
                        <ul className="mt-3 space-y-4">
                          {c.works.map((w) => {
                            const open = playing === w.slug;
                            return (
                              <li key={w.slug} className="leading-snug">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p>
                                      <span className="font-display text-xl font-semibold">{w.work}</span>
                                      {w.role && <span className="text-ink-soft"> — {w.role}</span>}
                                    </p>
                                    {w.details && <p className="mt-1 text-sm text-muted">{w.details}</p>}
                                  </div>
                                  {w.recording ? (
                                    <button
                                      type="button"
                                      onClick={() => setPlaying(open ? null : w.slug)}
                                      aria-expanded={open}
                                      className={cn(
                                        'flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors',
                                        open ? 'border-ink bg-ink text-paper' : 'border-champagne text-ink hover:border-ink',
                                      )}
                                    >
                                      {open ? (
                                        <Pause aria-hidden className="size-4" strokeWidth={1.75} />
                                      ) : (
                                        <Play aria-hidden className="ml-0.5 size-4" strokeWidth={1.75} />
                                      )}
                                      <span className="sr-only">
                                        {open ? labels.closeRecording : labels.listen}: {w.work}
                                      </span>
                                    </button>
                                  ) : (
                                    w.recordingUrl && (
                                      <a
                                        href={w.recordingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-champagne hover:border-ink"
                                      >
                                        <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.75} />
                                        <span className="sr-only">
                                          {labels.openRecording}: {w.work}
                                        </span>
                                      </a>
                                    )
                                  )}
                                </div>
                                {open && w.recording && (
                                  <div className="mt-4">
                                    <RecordingEmbed recording={w.recording} title={`${w.work} — ${w.role || c.composer}`} />
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
