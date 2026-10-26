'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { RepertoireCategory, RepertoireItem } from '@/lib/content';

type Labels = Record<RepertoireCategory, string> & {
  search: string;
  inPreparation: string;
  noResults: string;
};

const CATEGORY_ORDER: RepertoireCategory[] = ['opera', 'concert', 'song'];

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Index by surname, like a libretto index: "Wolfgang Amadeus Mozart" → "Mozart". */
const surname = (composer: string) => composer.trim().split(/\s+/).pop() ?? composer;

type ComposerGroup = { composer: string; letter: string; works: RepertoireItem[] };

function group(items: RepertoireItem[]) {
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
  const deferred = useDeferredValue(query);

  const groups = useMemo(() => {
    const q = normalize(deferred.trim());
    const filtered = q
      ? items.filter((i) => normalize(`${i.work} ${i.composer} ${i.role}`).includes(q))
      : items;
    return group(filtered);
  }, [items, deferred]);

  return (
    <div>
      <div className="relative max-w-xl">
        <label htmlFor="repertoire-search" className="sr-only">
          {labels.search}
        </label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-0 size-5 -translate-y-1/2 text-muted" strokeWidth={1.25} />
        <input
          id="repertoire-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.search}
          autoComplete="off"
          className="w-full appearance-none border-0 border-b border-ink/30 bg-transparent py-4 pr-10 pl-9 text-lg placeholder:text-muted focus:border-lapis focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute top-1/2 right-0 flex size-10 -translate-y-1/2 items-center justify-center text-muted hover:text-ink"
          >
            <X aria-hidden className="size-4" strokeWidth={1.25} />
            <span className="sr-only">Clear</span>
          </button>
        )}
      </div>

      <div aria-live="polite" className="mt-16 space-y-20">
        {groups.length === 0 && <p className="font-display text-2xl text-muted italic">{labels.noResults}</p>}
        {groups.map(({ category, composers }) => (
          <section key={category} aria-labelledby={`rep-${category}`}>
            <h2 id={`rep-${category}`} className="border-b border-ink pb-4 font-display text-3xl md:text-4xl">
              {labels[category]}
            </h2>
            <div className="mt-10 gap-16 md:columns-2">
              {composers.map((c, i) => (
                <div key={c.composer} className="mb-10 break-inside-avoid">
                  {(i === 0 || composers[i - 1].letter !== c.letter) && (
                    <p aria-hidden className="mb-4 flex items-center gap-4 font-display text-xl text-stone italic">
                      {c.letter}
                      <span className="h-px flex-1 bg-rule" />
                    </p>
                  )}
                  <h3 className="eyebrow text-ink">{c.composer}</h3>
                  <ul className="mt-3 space-y-2">
                    {c.works.map((w) => (
                      <li key={w.slug} className="flex items-baseline gap-2 leading-snug">
                        <span className="font-display text-xl">{w.work}</span>
                        {w.role && <span className="text-muted italic">— {w.role}</span>}
                        {w.inPreparation && (
                          <span className="group relative inline-flex translate-y-[-2px] items-center">
                            <span tabIndex={0} aria-label={labels.inPreparation} className="block size-2 rounded-full bg-lapis" />
                            <span
                              role="tooltip"
                              className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 bg-ink px-2 py-1 text-[0.6875rem] whitespace-nowrap text-paper opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                            >
                              {labels.inPreparation}
                            </span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {items.some((i) => i.inPreparation) && (
        <p className="mt-16 flex items-center gap-3 text-sm text-muted">
          <span aria-hidden className="block size-2 rounded-full bg-lapis" />
          {labels.inPreparation}
        </p>
      )}
    </div>
  );
}
