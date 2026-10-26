'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type { Video } from '@/lib/content';
import { youTubeThumbnail } from '@/lib/youtube';
import { YouTube } from './YouTube';
import { cn } from './ui/cn';

export function VideoFilmstrip({
  videos,
  labels,
}: {
  videos: Video[];
  labels: { playVideo: string; moreVideos: string };
}) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const active = videos[index];
  if (!active) return null;

  const select = (i: number) => {
    setIndex(i);
    setStarted(true);
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div>
      <div ref={stageRef} className="scroll-mt-24">
        <YouTube
          key={active.id}
          url={active.id}
          title={active.title}
          playLabel={labels.playVideo}
          autoStart={started}
          priority
        />
        <div className="mt-6 grid gap-2 md:grid-cols-[1fr_1fr] md:gap-10" aria-live="polite">
          <div>
            <h3 className="font-display text-2xl md:text-3xl">{active.title}</h3>
            {active.production && <p className="eyebrow mt-3 text-paper/60">{active.production}</p>}
          </div>
          {active.description && <p className="text-paper/75 leading-relaxed">{active.description}</p>}
        </div>
      </div>

      {videos.length > 1 && (
        <div className="mt-12">
          <h3 className="eyebrow text-paper/60">{labels.moreVideos}</h3>
          <ul className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:scroll-px-0 md:px-0">
            {videos.map((video, i) => (
              <li key={video.id} className="w-[70%] shrink-0 snap-start sm:w-[42%] md:w-[calc((100%-3rem)/4)]">
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-current={i === index ? 'true' : undefined}
                  aria-label={`${labels.playVideo}: ${video.title}`}
                  className="group block w-full text-left"
                >
                  <span
                    className={cn(
                      'relative block aspect-video overflow-hidden outline outline-1 -outline-offset-1 transition-[outline-color] duration-300',
                      i === index ? 'outline-paper' : 'outline-transparent group-hover:outline-paper/40',
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail */}
                    <img
                      src={youTubeThumbnail(video.id)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={cn(
                        'size-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-[1.03]',
                        i === index ? 'opacity-100' : 'opacity-60 group-hover:opacity-90',
                      )}
                    />
                    {i !== index && (
                      <Play
                        aria-hidden
                        className="absolute right-3 bottom-3 size-4 text-white"
                        strokeWidth={1.25}
                        fill="currentColor"
                      />
                    )}
                  </span>
                  <span className={cn('mt-3 block text-sm leading-snug', i === index ? 'text-paper' : 'text-paper/70')}>
                    {video.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
