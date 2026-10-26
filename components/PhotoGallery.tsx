'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
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
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-(--ease-out-soft) group-hover:scale-[1.04]"
                />
                <span className="sr-only">
                  {openLabel}: {photo.caption || photo.alt}
                </span>
              </button>
              {(photo.caption || photo.credit) && (
                <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-rule pt-3">
                  <span className="font-display text-lg leading-snug">{photo.caption}</span>
                  {photo.credit && <span className="shrink-0 text-sm text-muted">{photo.credit}</span>}
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
