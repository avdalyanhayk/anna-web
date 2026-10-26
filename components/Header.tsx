'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { localePath, stripLocale, type Locale } from '@/lib/i18n';
import { cn } from './ui/cn';

type NavLink = { label: string; href: string };

export function Header({
  locale,
  nav,
  homeHref,
  labels,
}: {
  locale: Locale;
  nav: NavLink[];
  homeHref: string;
  labels: { menu: string; close: string; language: string };
}) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 8);
      // Hide while scrolling down past the fold, reveal on any upward scroll.
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current && y > 160);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = stripLocale(pathname);
  const isActive = (href: string) => {
    const path = stripLocale(href);
    return current === path || current.startsWith(`${path}/`);
  };
  const otherLocale: Locale = locale === 'en' ? 'de' : 'en';
  const switchHref = localePath(otherLocale, current);

  const languageSwitch = (className?: string) => (
    <div className={cn('flex items-center gap-2 text-xs tracking-[0.2em] uppercase', className)} aria-label={labels.language} role="group">
      <span aria-current="true" className="text-ink">
        {locale}
      </span>
      <span aria-hidden className="text-stone">
        /
      </span>
      <Link href={switchHref} hrefLang={otherLocale} lang={otherLocale} className="link-draw text-muted hover:text-ink">
        {otherLocale}
      </Link>
    </div>
  );

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-(--ease-out-soft)',
          solid ? 'border-b border-rule bg-paper/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 md:h-20 md:px-10">
          <Link href={homeHref} className="font-display text-xl tracking-[-0.01em] md:text-2xl" aria-label="Anna Avdalyan — Home">
            Anna <span className="italic">Avdalyan</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative py-2 text-[0.8125rem] tracking-[0.14em] uppercase transition-colors',
                        active ? 'text-ink' : 'text-muted hover:text-ink',
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-x-0 -bottom-0.5 h-px origin-left bg-lapis transition-transform duration-500 ease-(--ease-out-soft)',
                          active ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-6">
            {languageSwitch('hidden lg:flex')}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="-mr-3 flex size-12 items-center justify-center lg:hidden"
            >
              <span className="sr-only">{open ? labels.close : labels.menu}</span>
              {open ? <X aria-hidden strokeWidth={1.25} /> : <Menu aria-hidden strokeWidth={1.25} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={labels.menu}
            className="fixed inset-0 z-40 flex flex-col bg-paper px-6 pt-24 pb-10 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Main" className="flex-1">
              <ul className="flex flex-col gap-1">
                {[{ label: locale === 'de' ? 'Start' : 'Home', href: homeHref }, ...nav].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      autoFocus={i === 0}
                      aria-current={stripLocale(item.href) === current ? 'page' : undefined}
                      className={cn(
                        'block py-2 font-display text-[2.5rem] leading-tight',
                        stripLocale(item.href) === current ? 'italic text-lapis' : 'text-ink',
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            {languageSwitch('border-t border-rule pt-6')}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
