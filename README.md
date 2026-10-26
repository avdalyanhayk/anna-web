# Anna Avdalyan — Soprano

Personal website of opera singer Anna Avdalyan: [annaavdalyan.com](https://annaavdalyan.com).

- **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Keystatic CMS, Resend, `motion`, `yet-another-react-lightbox`.
- **Languages:** English at `/…` and German at `/de/…`.
- **Running cost:** zero. It is hosted on Vercel Hobby, and all content lives as JSON files in this GitHub repository. There is no database.

> All seed content (texts, dates, reviews, photos, videos) is **placeholder** and clearly marked as such. Replace it in the admin.

---

## 1. Local development

```bash
npm install
npm run dev
```

- Website: http://localhost:3000 (German: http://localhost:3000/de)
- Admin: http://localhost:3000/keystatic. In development the admin runs in **local mode**: saving writes straight to `content/` and `public/images/`. Reload the page to see the change.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build. Works without any env vars. |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint. |
| `npx tsc --noEmit` | Type check. |
| `npm test` | Unit tests for the YouTube link parser and the `.ics` calendar generator (Node's built-in test runner). |

Environment variables are listed in [`.env.example`](.env.example). Copy it to `.env.local` for local use; `.env*` files are git-ignored.

## 2. Deploying to Vercel and connecting annaavdalyan.com

1. Push this repository to GitHub (`avdalyanhayk/anna-web`).
2. On [vercel.com](https://vercel.com), choose **Add New → Project**, import the repository, and keep the detected Next.js settings. Click **Deploy**.
3. In the project, open **Settings → Domains** and add `annaavdalyan.com` and `www.annaavdalyan.com`. Set one to redirect to the other.
4. At your domain registrar, create the DNS records Vercel shows: an `A` record for the apex domain and a `CNAME` for `www`. HTTPS is issued automatically.
5. Add the environment variables from steps 3 and 6 below under **Settings → Environment Variables**, then redeploy.

Pages are static, so content changes go live through a redeploy. Vercel redeploys automatically whenever Keystatic commits. The Schedule and Home pages also re-render once a day, so performances move from "Upcoming" to "Past" without a redeploy.

## 3. Enabling GitHub mode for the admin (production)

In production, Keystatic saves by committing to GitHub. GitHub mode switches on automatically once `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` is set. Until then the build falls back to local mode, so it never breaks. The repository is configured in [`keystatic.config.ts`](keystatic.config.ts) (`avdalyanhayk/anna-web`).

1. **Temporarily force GitHub storage locally.** You don't need to edit the config; set the env var when starting the dev server:
   ```bash
   NEXT_PUBLIC_KEYSTATIC_STORAGE=github npm run dev
   ```
2. Open http://localhost:3000/keystatic and follow the **setup wizard**. It creates a GitHub App for you and writes four variables to a local `.env` file:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
3. When the wizard asks, **install the GitHub App** on the repository `avdalyanhayk/anna-web`, and only that one.
4. **Copy the four variables to Vercel** (Settings → Environment Variables, Production).
5. In the GitHub App settings (GitHub → Settings → Developer settings → GitHub Apps → your app), add the production **Callback URL**:
   `https://annaavdalyan.com/api/keystatic/github/oauth/callback`
   Keep the `localhost` one too if you want to use GitHub mode locally.
6. **Revert to local mode** by stopping the dev server and starting it again without `NEXT_PUBLIC_KEYSTATIC_STORAGE`. Don't commit the generated `.env`; it is git-ignored.
7. **Redeploy** on Vercel. `https://annaavdalyan.com/keystatic` now asks for a GitHub login, and saving creates a commit on `main`.

## 4. Onboarding Anna

1. Anna creates a free account at [github.com](https://github.com/signup).
2. The repository owner adds her: GitHub repo → **Settings → Collaborators → Add people** → her username, with the **Write** role. She accepts the email invitation.
3. She signs in at **https://annaavdalyan.com/keystatic** with **Sign in with GitHub** and authorises the app once.

## 5. Editor guide for Anna

Open **annaavdalyan.com/keystatic**. The left menu has four groups: **Pages**, **Performances**, **Media** and **Settings**. Every field has a short explanation under its name. **German** fields are optional: if you leave one empty, the German site shows the English text.

Changes go live about **1 minute after you click Save**, once the website has rebuilt.

**Add a performance**
1. Go to **Performances → Schedule** and click **Add**.
2. Fill in the production, date, time (e.g. `19:30`), type (opera, concert or recital), role, composer, venue, city and country. Add a tickets link if you have one.
3. The *File name* must be unique. For several dates of one production, add the date, e.g. `la-traviata-2027-03-14`.
4. Click **Create**.

The website sorts everything automatically. Past dates move to the **Past** tab by themselves.

**Add a video**
1. Go to **Media → Videos**.
2. Click **Add**, give it a title, and paste the YouTube link. Any YouTube link works, including the "Share" link.
3. Drag the items to reorder them. **The first video is the featured one** on the Gallery page.

To show a video on the home page, paste its link into **Pages → Home page → Featured video**.

**Add or reorder photos**
1. Go to **Media → Photo gallery** and click **Add**.
2. Choose the image and fill in a caption, a photo credit, and a short description for blind visitors.
3. Drag the items to change the order.

Recommended size: about **2000 px** on the longest side and **under 5 MB**. Export from your photo app as JPEG at around 80% quality.

**Edit your biography**
1. Go to **Pages → About / Biography**.
2. Edit the text as in a word processor. You can use **bold**, *italic*, headings and links.
3. You can also upload a CV as a PDF and high-resolution press photos.

**Press reviews**
1. Go to **Performances → Press reviews**.
2. Tick **Show on home page** to feature a quote in the home-page carousel.

**Contact details and social links**
- Edit these in **Settings → Site settings & contact**.

## 6. Contact form email (Resend)

The form posts to `/api/contact`, which sends an email through [Resend](https://resend.com). The free tier covers 3,000 emails per month.

1. Create a Resend account and open **Domains → Add domain** → `annaavdalyan.com`.
2. Add the DNS records Resend shows (SPF/DKIM `TXT` and `MX` records) at your registrar. Wait for **Verified**.
3. Create an API key under **API Keys**.
4. In Vercel, set:
   - `RESEND_API_KEY` = the key
   - `CONTACT_TO` = where messages should arrive (comma-separate several addresses)
   - `CONTACT_FROM` = a sender on the verified domain, e.g. `Anna Avdalyan Website <website@annaavdalyan.com>`
5. Redeploy.

Replies go straight to the visitor, because `replyTo` is set to their address. Spam bots are filtered by a hidden honeypot field. Without these variables the form shows a polite error and the server logs a warning; the build is unaffected.

**Alternative: Formspree.** Create a form at [formspree.io](https://formspree.io). In [`components/ContactForm.tsx`](components/ContactForm.tsx), change the `fetch('/api/contact', …)` URL to your Formspree endpoint (`https://formspree.io/f/xxxx`). Add the header `Accept: application/json`; Formspree accepts the same JSON fields.

## 7. Design system: "Carnegie White" (photo-led revision)

The design is photo-led and easy to read, following what the leading singer sites do (Davidsen, Netrebko, Garanča). The portrait carries the hero. The name is a solid capitals wordmark. The schedule sits right under the hero. Headings use a sturdy serif with no hairline italics, body text is large and near-black, and one warm garnet accent ties it together.

**Tokens.** All colours and font stacks live in **one place**: the `@theme` block in [`app/globals.css`](app/globals.css). Change a hex value there and the whole site follows. Tailwind exposes them as `bg-paper`, `text-ink`, `text-muted`, `border-rule`, `bg-accent` and so on.

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#FAF7F2` | page background |
| `paper-deep` | `#F2ECE3` | alternate sections |
| `ink` | `#161412` | headings, primary buttons |
| `ink-soft` | `#2B2723` | body copy (14:1 on paper) |
| `muted` | `#5B544C` | secondary text (7:1 on paper) |
| `stone` | `#8A8178` | decorative only |
| `rule` | `#E3DCD1` | hairlines |
| `accent` | `#8E1F35` | garnet signature colour: tickets, labels, links, focus ring |
| `night` | `#15110F` | photo scrim and video stage |

**Fonts.**
- Headings and the wordmark use **Playfair Display** at weights 500 and 600, with no italics.
- Body text uses **DM Sans** at 17px.
- Both load through `next/font/google` in [`app/(site)/[locale]/layout.tsx`](app/(site)/[locale]/layout.tsx).
- To swap a font, change the import there; `--font-playfair` and `--font-dm-sans` feed `--font-display` and `--font-sans` in `globals.css`.

**Primitives** live in [`components/ui/`](components/ui):
- `Section`: light, deep or dark variant, with the 1200px column and vertical rhythm.
- `Eyebrow`: small-caps label at 13px, semibold.
- `DisplayHeading`: semibold Playfair heading in sizes `xl`, `lg`, `md` or `sm`.
- `GoldRule`: accent hairline.
- `Button`: primary or ghost; renders a link or a button.
- `Card`.
- `Reveal`: scroll fade-up.

Utility classes are `.wordmark` (capitals name), `.eyebrow`, `.link-draw` (underline that draws in on hover) and `.rich-text` (biography typography).

**Motion.** Movement is kept gentle and always respects `prefers-reduced-motion`.
- **The Overture** (first visit per session, ≤ 1.2 s): the wordmark rises and the paper curtain lifts. It's skippable with a click, scroll or key press.
- **Hero photo:** a slow Ken Burns settle.

For the best result, use a **high-quality portrait** as the hero image: at least 2400px wide, with the subject's face in the upper third. The text sits on a dark gradient at the bottom, so any photo stays readable.

## Project structure

```
app/
  (site)/[locale]/        public site (en at /, de at /de); layout = <html>, header, footer
    page.tsx              home
    about/ schedule/ repertoire/ reviews/ gallery/ contact/
    not-found.tsx         styled 404; [...rest] routes unknown paths there
  keystatic/              admin UI (own bare root layout)
  api/keystatic/          Keystatic API
  api/contact/            contact form → Resend
  sitemap.ts robots.ts icon.svg favicon.ico apple-icon.png globals.css
components/               site components (client ones marked 'use client')
  ui/                     design primitives
content/                  all editable content (JSON + .mdoc biography)
lib/                      reader, typed content loaders, i18n, dates, YouTube, .ics, metadata
proxy.ts                  locale routing (rewrites / → /en, redirects /en/… → /…)
keystatic.config.ts       content model + admin navigation
public/images/            uploaded images, per section
```
