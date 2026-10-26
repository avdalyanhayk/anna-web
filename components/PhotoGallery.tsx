'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { Photo } from '@/lib/content';

// The lightbox (and its CSS) loads only when a photo is opened.
const PhotoLightbox = dynamic(() => import('./PhotoLightbox'), { ssr: false });

export function PhotoGallery({ photos, openLabel }: { photos: Photo[]; openLabel: string }) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <li key={`${photo.src}-${i}`}>
            <figure>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-paper-deep"
              >
                {/* Plain <img> keeps gallery thumbnails out of the Vercel image-optimisation quota. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-[1200ms] ease-(--ease-out-soft) group-hover:scale-[1.04]"
                />
                <span className="sr-only">
                  {openLabel}: {photo.caption || photo.alt}
                </span>
              </button>
              {(photo.caption || photo.credit) && (
                <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-rule pt-3">
                  <span className="font-display text-lg leading-snug italic">{photo.caption}</span>
                  {photo.credit && <span className="shrink-0 text-xs text-muted">{photo.credit}</span>}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
      {index !== null && <PhotoLightbox photos={photos} index={index} onClose={() => setIndex(null)} />}
    </>
  );
}
