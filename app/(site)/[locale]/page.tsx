import type { Metadata } from 'next';
import { preconnect } from 'react-dom';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { ReviewCarousel } from '@/components/ReviewCarousel';
import { UpcomingPerformances } from '@/components/UpcomingPerformances';
import { YouTube } from '@/components/YouTube';
import { Button, DisplayHeading, Eyebrow, Reveal, Section } from '@/components/ui';
import { getAbout, getHome, getReviews, getSchedule, getSettings, getVideos, toPerformanceView } from '@/lib/content';
import { getDictionary, localePath, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';
import { ARTIST_NAME, absoluteUrl } from '@/lib/site';

// The hero's "next performance" and the upcoming list depend on today's date.
export const revalidate = 86400;

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(props), '/');
}

export default async function HomePage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);
  const [home, about, schedule, reviews, settings, videos] = await Promise.all([
    getHome(locale),
    getAbout(locale),
    getSchedule(locale),
    getReviews(),
    getSettings(locale),
    getVideos(),
  ]);

  const upcoming = schedule.upcoming.slice(0, 4).map((p) => toPerformanceView(p, locale));
  const featured = reviews.filter((r) => r.featured);
  const featuredVideo = home.featuredVideoId
    ? (videos.find((v) => v.id === home.featuredVideoId) ?? { id: home.featuredVideoId, title: ARTIST_NAME, description: '', production: '' })
    : null;
  if (featuredVideo) preconnect('https://i.ytimg.com');
  const scheduleHref = localePath(locale, '/schedule');
  const ctaHref = home.ctaLink.startsWith('/') ? localePath(locale, home.ctaLink) : home.ctaLink;

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: ARTIST_NAME,
    jobTitle: `Opera singer (${about.voiceType})`,
    description: settings.seoDescription || undefined,
    url: absoluteUrl(localePath(locale, '/')),
    image: home.heroImage ? absoluteUrl(home.heroImage) : undefined,
    sameAs: settings.socials.map((s) => s.url),
  };

  return (
    <>
      <JsonLd data={person} />
      <Hero
        image={home.heroImage}
        voiceType={about.voiceType}
        headline={home.headline}
        subheadline={home.subheadline}
        next={upcoming[0] ?? null}
        scheduleHref={scheduleHref}
        labels={{ nextPerformance: t.common.nextPerformance, schedule: t.nav.schedule }}
      />

      <Section id="schedule" aria-labelledby="schedule-title" className="scroll-mt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <DisplayHeading id="schedule-title" size="md">
            {t.home.upcoming}
          </DisplayHeading>
          <Link href={scheduleHref} className="link-draw inline-flex items-center gap-3 text-sm font-semibold tracking-[0.12em] uppercase">
            {t.common.viewAll}
            <span className="sr-only">: {t.nav.schedule}</span>
            <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
          </Link>
        </div>
        <div className="mt-10">
          {upcoming.length > 0 ? (
            <UpcomingPerformances
              performances={upcoming}
              labels={{
                tickets: t.common.tickets,
                types: { opera: t.schedule.opera, concert: t.schedule.concert },
              }}
            />
          ) : (
            <p className="text-lg text-muted">{t.home.noUpcoming}</p>
          )}
        </div>
      </Section>

      {home.intro && (
        <Section id="intro" variant="deep">
          <Reveal className="grid gap-10 md:grid-cols-[1fr_2.2fr] md:gap-16">
            <Eyebrow>{t.about.eyebrow}</Eyebrow>
            <div>
              <p className="font-display text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.4] font-medium text-balance">{home.intro}</p>
              <Link href={localePath(locale, '/about')} className="link-draw mt-10 inline-flex items-center gap-3 text-sm font-semibold tracking-[0.12em] uppercase">
                {t.common.readMore}
                <span className="sr-only">: {t.nav.about}</span>
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
              </Link>
            </div>
          </Reveal>
        </Section>
      )}

      {featuredVideo && (
        <Section variant="dark" aria-labelledby="video-title">
          <div className="grid gap-10 md:grid-cols-[1fr_2.4fr] md:gap-16">
            <div>
              <p className="eyebrow text-paper/85">{t.home.featuredVideo}</p>
              <DisplayHeading id="video-title" size="md" className="mt-4">
                {featuredVideo.title}
              </DisplayHeading>
              {featuredVideo.production && <p className="mt-4 text-paper/85">{featuredVideo.production}</p>}
              <Link href={localePath(locale, '/gallery')} className="link-draw mt-8 inline-flex items-center gap-3 text-sm font-semibold tracking-[0.12em] text-paper uppercase">
                {t.gallery.videos}
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
              </Link>
            </div>
            <Reveal>
              <YouTube url={featuredVideo.id} title={featuredVideo.title} playLabel={t.gallery.playVideo} />
            </Reveal>
          </div>
        </Section>
      )}

      {featured.length > 0 && (
        <Section aria-labelledby="press-title">
          <Eyebrow as="h2">
            <span id="press-title">{t.home.press}</span>
          </Eyebrow>
          <div className="mt-14">
            <ReviewCarousel reviews={featured} labels={t.reviews} />
          </div>
          <Link href={localePath(locale, '/reviews')} className="link-draw mt-12 inline-flex items-center gap-3 text-sm font-semibold tracking-[0.12em] uppercase">
            {t.reviews.title}
            <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
          </Link>
        </Section>
      )}

      {home.ctaText && ctaHref && (
        <Section variant="deep" innerClassName="text-center">
          <Reveal>
            <DisplayHeading size="lg" className="mx-auto max-w-3xl">
              {home.ctaText}
            </DisplayHeading>
            <Button href={ctaHref} className="mt-12">
              {ctaHref.includes('contact') ? t.nav.contact : t.common.readMore}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Button>
          </Reveal>
        </Section>
      )}
    </>
  );
}
