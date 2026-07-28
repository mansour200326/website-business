# Websmith — Independent Web Studio, Dubai

A single-page portfolio/services site for **Websmith**, an independent web
design studio in Dubai (a Web Smith FZCO company). Built with **Next.js 14
(App Router) + TypeScript** and **GSAP + ScrollTrigger** — "The Living Period":
the cyan dot from the "Websmith." wordmark writes the name on first load, then
travels down the page as you scroll, docking beside each section title and
finally landing in the WhatsApp CTA. Ivory / ink with a single cyan accent;
Instrument Serif for the wordmark, project names and the ghost watermark;
Manrope for all UI text. Normal vertical scrolling — the wheel is never hijacked.

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
  page.tsx          # resolves portfolio images (server) → <Home/>
  globals.css       # global stylesheet (ivory / ink + cyan accent)
  fonts.ts          # Instrument Serif (wordmark/display) + Manrope (UI), via next/font
  privacy/page.tsx  # /privacy — a normal vertical page
components/
  Home.tsx          # the homepage: all sections + GSAP/ScrollTrigger choreography
  Nav.tsx  Footer.tsx  Logo.tsx
config/site.ts      # ← single source of truth (hero, portfolio, packages, about, close)
lib/whatsapp.ts     # builds wa.me links from the config
lib/portfolio.ts    # resolves each portfolio screenshot (.jpg/.jpeg/.png) + intrinsic size
public/portfolio/   # project screenshots (see public/portfolio/README.md)
public/favicon.svg  # favicon — Instrument Serif "W" (ink) + cyan period, on ivory
public/icon-32|180|512.png   # PNG icon fallbacks
public/og.png       # 1200×630 OpenGraph image
```

## Motion ("The Living Period")

All scroll choreography is GSAP + ScrollTrigger, set up in `components/Home.tsx`:

- **Intro** — on every page load the cyan dot sweeps across the hero and the
  letters of *Websmith* rise behind it, the dot settling as the period with a
  slight overshoot. Any click / tap / scroll / keypress skips instantly to the
  finished state.
- **The travelling dot** — one `position:fixed` element moved with
  `transform: translate3d` only (never top/left). A continuous
  `requestAnimationFrame` lerp glides it toward its current target anchor — the
  hero period, an invisible anchor beside each section title, and finally a
  reserved slot inside the WhatsApp CTA (which then plays a single "breathe") —
  so it flows smoothly through momentum scrolling with no snapping. The static
  period in the wordmark is the no-JS / reduced fallback.
- **Kinetic type** — section headlines split into words and rise-and-settle on
  scroll; body text fades up; a huge Instrument Serif *Websmith* watermark drifts
  behind alternating sections at 4% opacity (the drift is desktop-only — on
  mobile it stays static for performance).
- **Portfolio** — exactly three projects (Sumou Jet, Grailhaus, Maison Padel),
  each a full-viewport moment with tight spacing so the next peeks as one ends.
  A browser-framed **screen recording** of the real site (its opening animation +
  a short scroll) plays inside the frame, and the background tints toward the
  project's palette at very low saturation, returning to ivory between. The clips
  are web-optimised (WebM + MP4, desktop + mobile sizes, muted, audio stripped),
  lazy-loaded and played only while on screen via an `IntersectionObserver`, with
  a poster still until playback. Drop new recordings into `/public/portfolio/`
  (see its README for exact filenames and the ffmpeg recipe).
- **Micro-interactions** — magnetic hover on primary buttons (desktop only),
  a cyan underline sweep on text links, 2px card lift.

Scrolling is always native — the wheel is never hijacked.

## Colour & type

Ivory (`#F6F4EF`) background, ink (`#141416`) text, and a single cyan accent
(`#00B5C8`) used sparingly. Instrument Serif appears only in the wordmark,
project names and the watermark; Manrope handles all UI text.

## Performance & accessibility

- Fonts via `next/font/google` (self-hosted); the serif is preloaded (it is
  above the fold in the hero).
- Portfolio clips are web-optimised (WebM + MP4, desktop + mobile sizes, muted
  and audio-stripped, desktop under 2.5 MB / mobile under 1 MB) and
  `preload="none"`. An `IntersectionObserver` lazy-loads the right size/codec and
  plays/pauses on scroll, so nothing downloads until the visitor approaches the
  portfolio and initial paint is never blocked. The frame's aspect-ratio comes
  from the poster's intrinsic size, so there is no layout shift; the hero reserves
  its space, so the intro causes no CLS.
- `prefers-reduced-motion` is respected end-to-end: every reveal renders
  instantly, the intro is skipped, the dot stays static as the wordmark period,
  and portfolio clips never autoload or autoplay — their poster still is shown.
- Responsive down to 375px with no horizontal scroll; the dot's docking
  positions are tested at 390px. `/privacy` and secondary pages are normal
  vertical pages.

## Regenerating the OG image & icons

`public/og.png` is a committed static asset: the "Websmith." wordmark centered
on ivory with the tagline in Archivo beneath. It was rendered from the app's own
components (self-hosted fonts) via a temporary `/og-preview` route screenshotted
at 1200×630. To regenerate, recreate that preview page and capture it, or
re-render an equivalent 1200×630 composition.

`public/favicon.svg` is self-contained (the Instrument Serif "W" as a vector
path in ink, with a cyan period, on ivory); the PNG fallbacks `icon-32.png`,
`icon-180.png`, and `icon-512.png` are rasterized from it.

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
