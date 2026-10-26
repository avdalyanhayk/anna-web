import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import type { Settings } from '@/lib/content';
import { localePath, type Dictionary, type Locale } from '@/lib/i18n';
import { SocialIcon } from './SocialIcon';

/** Dark footer bookending the photo-led hero: wordmark, navigation, social links, legal links. */
export function Footer({
  locale,
  settings,
  t,
  nav,
}: {
  locale: Locale;
  settings: Settings;
  t: Dictionary;
  nav: { label: string; href: string }[];
}) {
  const year = new Date().getFullYear();
  const legal = [
    { label: t.common.imprint, href: localePath(locale, '/imprint') },
    { label: t.common.privacy, href: localePath(locale, '/privacy') },
  ];

  return (
    <footer className="on-dark bg-night text-paper">
      <div className="mx-auto max-w-[1200px] px-4 pt-20 pb-10 sm:px-6 md:px-10 md:pt-24">
        <p className="wordmark text-[clamp(2.25rem,6vw,4.5rem)] text-balance">Anna Avdalyan</p>
        <span aria-hidden className="mt-8 block h-px w-16 bg-champagne" />

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_auto]">
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw text-paper/85 hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {settings.socials.length > 0 && (
            <ul className="flex gap-2 md:self-start" aria-label="Social media">
              {settings.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-12 items-center justify-center rounded-full border border-paper/25 text-paper/85 transition-colors duration-300 hover:border-champagne hover:text-champagne"
                  >
                    <SocialIcon network={s.label} className="size-5" />
                    <span className="sr-only">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-champagne/30 pt-8 text-sm text-paper/75 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Anna Avdalyan. {t.common.rights}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="#main" className="group inline-flex items-center gap-2 hover:text-paper">
                {t.common.backToTop}
                <ArrowUp aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.75} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
