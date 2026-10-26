'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { parseYouTubeId, youTubeEmbedUrl, youTubeThumbnail } from '@/lib/youtube';
import { cn } from './ui/cn';

/**
 * Privacy-friendly YouTube player: shows a thumbnail first and only loads the
 * youtube-nocookie iframe after a click, so the video plays inside the site.
 * Renders nothing for an invalid link.
 */
export function YouTube({
  url,
  title,
  playLabel = 'Play video',
  autoStart = false,
  priority = false,
  className,
}: {
  url: string;
  title: string;
  playLabel?: string;
  /** Start the player immediately (only after a user gesture, e.g. a filmstrip click). */
  autoStart?: boolean;
  /** Load the thumbnail eagerly (for a player above the fold). */
  priority?: boolean;
  className?: string;
}) {
  const id = parseYouTubeId(url);
  const [playing, setPlaying] = useState(autoStart);
  const [hiRes, setHiRes] = useState(false);
  const hiResRef = useRef<HTMLImageElement>(null);

  // hqdefault always exists; maxresdefault is layered on top only if it really
  // loaded (YouTube answers a missing one with a 120×90 placeholder).
  const acceptHiRes = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 120) setHiRes(true);
  };
  useEffect(() => acceptHiRes(hiResRef.current), []);

  if (!id) return null;

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden bg-night', className)}>
      {playing ? (
        <iframe
          src={youTubeEmbedUrl(id)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full cursor-pointer"
          aria-label={`${playLabel}: ${title}`}
        >
          {/* Served through next/image so an above-the-fold player can be preloaded from our own origin. */}
          <Image
            src={youTubeThumbnail(id, 'hqdefault')}
            alt=""
            fill
            preload={priority}
            sizes="(min-width: 1200px) 1120px, 100vw"
            className="object-cover opacity-90 transition-[transform,opacity] duration-700 ease-(--ease-out-soft) group-hover:scale-[1.02] group-hover:opacity-100"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail */}
          <img
            ref={hiResRef}
            src={youTubeThumbnail(id, 'maxresdefault')}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={(e) => acceptHiRes(e.currentTarget)}
            className={cn(
              'absolute inset-0 size-full object-cover transition-[transform,opacity] duration-700 ease-(--ease-out-soft) group-hover:scale-[1.02]',
              hiRes ? 'opacity-90 group-hover:opacity-100' : 'opacity-0',
            )}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" aria-hidden />
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/25 text-white backdrop-blur-sm transition-[transform,background-color] duration-300 group-hover:scale-105 group-hover:bg-lapis/80 md:size-20"
          >
            <Play className="ml-1 size-6 md:size-7" strokeWidth={1.25} fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}
