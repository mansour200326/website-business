# Independent Web Studio — Dubai

A single-page portfolio/services site for an independent web design studio in
Dubai. Built with **Next.js 14 (App Router) + TypeScript**, porting the approved
design in `studio-minimal-ivory-v3.html` — a modern-minimal, ivory / ink /
beige layout: Archivo (normal width, sentence case) + Space Mono for tiny
labels, a hairline structure system, real screenshots inside rounded work
cards, and restrained motion (fade-rise reveals + a slow screenshot hover pan).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

## Configuration — everything lives in `config/site.ts`

`config/site.ts` is the **single source of truth**. Changing it updates the
whole site — copy, projects, pricing, reel, footer, and SEO.

### Set the studio name

```ts
// config/site.ts
export const site = {
  studioName: "",   // ← leave "" to keep the "name in production" placeholder
  ...
};
```

- **Empty (`""`)** — the nav monogram and footer render the prototype's
  `name in production` placeholder treatment, and the browser/OG title falls
  back to `Independent Web Studio — Dubai`.
- **Set** (e.g. `studioName: "Northline"`) — the real name renders in the nav
  and footer copyright, and becomes the page/OG title everywhere automatically.

### Set the WhatsApp number

```ts
export const site = {
  ...
  whatsappNumber: "+9715XXXXXXXX",   // ← replace with your real number
};
```

Every CTA (the hero "Get a quote on WhatsApp", each service "Get a quote →"
link, and the footer "Message on WhatsApp" button) builds a
[`wa.me`](https://wa.me) link from this number with a pre-filled message — the
service links name the service. Use full international format, e.g.
`+971501234567`. Until a real number is set the links point at the placeholder
and won't open a real chat.

### Everything else

`config/site.ts` also holds the services (`name`, `subject`, `description` —
plain language, no prices), work scenes (`slug`, `wno`, `title`, `meta`,
`description`, `hue`, `hue2`), the ruled section headers, process steps, the
bilingual panel, footer, and SEO metadata. Each field is documented inline in
that file.

## Project structure

```
app/
  layout.tsx        # metadata, OpenGraph, favicon/app icons, theme-color, fonts
  page.tsx          # composes the single-page site
  globals.css       # global stylesheet (ivory / ink / beige, hairline system)
  fonts.ts          # Archivo + Space Mono (body); Instrument Serif + Manrope (logotype)
components/          # Nav, Hero, Work, WorkScene, Services, Process,
                     # Bilingual, Footer, Reveals, Logo
config/site.ts      # ← single source of truth
lib/whatsapp.ts     # builds wa.me links from the config
lib/workShots.ts    # resolves each work screenshot (.png then .jpeg)
public/favicon.svg  # favicon — Instrument Serif italic "a", ink on ivory
public/icon-32|180|512.png   # PNG icon fallbacks (favicon / apple-touch / large)
public/og.png       # 1200×630 OpenGraph image (static asset)
public/work/        # project screenshots (see public/work/README.md)
```

## The logotype

"Atelier Digital" renders as a typographic lockup (see `components/Logo.tsx`):
"atelier" in **Instrument Serif** italic over/before "digital" in **Manrope**
medium, both lowercase. The nav uses the one-line `inline` variant (ink); the
footer uses the two-line `stacked` variant (ivory on the ink band). Instrument
Serif and Manrope are loaded via `next/font` and used **only** in the logotype
and favicon — body and headings stay Archivo. `config/site.ts` keeps
`studioName: "Atelier Digital"` for the `<title>` and metadata.

## Fonts, performance & accessibility

- Fonts load through `next/font/google` (Archivo + Space Mono for the site;
  Instrument Serif + Manrope for the logotype) — self-hosted, no layout shift.
- Work screenshots use `next/image` with aspect-ratio containers, so images
  reserve space and there is no CLS.
- Motion is CSS-first and minimal: gentle fade-and-rise scroll reveals and a
  slow hover pan on the work screenshots; the page is statically prerendered.
- `prefers-reduced-motion` is respected end-to-end: reveals show instantly and
  the screenshot pan is disabled.
- Responsive down to 375px with no horizontal scroll; the work cards stack on
  mobile.

## Regenerating the OG image & icons

`public/og.png` is a committed static asset: the stacked logotype centered on
ivory with the tagline in Archivo beneath. It was rendered from the app's own
components (self-hosted fonts) via a temporary `/og-preview` route screenshotted
at 1200×630. To regenerate, recreate that preview page and capture it, or
re-render an equivalent 1200×630 composition.

`public/favicon.svg` is self-contained (the Instrument Serif italic "a" as a
vector path, ink on ivory); the PNG fallbacks `icon-32.png`, `icon-180.png`, and
`icon-512.png` are rasterized from it.

## Deploying on Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Vercel auto-detects Next.js — no configuration needed (Build Command
   `next build`, Output handled automatically).
4. Click **Deploy**.
5. After deploying, set the real domain and update `site.meta.url` in
   `config/site.ts` so OpenGraph tags use the correct absolute URL, then
   redeploy.

To promote to production later, push to the default branch (or run
`vercel --prod` with the Vercel CLI).
