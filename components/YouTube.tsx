'use client';

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
  className,
}: {
  url: string;
  title: string;
  playLabel?: string;
  /** Start the player immediately (only after a user gesture, e.g. a filmstrip click). */
  autoStart?: boolean;
  className?: string;
}) {
  const id = parseYouTubeId(url);
  const [playing, setPlaying] = useState(autoStart);
  const [quality, setQuality] = useState<'maxresdefault' | 'hqdefault'>('maxresdefault');
  const imgRef = useRef<HTMLImageElement>(null);

  // YouTube answers a missing maxres thumbnail with a 120×90 grey image.
  const checkThumb = (img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0 && img.naturalWidth <= 120) setQuality('hqdefault');
  };
  useEffect(() => checkThumb(imgRef.current), []);

  if (!id) return null;

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden bg-night', className)}>
      {playing ? (
        <iframe
          src={youTubeEmbedUrl(id)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
          {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail, keeps image-optimisation quota free */}
          <img
            ref={imgRef}
            src={youTubeThumbnail(id, quality)}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={(e) => checkThumb(e.currentTarget)}
            onError={() => setQuality('hqdefault')}
            className="absolute inset-0 size-full object-cover opacity-90 transition-[transform,opacity] duration-700 ease-(--ease-out-soft) group-hover:scale-[1.02] group-hover:opacity-100"
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
