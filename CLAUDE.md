# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server; admin at /keystatic (local storage → writes content/ directly)
npm run build      # production build (works with no env vars)
npm run lint       # eslint
npx tsc --noEmit   # type check
npm test           # node:test on lib/__tests__/*.test.mts (YouTube parser, .ics generator)
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test lib/__tests__/ics.test.mts   # single test file
```

## Read first

- **Next.js 16 differs from older versions** — read `node_modules/next/dist/docs/` before writing Next code (see AGENTS.md). E.g. `middleware.ts` is now `proxy.ts`, `next/image` `priority` is deprecated in favour of `preload`.
- **Cache Components is deliberately OFF** (`next.config.ts`). Keystatic's reader does async fs reads; under Cache Components those would need `'use cache'` (stale in dev) and `export const revalidate` would be illegal. The classic model gives static prerendering + `revalidate = 86400` on Home/Schedule. Don't re-enable it casually.

## Architecture

- **Routing / i18n.** Every public page lives under `app/(site)/[locale]/` (`en`, `de`); that layout is a *root layout* (renders `<html lang>`), and `app/keystatic/layout.tsx` is a separate bare root layout for the admin. `proxy.ts` rewrites unprefixed paths to `/en/…` and 308-redirects `/en/…` to the clean URL, so English URLs have no prefix and German ones are `/de/…`. Build links with `localePath(locale, path)` from `lib/i18n.ts`; UI strings are the `en`/`de` dictionaries in the same file (`de` is typed as `Dictionary`, so missing keys fail tsc). Unknown paths hit `[locale]/[...rest]` → `notFound()` → `[locale]/not-found.tsx` (client component, reads locale from the URL).
- **Content.** `keystatic.config.ts` defines singletons (home, about, gallery, videos, settings) and collections (schedule, repertoire, reviews), all JSON under `content/`, images under `public/images/<section>/`. German variants are optional sibling fields (`…De`, or `home.de.*`) with English fallback via `localized()`. Pages never call the reader directly: they use typed loaders in `lib/content.ts`, which normalise missing singletons to empty values so the build never crashes on absent content. Dates are pre-formatted server-side (`toPerformanceView`) before reaching client components to avoid hydration drift.
- **Storage mode.** Keystatic uses GitHub storage only when `NODE_ENV=production` *and* `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` is set (override with `NEXT_PUBLIC_KEYSTATIC_STORAGE=github|local`); otherwise local. Repo: `avdalyanhayk/anna-web`.
- **Design system.** Tokens (colours, fonts, easings) only in the `@theme` block of `app/globals.css`; primitives in `components/ui/`. Photo-led direction: full-bleed hero photo with a dark scrim and a capitals `.wordmark`, upcoming performances right under the hero, Playfair Display 500/600 headings (no italics, no hairline display faces — readability was the explicit complaint about the first version), DM Sans 17px body in near-black, one garnet `accent`.
- **Client components** are limited to interactive pieces (Header, IntroOverture, ScheduleList, RepertoireIndex, ReviewCarousel, YouTube/VideoFilmstrip, PhotoGallery/PhotoLightbox, ContactForm, Reveal). The first-visit overture is an inline `<head>` script setting `html[data-overture]` + pure CSS in `globals.css`.
- **Contact.** `app/api/contact/route.ts` validates, honours the `website` honeypot (silent 200), and sends via Resend (`RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`); missing env → 500 with a logged warning.

Seed content and placeholder images (generated abstract "curtain" JPEGs) are marked as placeholders; the README has the editor guide and deployment/GitHub-mode setup.
