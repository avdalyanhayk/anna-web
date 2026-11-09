'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import type { Photo, PhotoCategory } from '@/lib/content';

// The lightbox (and its CSS) loads only when a photo is opened.
const PhotoLightbox = dynamic(() => import('./PhotoLightbox'), { ssr: false });

const CHAPTERS: PhotoCategory[] = ['stage', 'portrait'];

/**
 * The gallery in chapters — "On stage", then "Portraits" — in the order set in
 * the admin. Every photo keeps its real proportions (nothing cropped). Phones
 * get a swipeable filmstrip per chapter; larger screens a masonry wall.
 */
export function PhotoGallery({
  photos,
  labels,
}: {
  photos: Photo[];
  labels: { openPhoto: string; portrait: string; stage: string };
}) {
  const [open, setOpen] = useState<{ chapter: PhotoCategory; index: number } | null>(null);
  const chapters = CHAPTERS.map((category) => ({ category, photos: photos.filter((p) => p.category === category) })).filter(
    (c) => c.photos.length > 0,
  );
  const openList = open ? (chapters.find((c) => c.category === open.chapter)?.photos ?? []) : [];

  return (
    <>
      <div className="space-y-20 md:space-y-28">
        {chapters.map(({ category, photos: list }, ci) => (
          <section key={category} aria-labelledby={`chapter-${category}`}>
            <div className="mb-8 flex items-baseline gap-5 md:mb-12">
              <span aria-hidden className="font-display text-xl text-accent tabular-nums">
                {['I', 'II'][ci]}
              </span>
              <h3 id={`chapter-${category}`} className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold">
                {labels[category]}
              </h3>
              <span aria-hidden className="h-px flex-1 self-center bg-champagne" />
              <span className="eyebrow text-muted tabular-nums">{list.length}</span>
            </div>

            <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:block sm:gap-6 sm:overflow-visible sm:px-0 sm:columns-2 lg:columns-3">
              {list.map((photo, i) => (
                <li key={`${photo.src}-${i}`} className="w-max max-w-[85vw] shrink-0 snap-center sm:mb-10 sm:w-auto sm:max-w-none sm:break-inside-avoid">
                  <figure>
                    <button
                      type="button"
                      onClick={() => setOpen({ chapter: category, index: i })}
                      className="group block w-full cursor-zoom-in overflow-hidden bg-paper-deep"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 85vw"
                        className="h-[58svh] max-w-[85vw] w-auto object-contain transition-transform duration-[1200ms] ease-(--ease-out-soft) group-hover:scale-[1.03] sm:h-auto sm:w-full sm:max-w-none"
                      />
                      <span className="sr-only">
                        {labels.openPhoto}: {photo.caption || photo.alt}
                      </span>
                    </button>
                    {(photo.caption || photo.credit) && (
                      <figcaption className="mt-3 flex w-0 min-w-full items-baseline justify-between gap-4 border-t border-champagne/60 pt-3">
                        <span className="font-display text-lg leading-snug">{photo.caption}</span>
                        {photo.credit && <span className="shrink-0 text-sm text-muted">{photo.credit}</span>}
                      </figcaption>
                    )}
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {open && <PhotoLightbox photos={openList} index={open.index} onClose={() => setOpen(null)} />}
    </>
  );
}
