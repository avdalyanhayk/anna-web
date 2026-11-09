'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Play, X } from 'lucide-react';
import { youTubeEmbedUrl } from '@/lib/youtube';
import { cn } from './ui/cn';

/**
 * "Listen" — a small player that keeps playing while visitors move through the
 * site (it lives in the root layout, which persists across navigations).
 * It plays YouTube videos already entered in the admin (Home → featured video,
 * else the first video), so it needs no extra content fields. The video stays
 * visible in the player, as YouTube's terms require; nothing ever autoplays.
 */

export type Track = { id: string; title: string; subtitle?: string };

type ListenLabels = { listen: string; nowPlaying: string; closePlayer: string };

type ListenContextValue = {
  track: Track | null;
  defaultTrack: Track | null;
  play: (track?: Track) => void;
  close: () => void;
  labels: ListenLabels;
};

const ListenContext = createContext<ListenContextValue | null>(null);

export function useListen() {
  return useContext(ListenContext);
}

export function ListenProvider({
  defaultTrack,
  labels,
  children,
}: {
  defaultTrack: Track | null;
  labels: ListenLabels;
  children: React.ReactNode;
}) {
  const [track, setTrack] = useState<Track | null>(null);
  const play = useCallback((next?: Track) => setTrack(next ?? defaultTrack), [defaultTrack]);
  const close = useCallback(() => setTrack(null), []);
  const value = useMemo(() => ({ track, defaultTrack, play, close, labels }), [track, defaultTrack, play, close, labels]);

  return (
    <ListenContext.Provider value={value}>
      {children}
      <MiniPlayer />
    </ListenContext.Provider>
  );
}

/** Four champagne bars that "sing" while the player is open (still under reduced motion). */
export function Equalizer({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('equalizer inline-flex h-3.5 items-end gap-[3px]', className)}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

/** Header / mobile-bar control: opens the default track, or closes the player when it is open. */
export function ListenButton({ className, variant = 'text' }: { className?: string; variant?: 'text' | 'round' }) {
  const ctx = useListen();
  if (!ctx?.defaultTrack) return null;
  const { track, play, close, labels } = ctx;
  const open = track !== null;

  return (
    <button
      type="button"
      onClick={() => (open ? close() : play())}
      aria-pressed={open}
      className={cn(
        variant === 'round'
          ? 'flex size-11 shrink-0 items-center justify-center rounded-full border border-champagne/70 text-paper'
          : 'min-h-10 items-center gap-2.5 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase opacity-90 hover:opacity-100',
        // cn() does not merge conflicting utilities, so the display class comes from the caller when given.
        variant === 'text' && !className && 'inline-flex',
        className,
      )}
    >
      {open ? <Equalizer className="text-champagne" /> : <Play aria-hidden className="size-3.5" strokeWidth={2} fill="currentColor" />}
      {variant === 'text' ? <span>{labels.listen}</span> : <span className="sr-only">{labels.listen}</span>}
    </button>
  );
}

function MiniPlayer() {
  const ctx = useListen();
  const track = ctx?.track ?? null;
  const close = ctx?.close;

  useEffect(() => {
    if (!track || !close) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.activeElement?.closest('[data-mini-player]')) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [track, close]);

  if (!ctx) return null;

  return (
    <AnimatePresence>
      {track && (
        <motion.aside
          key="mini-player"
          data-mini-player
          aria-label={ctx.labels.nowPlaying}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ viewTransitionName: 'mini-player' }}
          className="on-dark fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 z-[45] w-[min(21rem,calc(100vw-1.5rem))] border border-champagne/30 bg-night text-paper shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] md:bottom-6 md:left-6"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <Equalizer className="text-champagne" />
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-[0.6875rem] text-champagne">{ctx.labels.nowPlaying}</p>
              <p className="truncate text-sm font-medium" title={track.title}>
                {track.title}
              </p>
            </div>
            <button
              type="button"
              onClick={ctx.close}
              className="-mr-2 flex size-10 shrink-0 items-center justify-center text-paper/80 hover:text-paper"
            >
              <X aria-hidden className="size-4" strokeWidth={1.75} />
              <span className="sr-only">{ctx.labels.closePlayer}</span>
            </button>
          </div>
          <div className="relative aspect-video w-full bg-black">
            <iframe
              key={track.id}
              src={youTubeEmbedUrl(track.id)}
              title={track.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
