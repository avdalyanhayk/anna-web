import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { PerformanceView } from '@/lib/content';
import { Countdown, type CountdownLabels } from './Countdown';
import { ParallaxLayer } from './ParallaxLayer';

/**
 * Cinematic hero. On larger screens the page is a dark stage with the
 * portrait as a lit panel on the right; the name, in large capitals, runs
 * across the edge of the photo and is drawn with `mix-blend-mode: difference`,
 * so it stays legible over the dark stage, a light backdrop and dark clothing
 * alike. A warm spotlight breathes behind it. On phones the photo stays
 * full-bleed under a scrim, like before.
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
  labels: CountdownLabels & { nextPerformance: string; schedule: string; scroll: string };
}) {
  return (
    <section className="on-dark relative isolate flex min-h-svh items-end overflow-hidden bg-night text-paper">
      {image && (
        <ParallaxLayer className="absolute inset-0 -z-20 md:left-auto md:w-[46%]">
          <Image
            src={image}
            alt="Anna Avdalyan, soprano"
            fill
            preload
            sizes="(min-width: 768px) 46vw, 100vw"
            className="animate-ken-burns object-cover object-[50%_22%]"
          />
        </ParallaxLayer>
      )}
      {/* Phones: scrim keeps the type at AA contrast over the full-bleed photo. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/60 to-night/5 md:hidden" />
      {/* Larger screens: spotlight on the stage, and a champagne edge where it meets the photo. */}
      <div aria-hidden className="hero-spotlight absolute inset-0 -z-10 hidden md:block" />
      {image && <div aria-hidden className="absolute inset-y-0 right-[46%] -z-10 hidden w-px bg-champagne/50 md:block" />}

      <div className="mx-auto w-full max-w-[1400px] px-4 pt-32 pb-12 sm:px-6 md:px-10 md:pt-40 md:pb-16">
        <p className="hero-fade eyebrow flex items-center gap-4 text-champagne">
          <span aria-hidden className="h-px w-10 bg-champagne" />
          {voiceType}
        </p>

        <h1 className="wordmark mt-5 text-[clamp(3.25rem,15vw,5.5rem)] leading-[0.92] md:text-[clamp(5rem,10.4vw,10.5rem)] md:mix-blend-difference">
          <span className="hero-line block">
            <span>Anna</span>
          </span>
          <span className="hero-line block md:pl-[0.55em]">
            <span>Avdalyan</span>
          </span>
        </h1>

        <div className="hero-fade mt-8 md:mt-10 md:max-w-[min(34rem,48%)]" style={{ animationDelay: '0.45s' }}>
          {headline && (
            <p className="font-display text-[clamp(1.125rem,1.8vw,1.625rem)] leading-snug font-medium text-paper">{headline}</p>
          )}
          {subheadline && <p className="eyebrow mt-4 text-paper/80">{subheadline}</p>}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch">
            {next && (
              <Link
                href={next.productionUrl ?? scheduleHref}
                {...(next.productionUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex min-w-0 items-center justify-between gap-6 bg-paper py-4 pr-5 pl-6 text-ink transition-colors duration-300 hover:bg-paper-deep sm:max-w-md"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-3">
                    <span className="eyebrow text-accent">{labels.nextPerformance}</span>
                    <Countdown date={next.date} labels={labels} className="text-[0.6875rem] text-muted" />
                  </span>
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
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue: a champagne thread running down. */}
      <div aria-hidden className="absolute right-[calc(46%+2.5rem)] bottom-0 hidden h-24 flex-col items-center gap-3 lg:flex">
        <span className="eyebrow text-[0.625rem] text-paper/60 [writing-mode:vertical-rl]">{labels.scroll}</span>
        <span className="relative h-10 w-px overflow-hidden bg-paper/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.4s_var(--ease-out-soft)_infinite] bg-champagne" />
        </span>
      </div>
    </section>
  );
}
