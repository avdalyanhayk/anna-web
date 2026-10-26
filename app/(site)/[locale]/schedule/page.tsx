import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { PageIntro } from '@/components/PageIntro';
import { ScheduleList } from '@/components/ScheduleList';
import { Section } from '@/components/ui';
import { getSchedule, toPerformanceView, type Performance } from '@/lib/content';
import { getDictionary, localePath, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';
import { ARTIST_NAME, absoluteUrl } from '@/lib/site';

// Re-split upcoming/past once a day.
export const revalidate = 86400;

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  return pageMetadata(locale, '/schedule', { title: getDictionary(locale).nav.schedule });
}

function musicEvent(p: Performance, url: string) {
  const time = /^\d{1,2}:\d{2}$/.test(p.time) ? `T${p.time.padStart(5, '0')}` : '';
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: p.title,
    startDate: `${p.date}${time}`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url,
    location: {
      '@type': 'Place',
      name: p.venue || p.city,
      address: { '@type': 'PostalAddress', addressLocality: p.city || undefined, addressCountry: p.country || undefined },
    },
    performer: { '@type': 'Person', name: ARTIST_NAME },
    ...(p.composer ? { composer: { '@type': 'Person', name: p.composer } } : {}),
    ...(p.ticketsUrl ? { offers: { '@type': 'Offer', url: p.ticketsUrl } } : {}),
  };
}

export default async function SchedulePage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);
  const { upcoming, past } = await getSchedule(locale);
  const pageUrl = absoluteUrl(localePath(locale, '/schedule'));

  return (
    <>
      {upcoming.length > 0 && <JsonLd data={upcoming.map((p) => musicEvent(p, pageUrl))} />}
      <PageIntro eyebrow={t.schedule.eyebrow} title={t.schedule.title} />
      <Section className="pt-0 md:pt-0">
        <ScheduleList
          upcoming={upcoming.map((p) => toPerformanceView(p, locale))}
          past={past.map((p) => toPerformanceView(p, locale))}
          labels={{ ...t.schedule, tickets: t.common.tickets, addToCalendar: t.common.addToCalendar }}
        />
      </Section>
    </>
  );
}
