'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'aa-overture';

/**
 * Runs in <head> before first paint: marks <html data-overture="play"> only on
 * the first visit of the session and never under reduced motion. The overlay
 * itself is pure CSS, so it starts instantly and the page underneath stays
 * fully server-rendered for SEO and LCP.
 */
export const overtureScript = `(function(){try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(sessionStorage.getItem('${STORAGE_KEY}'))return;sessionStorage.setItem('${STORAGE_KEY}','1');document.documentElement.setAttribute('data-overture','play');}catch(e){}})();`;

export function IntroOverture({ name }: { name: string }) {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.overture !== 'play') return;

    const finish = () => {
      root.dataset.overture = 'done';
      events.forEach((e) => window.removeEventListener(e, finish));
    };
    const events = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const;
    events.forEach((e) => window.addEventListener(e, finish, { passive: true }));
    const timer = window.setTimeout(finish, 1400);
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, finish));
    };
  }, []);

  const [first, ...rest] = name.split(' ');
  return (
    <div className="overture" aria-hidden>
      <p className="overture-name wordmark text-center text-[clamp(2.5rem,8vw,6rem)]">
        <span>{first}</span> {rest.join(' ')}
      </p>
      <span className="overture-rule" />
    </div>
  );
}
