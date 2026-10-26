import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import type { Settings } from '@/lib/content';
import type { Dictionary, Locale } from '@/lib/i18n';
import { SocialIcon } from './SocialIcon';

export function Footer({
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
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-[1200px] px-4 pt-20 pb-10 sm:px-6 md:px-10 md:pt-28">
        <p className="wordmark text-[clamp(2.5rem,8vw,6rem)] text-balance">
          Anna Avdalyan
        </p>

        <div className="mt-12 grid gap-10 border-t border-rule pt-10 md:grid-cols-[2fr_1fr_auto] md:items-start">
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw text-sm text-ink-soft hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {settings.socials.length > 0 && (
            <ul className="flex gap-2" aria-label="Social media">
              {settings.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-12 items-center justify-center rounded-full border border-rule text-ink-soft transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    <SocialIcon network={s.label} className="size-5" />
                    <span className="sr-only">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <a href="#main" className="group inline-flex items-center gap-3 text-sm font-semibold tracking-[0.12em] uppercase text-ink-soft hover:text-ink">
            {t.common.backToTop}
            <span className="flex size-10 items-center justify-center rounded-full border border-rule transition-transform duration-300 group-hover:-translate-y-1">
              <ArrowUp aria-hidden className="size-4" strokeWidth={1.75} />
            </span>
          </a>
        </div>

        <p className="mt-16 text-sm text-muted">
          © {year} Anna Avdalyan. {t.common.rights}
        </p>
      </div>
    </footer>
  );
}
