import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { IntroOverture, overtureScript } from '@/components/IntroOverture';
import { ListenProvider, type Track } from '@/components/ListenPlayer';
import { MobileNextBar } from '@/components/MobileNextBar';
import { MotionProvider } from '@/components/MotionProvider';
import { getDictionary, isLocale, localePath, locales } from '@/lib/i18n';
import { getHome, getSchedule, getSettings, getVideos, toPerformanceView } from '@/lib/content';
import { metadataBase } from '@/lib/metadata';
import { ARTIST_NAME, navItems } from '@/lib/site';
import '../../globals.css';

// `subsets` only controls preloading: Latin-1 (incl. German umlauts) is
// preloaded, Latin Extended (e.g. "ř" in Dvořák) still loads on demand.
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

// The phone bar shows the next performance, so the shell refreshes daily like Home/Schedule.
export const revalidate = 86400;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase,
  title: { template: `%s | ${ARTIST_NAME}`, default: ARTIST_NAME },
  applicationName: ARTIST_NAME,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#faf7f2',
  colorScheme: 'light',
};

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getDictionary(locale);
  const [settings, home, videos, schedule] = await Promise.all([
    getSettings(locale),
    getHome(locale),
    getVideos(),
    getSchedule(locale),
  ]);
  const nav = navItems.map((item) => ({ label: t.nav[item.key], href: localePath(locale, item.path) }));

  // "Listen" plays the home page's featured video, else the first video in the admin.
  const featured = home.featuredVideoId
    ? (videos.find((v) => v.id === home.featuredVideoId) ?? { id: home.featuredVideoId, title: ARTIST_NAME })
    : videos[0];
  const defaultTrack: Track | null = featured ? { id: featured.id, title: featured.title || ARTIST_NAME } : null;
  const nextView = schedule.upcoming[0] ? toPerformanceView(schedule.upcoming[0], locale) : null;
  const next = nextView
    ? {
        date: nextView.date,
        day: nextView.day,
        month: nextView.month,
        title: nextView.title,
        venue: [nextView.venue, nextView.city].filter(Boolean).join(', '),
        productionUrl: nextView.productionUrl,
      }
    : null;

  return (
    <html lang={locale} className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: overtureScript }} />
      </head>
      <body className="min-h-svh overflow-x-clip">
        <a
          href="#main"
          className="sr-only z-[110] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {t.common.skipToContent}
        </a>
        <MotionProvider>
          <ListenProvider
            defaultTrack={defaultTrack}
            labels={{ listen: t.common.listen, nowPlaying: t.common.nowPlaying, closePlayer: t.common.closePlayer }}
          >
            <IntroOverture name={ARTIST_NAME} />
            <Header
              locale={locale}
              nav={nav}
              homeHref={localePath(locale, '/')}
              labels={{ menu: t.common.menu, close: t.common.close, language: t.common.language }}
            />
            <main id="main">{children}</main>
            <Footer settings={settings} t={t} nav={nav} impressumHref={localePath(locale, "/impressum")} />
            <MobileNextBar
              next={next}
              scheduleHref={localePath(locale, '/schedule')}
              labels={{
                nextPerformance: t.common.nextPerformance,
                today: t.common.today,
                tomorrow: t.common.tomorrow,
                inDays: t.common.inDays,
              }}
            />
          </ListenProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
