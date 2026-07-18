# Independent Web Studio — Dubai

A single-page portfolio/services site for an independent web design studio in
Dubai. Built with **Next.js 14 (App Router) + TypeScript**, porting the approved
design in `studio-prototype-v8-twotone.html` **verbatim** — same navy/baby-blue
two-tone palette, Archivo (expanded) + Space Mono type, copy, layout, and every
animation (opening 00→100 counter, blur-rise headline, reel marquee, scroll
reveals, scene hover color-bleeds, button fills, footer hollow-stroke hover).

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

Every CTA ("Start a project", each "Request …" plan button, and the footer
"Let's build →") builds a [`wa.me`](https://wa.me) link from this number with a
pre-filled message — the plan buttons include the package name. Use full
international format, e.g. `+971501234567`. Until a real number is set the links
point at the placeholder and won't open a real chat.

### Everything else

`config/site.ts` also holds prices & package details, project scenes
(`title`, `sector`, `description`, `tags`, `hue`, `hue2`, `frame`, `prj`), the
reel words, process steps, the bilingual panel, footer meta, and SEO metadata.
Each field is documented inline in that file.

## Project structure

```
app/
  layout.tsx        # metadata, OpenGraph, theme-color, next/font wiring
  page.tsx          # composes the single-page site
  globals.css       # the prototype's CSS, ported verbatim
  fonts.ts          # Archivo (expanded) + Space Mono via next/font
components/          # Nav, Hero, Reel, WorkScene, Work, Plans, Process,
                     # Bilingual, Footer, Reveals
config/site.ts      # ← single source of truth
lib/whatsapp.ts     # builds wa.me links from the config
public/og.png       # 1200×630 OpenGraph image (static asset)
scripts/og.html     # source used to render public/og.png
```

## Fonts, performance & accessibility

- Fonts load through `next/font/google` (Archivo with the `wdth` axis for the
  expanded weights, plus Space Mono) — self-hosted, no layout shift.
- The opening counter and hero sequence use reserved space (absolute counter,
  `overflow:hidden` headline rows) so there is no CLS.
- Animations are CSS-first; the page is statically prerendered.
- `prefers-reduced-motion` is respected end-to-end: the counter is skipped and
  all content is visible instantly.
- Responsive down to 375px with no horizontal scroll; the reel and work scenes
  are contained on mobile.

## Regenerating the OG image

`public/og.png` is a committed static asset. To regenerate it after editing
`scripts/og.html`, render that file to a 1200×630 PNG with any headless browser,
e.g.:

```bash
chromium --headless=new --window-size=1200,630 \
  --screenshot=public/og.png scripts/og.html
```

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
