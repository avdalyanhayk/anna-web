import { cache } from 'react';
import type { DocumentRendererProps } from '@keystatic/core/renderer';
import { reader } from './reader';
import { localized, type Locale } from './i18n';
import { dateParts, formatLongDate, seasonOf, todayIso } from './dates';
import { parseYouTubeId } from './youtube';
import { parseRecording, type Recording } from './media';
import { mergeRepertoire } from './repertoire';

// Every loader returns plain, localized data and tolerates content that has
// not been created yet, so a missing singleton never breaks the build.

export type RichDocument = DocumentRendererProps['document'];
export type PerformanceType = 'opera' | 'concert';
export type RepertoireCategory = 'opera' | 'concert';
export type PhotoCategory = 'portrait' | 'stage';

export type Settings = {
  siteTitle: string;
  seoDescription: string;
  socials: { label: 'Instagram' | 'Facebook' | 'YouTube' | 'Spotify'; url: string }[];
  ogImage: string | null;
};

export type Performance = {
  slug: string;
  title: string;
  date: string;
  time: string;
  type: PerformanceType;
  role: string;
  composer: string;
  venue: string;
  venueUrl: string | null;
  city: string;
  country: string;
  ticketsUrl: string | null;
  notes: string;
};

export type RepertoireItem = {
  slug: string;
  work: string;
  composer: string;
  role: string;
  category: RepertoireCategory;
  inPreparation: boolean;
  recording: Recording | null;
  /** Original link, for recordings that cannot be embedded. */
  recordingUrl: string | null;
  /** True when (also) derived from the Schedule. */
  fromSchedule: boolean;
};

export type Review = {
  slug: string;
  /** Empty when the editor chose not to name the publication. */
  source: string;
  quote: string;
  critic: string;
  production: string;
  date: string | null;
  link: string | null;
  featured: boolean;
};

export type Video = { id: string; title: string; description: string; production: string };
export type Photo = { src: string; caption: string; credit: string; alt: string; category: PhotoCategory };

const isEmptyDocument = (doc: RichDocument) =>
  doc.length === 0 ||
  (doc.length === 1 &&
    'children' in doc[0] &&
    doc[0].children.every((child) => 'text' in child && !String(child.text).trim()));

const readSettings = cache(() => reader.singletons.settings.read());
const readHome = cache(() => reader.singletons.home.read());
const readAbout = cache(() => reader.singletons.about.read({ resolveLinkedFiles: true }));

export const getSettings = cache(async (locale: Locale): Promise<Settings> => {
  const s = await readSettings();
  const socials: Settings['socials'] = [];
  if (s?.instagram) socials.push({ label: 'Instagram', url: s.instagram });
  if (s?.facebook) socials.push({ label: 'Facebook', url: s.facebook });
  if (s?.youtube) socials.push({ label: 'YouTube', url: s.youtube });
  if (s?.spotify) socials.push({ label: 'Spotify', url: s.spotify });
  return {
    siteTitle: s?.siteTitle || 'Anna Avdalyan',
    seoDescription: localized(locale, s?.seoDescription, s?.seoDescriptionDe),
    socials,
    ogImage: s?.ogImage ?? null,
  };
});

export const getHome = cache(async (locale: Locale) => {
  const h = await readHome();
  return {
    heroImage: h?.heroImage ?? null,
    headline: localized(locale, h?.headline, h?.de.headline),
    subheadline: localized(locale, h?.subheadline, h?.de.subheadline),
    intro: localized(locale, h?.intro, h?.de.intro),
    featuredVideoId: parseYouTubeId(h?.featuredVideoUrl),
    ctaText: localized(locale, h?.ctaText, h?.de.ctaText),
    ctaLink: h?.ctaLink ?? '',
  };
});

export const getAbout = cache(async (locale: Locale) => {
  const a = await readAbout();
  const bioEn = a?.bio ?? [];
  const bioDe = a?.bioDe ?? [];
  const bio = locale === 'de' && !isEmptyDocument(bioDe) ? bioDe : bioEn;
  return {
    portrait: a?.portrait ?? null,
    voiceType: localized(locale, a?.voiceType, a?.voiceTypeDe) || (locale === 'de' ? 'Sopran' : 'Soprano'),
    bio: isEmptyDocument(bio) ? null : bio,
    shortBio: localized(locale, a?.shortBio, a?.shortBioDe),
    cvPdf: a?.cvPdf ?? null,
  };
});

export const getPhotos = cache(async (): Promise<Photo[]> => {
  const g = await reader.singletons.gallery.read();
  return (g?.photos ?? []).map((p) => ({
    src: p.image,
    caption: p.caption,
    credit: p.credit,
    alt: p.alt || p.caption || 'Anna Avdalyan',
    category: p.category,
  }));
});

export const getVideos = cache(async (): Promise<Video[]> => {
  const v = await reader.singletons.videos.read();
  return (v?.items ?? []).flatMap((item) => {
    const id = parseYouTubeId(item.youtubeUrl);
    return id ? [{ id, title: item.title, description: item.description, production: item.production }] : [];
  });
});

export const getPerformances = cache(async (locale: Locale): Promise<Performance[]> => {
  const entries = await reader.collections.schedule.all();
  return entries
    .filter(({ entry }) => entry.date)
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      date: entry.date as string,
      time: entry.time,
      type: entry.type,
      role: entry.role,
      composer: entry.composer,
      venue: entry.venue,
      venueUrl: entry.venueUrl,
      city: entry.city,
      country: entry.country,
      ticketsUrl: entry.ticketsUrl,
      notes: localized(locale, entry.notes, entry.notesDe),
    }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
});

/** Splits performances around today: upcoming ascending, past descending. */
export async function getSchedule(locale: Locale) {
  const all = await getPerformances(locale);
  const today = todayIso();
  return {
    upcoming: all.filter((p) => p.date >= today),
    past: all.filter((p) => p.date < today).reverse(),
  };
}

/**
 * Repertoire = hand-made entries + every role in the Schedule (merged, one
 * entry per role). Depends on today's date for performed vs. in preparation.
 */
export const getRepertoire = cache(async (): Promise<RepertoireItem[]> => {
  const [entries, schedule] = await Promise.all([reader.collections.repertoire.all(), reader.collections.schedule.all()]);
  const manual: RepertoireItem[] = entries.map(({ slug, entry }) => ({
    slug,
    work: entry.work,
    composer: entry.composer,
    role: entry.role,
    category: entry.category,
    inPreparation: entry.status === 'preparation',
    recording: parseRecording(entry.recordingUrl),
    recordingUrl: entry.recordingUrl,
    fromSchedule: false,
  }));
  const scheduled = schedule
    .filter(({ entry }) => entry.date)
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      work: entry.work,
      composer: entry.composer,
      role: entry.role,
      type: entry.type,
      date: entry.date as string,
      addToRepertoire: entry.addToRepertoire,
    }));
  return mergeRepertoire(manual, scheduled, todayIso());
});

export const getReviews = cache(async (): Promise<Review[]> => {
  const entries = await reader.collections.reviews.all();
  return entries
    .map(({ slug, entry }) => ({
      slug,
      source: entry.showSource ? entry.source : '',
      quote: entry.quote,
      critic: entry.critic,
      production: entry.production,
      date: entry.date,
      link: entry.link,
      featured: entry.featured,
    }))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
});

const readLegal = cache(() => reader.singletons.legal.read({ resolveLinkedFiles: true }));

export const getLegal = cache(async (locale: Locale) => {
  const l = await readLegal();
  const pick = (en: RichDocument | undefined, de: RichDocument | undefined) => {
    const doc = locale === 'de' && de && !isEmptyDocument(de) ? de : (en ?? []);
    return isEmptyDocument(doc) ? null : doc;
  };
  return { imprint: pick(l?.imprint, l?.imprintDe), privacy: pick(l?.privacy, l?.privacyDe) };
});

export type PerformanceView = Performance & {
  longDate: string;
  day: string;
  month: string;
  weekday: string;
  year: string;
  place: string;
  season: string;
};

/** Pre-formats dates on the server so client components never re-format (no hydration drift). */
export function toPerformanceView(p: Performance, locale: Locale): PerformanceView {
  const parts = dateParts(p.date, locale);
  return {
    ...p,
    longDate: formatLongDate(p.date, locale),
    day: parts.day,
    month: parts.month,
    weekday: parts.weekday,
    year: parts.year,
    place: [p.city, p.country].filter(Boolean).join(', '),
    season: seasonOf(p.date),
  };
}
