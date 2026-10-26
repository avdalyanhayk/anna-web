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
    scroll: 'Scroll',
    placeholderNotice: 'Placeholder content — replace in the site admin.',
  },
  home: {
    season: 'The season',
    seasonHint: 'Drag or scroll to explore',
    upcoming: 'Upcoming',
    featuredVideo: 'Watch',
    press: 'In the press',
    noUpcoming: 'New dates will be announced soon.',
  },
  about: {
    eyebrow: 'Biography',
    downloadCv: 'Download CV',
    pressKit: 'Press photos',
    pressKitHint: 'High-resolution images for press use. Please credit the photographer.',
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
    recital: 'Recital',
    role: 'Role',
    emptyUpcoming: 'No upcoming performances in this category yet.',
    emptyPast: 'No past performances in this category.',
    filterLabel: 'Filter by type',
  },
  repertoire: {
    eyebrow: 'Repertoire',
    title: 'Repertoire',
    search: 'Search works, composers, roles',
    opera: 'Opera',
    concert: 'Concert & Oratorio',
    song: 'Song & Recital',
    inPreparation: 'In preparation',
    noResults: 'Nothing matches your search.',
    empty: 'The repertoire list will appear here soon.',
  },
  reviews: {
    eyebrow: 'Press',
    title: 'Reviews',
    readArticle: 'Read the article',
    empty: 'Press reviews will appear here soon.',
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
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Get in touch',
    management: 'General management',
    direct: 'Direct enquiries',
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
    error: 'Sorry, the message could not be sent. Please try again or write an email.',
    required: 'Please fill in this field.',
    invalidEmail: 'Please enter a valid email address.',
    tooShort: 'Please write a little more.',
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
    scroll: 'Scrollen',
    placeholderNotice: 'Platzhaltertext — im Admin-Bereich ersetzen.',
  },
  home: {
    season: 'Die Saison',
    seasonHint: 'Ziehen oder scrollen',
    upcoming: 'Demnächst',
    featuredVideo: 'Video',
    press: 'Pressestimmen',
    noUpcoming: 'Neue Termine werden bald bekannt gegeben.',
  },
  about: {
    eyebrow: 'Biografie',
    downloadCv: 'Lebenslauf herunterladen',
    pressKit: 'Pressefotos',
    pressKitHint: 'Hochaufgelöste Bilder zur Verwendung in der Presse. Bitte Fotografen nennen.',
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
    recital: 'Liederabend',
    role: 'Rolle',
    emptyUpcoming: 'In dieser Kategorie sind noch keine Termine angekündigt.',
    emptyPast: 'Keine vergangenen Termine in dieser Kategorie.',
    filterLabel: 'Nach Art filtern',
  },
  repertoire: {
    eyebrow: 'Repertoire',
    title: 'Repertoire',
    search: 'Werke, Komponisten, Rollen suchen',
    opera: 'Oper',
    concert: 'Konzert & Oratorium',
    song: 'Lied & Liederabend',
    inPreparation: 'In Vorbereitung',
    noResults: 'Keine Treffer.',
    empty: 'Das Repertoire erscheint hier in Kürze.',
  },
  reviews: {
    eyebrow: 'Presse',
    title: 'Pressestimmen',
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
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Kontakt',
    management: 'Generalmanagement',
    direct: 'Direkte Anfragen',
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
    error: 'Die Nachricht konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie eine E-Mail.',
    required: 'Bitte füllen Sie dieses Feld aus.',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    tooShort: 'Bitte schreiben Sie etwas mehr.',
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
