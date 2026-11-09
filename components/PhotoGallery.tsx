'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import type { Photo, PhotoCategory } from '@/lib/content';
import { cn } from './ui/cn';

// The lightbox (and its CSS) loads only when a photo is opened.
const PhotoLightbox = dynamic(() => import('./PhotoLightbox'), { ssr: false });

type Filter = 'all' | PhotoCategory;

export function PhotoGallery({
  photos,
  labels,
}: {
  photos: Photo[];
  labels: { openPhoto: string; all: string; portrait: string; stage: string; filterLabel: string };
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [index, setIndex] = useState<number | null>(null);
  const visible = photos.filter((p) => filter === 'all' || p.category === filter);
  // Only offer the filter when both kinds of photo exist.
  const showFilter = photos.some((p) => p.category === 'portrait') && photos.some((p) => p.category === 'stage');

  return (
    <>
      {showFilter && (
        <div role="group" aria-label={labels.filterLabel} className="mb-10 flex flex-wrap gap-2">
          {(['all', 'portrait', 'stage'] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'min-h-10 rounded-full border px-5 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase transition-colors',
                filter === f ? 'border-ink bg-ink text-paper' : 'border-ink/20 text-ink-soft hover:border-ink',
              )}
            >
              {labels[f]}
            </button>
          ))}
        </div>
      )}

      {/* Masonry columns: every photo keeps its own proportions, so nothing (no head) is cropped. */}
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {visible.map((photo, i) => (
          <li key={`${photo.src}-${i}`} className="mb-10 break-inside-avoid">
            <figure>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group block w-full cursor-zoom-in overflow-hidden bg-paper-deep"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-[1200ms] ease-(--ease-out-soft) group-hover:scale-[1.03]"
                />
                <span className="sr-only">
                  {labels.openPhoto}: {photo.caption || photo.alt}
                </span>
              </button>
              {(photo.caption || photo.credit) && (
                <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-champagne/60 pt-3">
                  <span className="font-display text-lg leading-snug">{photo.caption}</span>
                  {photo.credit && <span className="shrink-0 text-sm text-muted">{photo.credit}</span>}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
      {index !== null && <PhotoLightbox photos={visible} index={index} onClose={() => setIndex(null)} />}
    </>
  );
}
