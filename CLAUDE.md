# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # next dev
npm run build   # next build
npm run start   # next start (after build)
npm run lint    # eslint (flat config, no path arg needed)
```

No test runner is configured.

## Stack and state of the repo

Next.js 16.4.3 (App Router, `app/` at repo root, no `src/`), React 19.3, TypeScript strict, Tailwind CSS v4. The project is currently the unmodified Create Next App scaffold (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`); there is no application code yet.

Dependencies already added in `package.json` but not yet wired up: `@keystatic/core` + `@keystatic/next` (git-based CMS), `resend` (email), `yet-another-react-lightbox` (image gallery). This points to a portfolio-style site with CMS-managed content, a contact form, and galleries.

## Things that differ from stock Next.js

- **Read `node_modules/next/dist/docs/` before writing Next code** (see AGENTS.md). This Next version has breaking changes from what you may remember.
- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`, which change rendering/caching semantics (Cache Components model) — check the docs under `node_modules/next/dist/docs/01-app` before writing data fetching, `"use cache"`, or dynamic APIs.
- Tailwind is wired through Turbopack, not PostCSS: `next.config.ts` has a `turbopack.rules` entry running `@tailwindcss/turbopack` on `*.css`. There is no `postcss.config`. Theme tokens live in `app/globals.css` via `@theme inline` (light/dark via `prefers-color-scheme`).
- Path alias `@/*` maps to the repo root (e.g. `@/app/...`, not `@/src/...`).
