import type { Locale } from './i18n';

/** Performances are listed by the singer's home time zone. */
export const SITE_TIME_ZONE = 'Europe/Berlin';

const intlLocale = (locale: Locale) => (locale === 'de' ? 'de-DE' : 'en-GB');

/** Content dates are plain ISO dates; treat them as UTC midnight so they never shift by a day. */
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** Today's date (YYYY-MM-DD) in the site time zone. */
export function todayIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SITE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** "Sat, 14 Mar 2027" / "Sa., 14. März 2027" */
export function formatLongDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: 'UTC',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(toDate(iso));
}

export function dateParts(iso: string, locale: Locale) {
  const d = toDate(iso);
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(intlLocale(locale), { timeZone: 'UTC', ...opts }).format(d);
  return {
    day: fmt({ day: '2-digit' }).replace('.', ''),
    month: fmt({ month: 'short' }).replace('.', ''),
    monthLong: fmt({ month: 'long' }),
    weekday: fmt({ weekday: 'short' }).replace('.', ''),
    year: fmt({ year: 'numeric' }),
  };
}

export function formatMonthYear(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(
    toDate(iso),
  );
}
