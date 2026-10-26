import type { Metadata } from 'next';
import { preconnect } from 'react-dom';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { ReviewCarousel } from '@/components/ReviewCarousel';
import { SeasonTimeline } from '@/components/SeasonTimeline';
import { YouTube } from '@/components/YouTube';
import { Button, DisplayHeading, Eyebrow, Reveal, Section } from '@/components/ui';
import { getAbout, getHome, getReviews, getSchedule, getSettings, getVideos, toPerformanceView } from '@/lib/content';
import { getDictionary, localePath, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';
import { ARTIST_NAME, absoluteUrl } from '@/lib/site';

// The "next performance" and season ribbon depend on today's date.
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

  const season = schedule.upcoming.slice(0, 6).map((p) => toPerformanceView(p, locale));
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
    email: settings.contactEmail ? `mailto:${settings.contactEmail}` : undefined,
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
        next={season[0] ?? null}
        scheduleHref={scheduleHref}
        labels={{ nextPerformance: t.common.nextPerformance, scroll: t.common.scroll }}
      />

      {home.intro && (
        <Section id="intro" variant="deep" className="scroll-mt-16">
          <Reveal className="grid gap-10 md:grid-cols-[1fr_2.2fr] md:gap-16">
            <Eyebrow>{t.about.eyebrow}</Eyebrow>
            <div>
              <p className="font-display text-[clamp(1.5rem,3vw,2.375rem)] leading-[1.3] text-balance">{home.intro}</p>
              <Link href={localePath(locale, '/about')} className="link-draw mt-10 inline-flex items-center gap-3 text-sm tracking-[0.14em] uppercase">
                {t.common.readMore}
                <span className="sr-only">: {t.nav.about}</span>
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.25} />
              </Link>
            </div>
          </Reveal>
        </Section>
      )}

      <Section aria-labelledby="season-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{t.home.upcoming}</Eyebrow>
            <DisplayHeading id="season-title" className="mt-4">
              {t.home.season}
            </DisplayHeading>
          </div>
          <Link href={scheduleHref} className="link-draw inline-flex items-center gap-3 text-sm tracking-[0.14em] uppercase">
            {t.common.viewAll}
            <span className="sr-only">: {t.nav.schedule}</span>
            <ArrowRight aria-hidden className="size-4" strokeWidth={1.25} />
          </Link>
        </div>
        <div className="mt-14">
          {season.length > 0 ? (
            <>
              <SeasonTimeline
                performances={season}
                scheduleHref={scheduleHref}
                typeLabels={{ opera: t.schedule.opera, concert: t.schedule.concert, recital: t.schedule.recital }}
              />
              {season.length > 3 && <p className="eyebrow mt-8 text-[0.625rem] text-muted">{t.home.seasonHint}</p>}
            </>
          ) : (
            <p className="font-display text-2xl text-muted italic">{t.home.noUpcoming}</p>
          )}
        </div>
      </Section>

      {featuredVideo && (
        <Section variant="dark" aria-labelledby="video-title">
          <div className="grid gap-10 md:grid-cols-[1fr_2.4fr] md:gap-16">
            <div>
              <p className="eyebrow text-paper/60">{t.home.featuredVideo}</p>
              <DisplayHeading id="video-title" size="md" italic className="mt-4">
                {featuredVideo.title}
              </DisplayHeading>
              {featuredVideo.production && <p className="mt-4 text-sm text-paper/70">{featuredVideo.production}</p>}
              <Link href={localePath(locale, '/gallery')} className="link-draw mt-8 inline-flex items-center gap-3 text-sm tracking-[0.14em] text-paper uppercase">
                {t.gallery.videos}
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.25} />
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
          <Link href={localePath(locale, '/reviews')} className="link-draw mt-12 inline-flex items-center gap-3 text-sm tracking-[0.14em] uppercase">
            {t.reviews.title}
            <ArrowRight aria-hidden className="size-4" strokeWidth={1.25} />
          </Link>
        </Section>
      )}

      {home.ctaText && ctaHref && (
        <Section variant="deep" innerClassName="text-center">
          <Reveal>
            <DisplayHeading size="lg" italic className="mx-auto max-w-3xl">
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
