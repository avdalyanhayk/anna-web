'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import { getDictionary, localePath, type Locale } from '@/lib/i18n';

export default function NotFound() {
  // not-found.tsx receives no params, so read the locale from the visible URL.
  const locale: Locale = /^\/de(\/|$)/.test(usePathname() ?? '') ? 'de' : 'en';
  const t = getDictionary(locale).notFound;

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 md:px-10">
      <p
        aria-hidden
        className="pointer-events-none absolute -right-6 bottom-0 font-display text-[clamp(14rem,40vw,34rem)] leading-[0.75] text-paper-deep select-none"
      >
        404
      </p>
      <div className="relative mx-auto w-full max-w-[1200px]">
        <p className="eyebrow text-accent">{t.eyebrow}</p>
        <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1] tracking-[-0.02em] text-balance">
          {t.title}
        </h1>
        <span aria-hidden className="mt-10 block h-px w-16 bg-accent" />
        <p className="mt-8 max-w-md text-lg text-ink-soft">{t.text}</p>
        <Button href={localePath(locale, '/')} className="mt-12">
          {t.back}
        </Button>
      </div>
    </section>
  );
}
