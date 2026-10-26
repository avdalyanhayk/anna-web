import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/PageIntro';
import { Reveal, Section } from '@/components/ui';
import { getReviews } from '@/lib/content';
import { formatMonthYear } from '@/lib/dates';
import { getDictionary, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  return pageMetadata(locale, '/reviews', { title: getDictionary(locale).reviews.title });
}

export default async function ReviewsPage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);
  const reviews = await getReviews();

  return (
    <>
      <PageIntro eyebrow={t.reviews.eyebrow} title={t.reviews.title} />
      <Section className="pt-0 md:pt-0">
        {reviews.length === 0 ? (
          <p className="font-display text-2xl text-muted">{t.reviews.empty}</p>
        ) : (
          <ul className="gap-x-12 md:columns-2">
            {reviews.map((r, i) => (
              <Reveal as="li" key={r.slug} delay={(i % 2) * 0.08} className="mb-14 break-inside-avoid border-t border-champagne pt-10">
                <figure>
                  <span aria-hidden className="block font-display text-8xl leading-[0.55] text-champagne">
                    &ldquo;
                  </span>
                  <blockquote
                    className={
                      r.quote.length > 160
                        ? 'mt-4 font-display text-[1.5rem] leading-[1.35]'
                        : 'mt-4 font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.25]'
                    }
                  >
                    {r.quote}
                  </blockquote>
                  <figcaption className="mt-8 space-y-1">
                    {r.source && <p className="eyebrow text-ink">{r.source}</p>}
                    <p className="text-sm text-muted">
                      {[r.critic, r.production, r.date && formatMonthYear(r.date, locale)].filter(Boolean).join(' · ')}
                    </p>
                    {r.link && (
                      <a href={r.link} target="_blank" rel="noopener noreferrer" className="link-draw mt-3 inline-flex items-center gap-2 text-[0.8125rem] font-semibold tracking-[0.12em] text-accent uppercase">
                        {t.reviews.readArticle}
                        <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.5} />
                      </a>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
