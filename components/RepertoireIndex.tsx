'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import type { RepertoireCategory, RepertoireItem } from '@/lib/content';
import { Equalizer, useListen } from './ListenPlayer';
import { RecordingEmbed } from './RecordingEmbed';
import { Reveal } from './ui';
import { cn } from './ui/cn';

type Labels = Record<RepertoireCategory, string> & {
  performed: string;
  inPreparation: string;
  listen: string;
  closeRecording: string;
  openRecording: string;
};

type Status = 'performed' | 'preparation';

const CATEGORY_ORDER: RepertoireCategory[] = ['opera', 'concert'];

/** Sort by surname, like a libretto index: "Wolfgang Amadeus Mozart" → "Mozart". */
const surname = (composer: string) => composer.trim().split(/\s+/).pop() ?? composer;

const byComposerThenWork = (a: RepertoireItem, b: RepertoireItem) =>
  surname(a.composer).localeCompare(surname(b.composer)) || a.work.localeCompare(b.work) || a.role.localeCompare(b.role);

/**
 * Repertoire as a gallery of roles: one card per role. A card shows the stage
 * photo whose gallery caption names the role/work, otherwise a typographic
 * card. YouTube recordings play in the site-wide Listen player; Spotify and
 * SoundCloud open in place.
 */
export function RepertoireIndex({ items, labels }: { items: RepertoireItem[]; labels: Labels }) {
  const groups = useMemo(
    () =>
      (['performed', 'preparation'] as Status[])
        .map((status) => ({
          status,
          categories: CATEGORY_ORDER.map((category) => ({
            category,
            roles: items
              .filter((i) => i.inPreparation === (status === 'preparation') && i.category === category)
              .sort(byComposerThenWork),
          })).filter((c) => c.roles.length > 0),
        }))
        .filter((g) => g.categories.length > 0),
    [items],
  );

  return (
    <div className="space-y-28">
      {groups.map(({ status, categories }) => (
        <section key={status} aria-labelledby={`rep-${status}`}>
          <div className="flex items-center gap-5">
            <h2 id={`rep-${status}`} className="font-display text-3xl font-semibold md:text-5xl">
              {status === 'performed' ? labels.performed : labels.inPreparation}
            </h2>
            <span aria-hidden className="h-px flex-1 bg-champagne" />
          </div>

          <div className="mt-12 space-y-16">
            {categories.map(({ category, roles }) => (
              <div key={category}>
                <h3 className="eyebrow flex items-center gap-3 border-b border-rule pb-3 text-accent">
                  {labels[category]}
                  <span className="text-muted tabular-nums">{roles.length}</span>
                </h3>
                <ul className="mt-8 gap-6 sm:columns-2 lg:columns-3">
                  {roles.map((item, i) => (
                    <Reveal as="li" key={item.slug} delay={(i % 3) * 0.06} className="mb-6 break-inside-avoid">
                      <RoleCard item={item} labels={labels} />
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function RoleCard({ item, labels }: { item: RepertoireItem; labels: Labels }) {
  const listen = useListen();
  const [inline, setInline] = useState(false);
  const title = item.role || item.work;
  const recordingTitle = `${item.work}${item.role ? ` — ${item.role}` : ''}`;
  const youtube = item.recording?.kind === 'youtube' ? item.recording.id : null;
  const playingHere = youtube !== null && listen?.track?.id === youtube;

  const onPlay = () => {
    if (youtube && listen) {
      if (playingHere) listen.close();
      else listen.play({ id: youtube, title: recordingTitle });
    } else {
      setInline((v) => !v);
    }
  };
  const active = playingHere || inline;

  return (
    <article
      className={cn(
        'group relative overflow-hidden border transition-colors duration-500',
        item.photo ? 'border-transparent bg-night text-paper' : 'border-rule bg-paper hover:border-champagne hover:bg-paper-deep',
      )}
    >
      {item.photo ? (
        <div className="relative">
          <Image
            src={item.photo.src}
            alt={item.photo.alt}
            width={item.photo.width}
            height={item.photo.height}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="h-auto w-full opacity-90 transition-[transform,opacity] duration-[1200ms] ease-(--ease-out-soft) group-hover:scale-[1.03] group-hover:opacity-100"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
        </div>
      ) : (
        // Typographic card: the role's initial as a large champagne watermark.
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 -right-2 font-display text-[9rem] leading-none font-semibold text-champagne/25 transition-transform duration-700 ease-(--ease-out-soft) select-none group-hover:-translate-x-2"
        >
          {title.charAt(0)}
        </span>
      )}

      <div className={cn('relative p-6 md:p-7', item.photo && 'on-dark absolute inset-x-0 bottom-0')}>
        <div className="flex items-center justify-between gap-3">
          <p className={cn('eyebrow', item.photo ? 'text-champagne' : 'text-accent')}>{item.composer}</p>
          {item.inPreparation && (
            <span
              className={cn(
                'eyebrow shrink-0 rounded-full border border-champagne px-2.5 py-0.5 text-[0.6875rem]',
                item.photo ? 'text-champagne' : 'text-accent',
              )}
            >
              {labels.inPreparation}
            </span>
          )}
        </div>
        <h4 className="mt-3 font-display text-[1.75rem] leading-[1.1] font-semibold text-balance">{title}</h4>
        {item.role && <p className={cn('mt-1 font-display text-lg', item.photo ? 'text-paper/85' : 'text-ink-soft')}>{item.work}</p>}

        {(item.recording || item.recordingUrl) && (
          <div className="mt-5">
            {item.recording ? (
              <button
                type="button"
                onClick={onPlay}
                aria-pressed={active}
                className={cn(
                  'inline-flex min-h-10 items-center gap-2.5 rounded-full border px-4 text-[0.75rem] font-semibold tracking-[0.12em] uppercase transition-colors',
                  item.photo
                    ? 'border-paper/60 hover:border-paper hover:bg-paper/10'
                    : active
                      ? 'border-ink bg-ink text-paper'
                      : 'border-champagne hover:border-ink',
                )}
              >
                {playingHere ? (
                  <Equalizer className="text-champagne" />
                ) : inline ? (
                  <Pause aria-hidden className="size-3.5" strokeWidth={2} />
                ) : (
                  <Play aria-hidden className="size-3.5" strokeWidth={2} fill="currentColor" />
                )}
                {active ? labels.closeRecording : labels.listen}
                <span className="sr-only">: {recordingTitle}</span>
              </button>
            ) : (
              <a
                href={item.recordingUrl ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-champagne px-4 text-[0.75rem] font-semibold tracking-[0.12em] uppercase hover:border-ink"
              >
                {labels.openRecording}
                <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.75} />
                <span className="sr-only">: {recordingTitle}</span>
              </a>
            )}
          </div>
        )}
      </div>

      {inline && item.recording && item.recording.kind !== 'youtube' && (
        <div className="relative px-6 pb-6 md:px-7">
          <RecordingEmbed recording={item.recording} title={recordingTitle} />
        </div>
      )}
    </article>
  );
}
