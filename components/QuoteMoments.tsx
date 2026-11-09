'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { Review } from '@/lib/content';

/**
 * Press quotes as full-screen moments: one quote at a time, large, on the dark
 * stage. Each one lifts into view and fades away as the visitor scrolls past —
 * no slider to operate, nothing moves on its own. Reduced motion: plain stack.
 */
export function QuoteMoments({ reviews }: { reviews: Review[] }) {
  return (
    <div>
      {reviews.map((r, i) => (
        <QuoteMoment key={r.slug} review={r} index={i} total={reviews.length} />
      ))}
    </div>
  );
}

function QuoteMoment({ review, index, total }: { review: Review; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.38, 0.62, 0.9], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.1, 0.38, 0.62, 0.9], [60, 0, 0, -60]);
  const markScale = useTransform(scrollYProgress, [0.1, 0.45], [0.6, 1]);
  const long = review.quote.length > 180;

  return (
    <figure ref={ref} className="flex min-h-[78svh] flex-col justify-center py-16">
      <motion.div style={reduce ? undefined : { opacity, y }} className="grid gap-8 md:grid-cols-[7rem_1fr] md:gap-12">
        <div className="flex items-start justify-between md:flex-col md:justify-start md:gap-6">
          <motion.span
            aria-hidden
            style={reduce ? undefined : { scale: markScale }}
            className="block origin-top-left font-display text-[7rem] leading-[0.6] text-champagne md:text-[10rem]"
          >
            &ldquo;
          </motion.span>
          <span aria-hidden className="eyebrow text-paper/60 tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
        <div>
          <blockquote
            className={
              long
                ? 'max-w-4xl font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.3] font-medium text-balance'
                : 'max-w-5xl font-display text-[clamp(1.875rem,4.4vw,3.75rem)] leading-[1.15] font-medium text-balance'
            }
          >
            {review.quote}
          </blockquote>
          <figcaption className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span aria-hidden className="h-px w-10 bg-champagne" />
            {review.source && <span className="eyebrow text-paper">{review.source}</span>}
            {review.critic && <span className="text-sm text-paper/75">— {review.critic}</span>}
            {review.production && <span className="text-sm text-paper/75">{review.production}</span>}
          </figcaption>
        </div>
      </motion.div>
    </figure>
  );
}
