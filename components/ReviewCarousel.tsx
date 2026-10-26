'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { Review } from '@/lib/content';
import { cn } from './ui/cn';

const INTERVAL = 7000;

export function ReviewCarousel({
  reviews,
  labels,
}: {
  reviews: Review[];
  labels: { previous: string; next: string; pause: string; play: string };
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const count = reviews.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  // Auto-advance unless paused, hovered/focused, or the visitor prefers reduced motion.
  useEffect(() => {
    if (count < 2 || paused || hovered || reduce) return;
    const timer = window.setInterval(() => go(1), INTERVAL);
    return () => window.clearInterval(timer);
  }, [count, paused, hovered, reduce, go]);

  if (count === 0) return null;
  const review = reviews[index];

  const onDragEnd = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Press reviews"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
    >
      <span aria-hidden className="block font-display text-8xl leading-[0.5] text-lapis md:text-9xl">
        &ldquo;
      </span>
      <div className="relative mt-6 grid min-h-[20rem] md:min-h-[16rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={review.slug}
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${count}`}
            className="relative col-start-1 row-start-1 cursor-grab touch-pan-y active:cursor-grabbing"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
          >
            <blockquote className="max-w-4xl font-display text-[clamp(1.625rem,3.4vw,2.75rem)] leading-[1.25] text-balance">
              {review.quote}
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="eyebrow text-ink">{review.source}</span>
              {review.critic && <span className="text-sm text-muted">— {review.critic}</span>}
              {review.production && <span className="text-sm text-muted italic">{review.production}</span>}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-10 flex items-center justify-between gap-6 border-t border-rule pt-6">
          <div className="flex items-center gap-3" aria-hidden>
            {reviews.map((r, i) => (
              <span
                key={r.slug}
                className={cn('h-px transition-all duration-500', i === index ? 'w-10 bg-lapis' : 'w-4 bg-stone/50')}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPaused((p) => !p)} className="flex size-12 items-center justify-center text-muted hover:text-ink">
              {paused ? <Play aria-hidden className="size-4" strokeWidth={1.25} /> : <Pause aria-hidden className="size-4" strokeWidth={1.25} />}
              <span className="sr-only">{paused ? labels.play : labels.pause}</span>
            </button>
            <button type="button" onClick={() => go(-1)} className="flex size-12 items-center justify-center rounded-full border border-rule hover:border-ink">
              <ChevronLeft aria-hidden className="size-5" strokeWidth={1.25} />
              <span className="sr-only">{labels.previous}</span>
            </button>
            <button type="button" onClick={() => go(1)} className="flex size-12 items-center justify-center rounded-full border border-rule hover:border-ink">
              <ChevronRight aria-hidden className="size-5" strokeWidth={1.25} />
              <span className="sr-only">{labels.next}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
