import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { PerformanceView } from '@/lib/content';

/**
 * Asymmetric split hero: name and season details on the left, a tall
 * portrait cropped to the right edge with a slow Ken Burns settle.
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
  labels: { nextPerformance: string; scroll: string };
}) {
  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-paper pt-16 md:pt-20">
      {/* Vertical running title on the left edge, like a catalogue spine. */}
      <p
        aria-hidden
        className="eyebrow absolute top-1/2 left-3 hidden -translate-y-1/2 rotate-180 text-stone [writing-mode:vertical-rl] xl:block"
      >
        Anna Avdalyan — {voiceType}
      </p>

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1200px] grid-cols-1 px-4 sm:px-6 md:min-h-[calc(100svh-5rem)] md:grid-cols-[1fr_1.05fr] md:px-10">
        <div className="relative z-10 flex flex-col justify-end pt-10 pb-10 md:justify-center md:py-20 md:pr-12">
          <p className="eyebrow text-lapis">{voiceType}</p>
          <h1 className="mt-6 font-display text-[clamp(4rem,10vw,9rem)] leading-[0.86] font-normal tracking-[-0.03em]">
            Anna
            <br />
            <span className="italic">Avdalyan</span>
          </h1>
          {headline && <p className="mt-8 max-w-md font-display text-2xl leading-snug italic text-ink-soft md:text-[1.75rem]">{headline}</p>}
          {subheadline && <p className="eyebrow mt-5 text-muted">{subheadline}</p>}

          {next && (
            <Link
              href={next.ticketsUrl ?? scheduleHref}
              {...(next.ticketsUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group mt-10 inline-flex max-w-full items-center gap-4 self-start border border-rule bg-paper/80 py-3 pr-4 pl-5 backdrop-blur transition-colors duration-300 hover:border-lapis"
            >
              <span className="min-w-0">
                <span className="eyebrow block text-[0.625rem] text-lapis">{labels.nextPerformance}</span>
                <span className="mt-1 block truncate text-sm">
                  {next.day} {next.month} · <span className="italic">{next.role || next.title}</span> · {next.venue}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.25}
              />
            </Link>
          )}
        </div>

        <div className="relative -mx-4 order-first aspect-[4/5] overflow-hidden bg-paper-deep sm:-mx-6 md:order-none md:mx-0 md:-mr-10 md:aspect-auto md:h-full min-[1200px]:-mr-[calc((100vw-1200px)/2+2.5rem)]">
          {image && (
            <Image
              src={image}
              alt="Anna Avdalyan, soprano"
              fill
              priority
              sizes="(min-width: 768px) 55vw, 100vw"
              className="animate-ken-burns object-cover object-[50%_25%]"
            />
          )}
          <span aria-hidden className="absolute inset-y-0 left-0 hidden w-px bg-rule md:block" />
        </div>
      </div>

      <a
        href="#intro"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-muted md:left-10 md:flex md:translate-x-0 lg:left-[max(2.5rem,calc((100vw-1200px)/2+2.5rem))]"
      >
        <span className="eyebrow text-[0.625rem]">{labels.scroll}</span>
        <span aria-hidden className="relative h-12 w-px overflow-hidden bg-rule">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.4s_ease-in-out_infinite] bg-ink" />
        </span>
      </a>
    </section>
  );
}
