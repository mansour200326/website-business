# Portfolio screenshots

Exactly three projects. Each shows a screenshot inside a browser frame that
scrolls **internally** as the visitor passes — for a tall full-page capture this
reveals the whole page top-to-bottom.

## Exact files — drop full-page captures here (`/public/portfolio/`)

| Project      | Live site        | File (any of `.webp` / `.jpg` / `.jpeg` / `.png`) | Status                          |
| ------------ | ---------------- | ------------------------------------------------- | ------------------------------- |
| Sumou Jet    | sumoujet.com     | `sumou-jet.webp`                                  | interim (single-viewport) — replace |
| Grailhaus    | grailhaus.com    | `grailhaus.webp`                                  | interim (single-viewport) — replace |
| Maison Padel | maisonpadel.ae   | `maison-padel.webp`                               | interim (single-viewport) — replace |

**Please replace each with a full-page screenshot** — the entire scrollable
page, top to bottom (e.g. a browser "capture full page" export, ~1440px wide and
as tall as the page). The frame is already sized for tall images: it crops to a
browser-window shape and the image is walked from its top to its bottom by a GPU
`transform` (never `object-position`, which repaints) as the project scrolls
past. The current interim images are single-viewport captures of each site, so
they fill the frame but there is little to reveal until the full-page versions
are dropped in.

**Compress before committing.** Save as **WebP** (quality ~78) and cap the width
at ~1600px — the display slot is only 560px wide, so a raw 2700px+ capture is
pure lag on mobile. The interim files here were converted this way (each is
14–45 KB, down from 0.2–3.7 MB). A quick one-liner with the `sharp` npm package:

```bash
npx --yes -p sharp node -e 'require("sharp")("in.png").resize({width:1600,withoutEnlargement:true}).webp({quality:78}).toFile("sumou-jet.webp")'
```

## Notes

- Filenames are driven by each project's `slug` in `config/site.ts` (resolved
  `.webp → .jpg → .jpeg → .png`). To change projects, edit the `portfolio` array.
- Images are served through `next/image` — it emits a responsive `srcset` and a
  mobile-sized variant automatically, lazy-loaded below the fold, with intrinsic
  sizes read at build time so there is no layout shift.
- If a file is missing, the frame falls back to a clean tinted panel.
