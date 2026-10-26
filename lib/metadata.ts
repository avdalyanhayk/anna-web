import type { Metadata } from 'next';
import { getAbout, getSettings } from './content';
import { localePath, locales, type Locale } from './i18n';
import { ARTIST_NAME, SITE_URL } from './site';

/** Shared metadata for a page: canonical + hreflang alternates + Open Graph. */
export async function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: { title?: string; description?: string } = {},
): Promise<Metadata> {
  const [settings, about] = await Promise.all([getSettings(locale), getAbout(locale)]);
  const defaultTitle = `${ARTIST_NAME} — ${about.voiceType}`;
  const desc = description || settings.seoDescription || defaultTitle;
  const url = localePath(locale, path);
  const languages = Object.fromEntries(locales.map((l) => [l, localePath(l, path)]));

  return {
    title: title ?? { absolute: defaultTitle },
    description: desc,
    alternates: { canonical: url, languages: { ...languages, 'x-default': localePath('en', path) } },
    openGraph: {
      type: path === '/' ? 'profile' : 'website',
      url,
      siteName: settings.siteTitle,
      title: title ? `${title} | ${ARTIST_NAME}` : defaultTitle,
      description: desc,
      locale: locale === 'de' ? 'de_DE' : 'en_GB',
      images: settings.ogImage ? [{ url: settings.ogImage, width: 1200, height: 630, alt: ARTIST_NAME }] : undefined,
    },
    twitter: { card: settings.ogImage ? 'summary_large_image' : 'summary' },
  };
}

export const metadataBase = new URL(SITE_URL);
