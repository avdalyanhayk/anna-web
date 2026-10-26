import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { PerformanceView } from '@/lib/content';

/**
 * Photo-led hero: a full-bleed portrait with a warm dark scrim, the name as a
 * solid capitals wordmark, and the next performance one tap away.
 */
export function Hero({
  image,
  voiceType,
  headline,
  subheadline,
  next,
  scheduleHref,
  labels,
}: {
  image: string | null;
  voiceType: string;
  headline: string;
  subheadline: string;
  next: PerformanceView | null;
  scheduleHref: string;
  labels: { nextPerformance: string; schedule: string };
}) {
  return (
    <section className="on-dark relative isolate flex min-h-[92svh] items-end overflow-hidden bg-night text-paper">
      {image && (
        <Image
          src={image}
          alt="Anna Avdalyan, soprano"
          fill
          preload
          sizes="100vw"
          className="-z-20 animate-ken-burns object-cover object-[50%_25%]"
        />
      )}
      {/* Scrim keeps the type at AA contrast on any photo. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/55 to-night/10" />

      <div className="mx-auto w-full max-w-[1200px] px-4 pt-32 pb-12 sm:px-6 md:px-10 md:pb-20">
        <p className="eyebrow text-champagne">{voiceType}</p>
        <h1 className="wordmark mt-4 text-[clamp(3rem,9vw,7rem)] text-balance">Anna Avdalyan</h1>
        {headline && (
          <p className="mt-6 max-w-2xl font-display text-[clamp(1.375rem,2.4vw,1.875rem)] leading-snug font-medium text-paper">
            {headline}
          </p>
        )}
        {subheadline && <p className="eyebrow mt-4 text-paper/85">{subheadline}</p>}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch">
          {next && (
            <Link
              href={next.ticketsUrl ?? scheduleHref}
              {...(next.ticketsUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex min-w-0 items-center justify-between gap-6 bg-paper py-4 pr-5 pl-6 text-ink transition-colors duration-300 hover:bg-paper-deep sm:max-w-md"
            >
              <span className="min-w-0">
                <span className="eyebrow block text-accent">{labels.nextPerformance}</span>
                <span className="mt-1 block truncate font-semibold">
                  {next.day} {next.month} · {next.title}
                </span>
                <span className="block truncate text-sm text-muted">
                  {[next.role, next.venue].filter(Boolean).join(' · ')}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </Link>
          )}
          <a
            href="#schedule"
            className="inline-flex min-h-12 items-center justify-center gap-3 border border-paper/60 px-6 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase transition-colors hover:border-paper hover:bg-paper/10"
          >
            {labels.schedule}
            <ArrowDown aria-hidden className="size-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </section>
  );
}
