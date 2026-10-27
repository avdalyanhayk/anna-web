export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** English lives at the root (/schedule), German under /de (/de/schedule). */
export function localePath(locale: Locale, path: string = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

/** Strips a locale prefix: "/de/schedule" → "/schedule". */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|de)(?=\/|$)/);
  if (!match) return pathname || '/';
  return pathname.slice(match[0].length) || '/';
}

/** Picks the German value when available, otherwise falls back to English. */
export function localized(locale: Locale, en: string | null | undefined, de: string | null | undefined): string {
  if (locale === 'de' && de && de.trim()) return de;
  return en ?? '';
}

const en = {
  nav: {
    home: 'Home',
    about: 'About',
    schedule: 'Schedule',
    repertoire: 'Repertoire',
    reviews: 'Press',
    gallery: 'Gallery',
    contact: 'Contact',
  },
  common: {
    skipToContent: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
    switchTo: 'Deutsch',
    tickets: 'Tickets',
    addToCalendar: 'Add to calendar',
    viewAll: 'View all',
    readMore: 'Read more',
    backToTop: 'Back to top',
    rights: 'All rights reserved.',
    nextPerformance: 'Next performance',
    placeholderNotice: 'Placeholder content — replace in the site admin.',
    imprint: 'Imprint',
    privacy: 'Privacy',
  },
  home: {
    upcoming: 'Upcoming performances',
    featuredVideo: 'Watch',
    press: 'In the press',
    noUpcoming: 'New dates will be announced soon.',
  },
  about: {
    eyebrow: 'Biography',
    downloadCv: 'Download CV',
    shortBio: 'Short biography',
    fullBio: 'Full biography',
    bioVersion: 'Biography length',
    copyShortBio: 'Copy short biography',
    copied: 'Copied',
    download: 'Download',
    empty: 'The biography will appear here soon.',
  },
  schedule: {
    eyebrow: 'Schedule',
    title: 'Performances',
    upcoming: 'Upcoming',
    past: 'Past',
    all: 'All',
    opera: 'Opera',
    concert: 'Concert',
    role: 'Role',
    venueLink: 'Production page',
    season: 'Season',
    emptyUpcoming: 'No upcoming performances in this category yet.',
    emptyPast: 'No past performances in this category.',
    filterLabel: 'Filter by type',
  },
  repertoire: {
    eyebrow: 'Repertoire',
    title: 'Repertoire',
    opera: 'Opera',
    concert: 'Concert & Oratorio',
    performed: 'Performed roles',
    inPreparation: 'In preparation',
    listen: 'Play recording',
    closeRecording: 'Close recording',
    openRecording: 'Open recording',
    empty: 'The repertoire list will appear here soon.',
  },
  reviews: {
    eyebrow: 'Reviews',
    title: 'Press',
    readArticle: 'Read the article',
    empty: 'Press quotes will appear here soon.',
    previous: 'Previous review',
    next: 'Next review',
    pause: 'Pause',
    play: 'Play',
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Gallery',
    videos: 'Videos',
    photos: 'Photos',
    playVideo: 'Play video',
    moreVideos: 'More videos',
    noVideos: 'Videos will appear here soon.',
    noPhotos: 'Photos will appear here soon.',
    openPhoto: 'Open photo',
    all: 'All',
    portrait: 'Portraits',
    stage: 'On stage',
    filterLabel: 'Filter photos',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Get in touch',
    formHint: 'Messages are delivered personally and answered as soon as possible.',
    formTitle: 'Send a message',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending…',
    success: 'Thank you — your message has been sent.',
    successHint: 'You will receive a reply as soon as possible.',
    sendAnother: 'Send another message',
    error: 'Sorry, the message could not be sent. Please try again in a moment.',
    required: 'Please fill in this field.',
    invalidEmail: 'Please enter a valid email address.',
    tooShort: 'Please write a little more.',
    consent: 'I agree that my details are used to answer my message.',
    consentRequired: 'Please confirm to send your message.',
    privacyNote: 'Your details are used only to reply to you and are not passed on. More in the',
    privacyLink: 'privacy policy',
  },
  legal: {
    imprint: 'Imprint',
    privacy: 'Privacy policy',
    empty: 'This page will be completed soon.',
  },
  notFound: {
    eyebrow: 'Error 404',
    title: 'This page has left the stage',
    text: 'The page you are looking for does not exist or has moved.',
    back: 'Return to the home page',
  },
};

export type Dictionary = typeof en;

const de: Dictionary = {
  nav: {
    home: 'Start',
    about: 'Biografie',
    schedule: 'Termine',
    repertoire: 'Repertoire',
    reviews: 'Presse',
    gallery: 'Galerie',
    contact: 'Kontakt',
  },
  common: {
    skipToContent: 'Zum Inhalt springen',
    menu: 'Menü',
    close: 'Schließen',
    language: 'Sprache',
    switchTo: 'English',
    tickets: 'Karten',
    addToCalendar: 'In Kalender eintragen',
    viewAll: 'Alle ansehen',
    readMore: 'Weiterlesen',
    backToTop: 'Nach oben',
    rights: 'Alle Rechte vorbehalten.',
    nextPerformance: 'Nächster Auftritt',
    placeholderNotice: 'Platzhaltertext — im Admin-Bereich ersetzen.',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
  },
  home: {
    upcoming: 'Nächste Auftritte',
    featuredVideo: 'Video',
    press: 'Pressestimmen',
    noUpcoming: 'Neue Termine werden bald bekannt gegeben.',
  },
  about: {
    eyebrow: 'Biografie',
    downloadCv: 'Lebenslauf herunterladen',
    shortBio: 'Kurzbiografie',
    fullBio: 'Ausführliche Biografie',
    bioVersion: 'Länge der Biografie',
    copyShortBio: 'Kurzbiografie kopieren',
    copied: 'Kopiert',
    download: 'Herunterladen',
    empty: 'Die Biografie erscheint hier in Kürze.',
  },
  schedule: {
    eyebrow: 'Termine',
    title: 'Auftritte',
    upcoming: 'Demnächst',
    past: 'Vergangen',
    all: 'Alle',
    opera: 'Oper',
    concert: 'Konzert',
    role: 'Rolle',
    venueLink: 'Produktionsseite',
    season: 'Saison',
    emptyUpcoming: 'In dieser Kategorie sind noch keine Termine angekündigt.',
    emptyPast: 'Keine vergangenen Termine in dieser Kategorie.',
    filterLabel: 'Nach Art filtern',
  },
  repertoire: {
    eyebrow: 'Repertoire',
    title: 'Repertoire',
    opera: 'Oper',
    concert: 'Konzert & Oratorium',
    performed: 'Gesungene Partien',
    inPreparation: 'In Vorbereitung',
    listen: 'Aufnahme abspielen',
    closeRecording: 'Aufnahme schließen',
    openRecording: 'Aufnahme öffnen',
    empty: 'Das Repertoire erscheint hier in Kürze.',
  },
  reviews: {
    eyebrow: 'Pressestimmen',
    title: 'Presse',
    readArticle: 'Zum Artikel',
    empty: 'Pressestimmen erscheinen hier in Kürze.',
    previous: 'Vorherige Kritik',
    next: 'Nächste Kritik',
    pause: 'Pause',
    play: 'Abspielen',
  },
  gallery: {
    eyebrow: 'Galerie',
    title: 'Galerie',
    videos: 'Videos',
    photos: 'Fotos',
    playVideo: 'Video abspielen',
    moreVideos: 'Weitere Videos',
    noVideos: 'Videos erscheinen hier in Kürze.',
    noPhotos: 'Fotos erscheinen hier in Kürze.',
    openPhoto: 'Foto öffnen',
    all: 'Alle',
    portrait: 'Porträts',
    stage: 'Auf der Bühne',
    filterLabel: 'Fotos filtern',
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Kontakt',
    formHint: 'Nachrichten werden persönlich zugestellt und so bald wie möglich beantwortet.',
    formTitle: 'Nachricht senden',
    name: 'Name',
    email: 'E-Mail',
    subject: 'Betreff',
    message: 'Nachricht',
    send: 'Nachricht senden',
    sending: 'Wird gesendet…',
    success: 'Vielen Dank — Ihre Nachricht wurde gesendet.',
    successHint: 'Sie erhalten so bald wie möglich eine Antwort.',
    sendAnother: 'Weitere Nachricht senden',
    error: 'Die Nachricht konnte leider nicht gesendet werden. Bitte versuchen Sie es in Kürze erneut.',
    required: 'Bitte füllen Sie dieses Feld aus.',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    tooShort: 'Bitte schreiben Sie etwas mehr.',
    consent: 'Ich bin einverstanden, dass meine Angaben zur Beantwortung meiner Nachricht verwendet werden.',
    consentRequired: 'Bitte bestätigen Sie, um Ihre Nachricht zu senden.',
    privacyNote: 'Ihre Angaben werden nur zur Beantwortung verwendet und nicht weitergegeben. Mehr in der',
    privacyLink: 'Datenschutzerklärung',
  },
  legal: {
    imprint: 'Impressum',
    privacy: 'Datenschutzerklärung',
    empty: 'Diese Seite wird in Kürze ergänzt.',
  },
  notFound: {
    eyebrow: 'Fehler 404',
    title: 'Diese Seite hat die Bühne verlassen',
    text: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
    back: 'Zur Startseite',
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, de };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Narrows the [locale] route param; unknown values fall back to English (the proxy only routes en/de here). */
export async function resolveLocale({ params }: LocaleParams): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : defaultLocale;
}
