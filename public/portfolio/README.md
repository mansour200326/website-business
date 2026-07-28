# Portfolio screenshots

Exactly three projects. Each shows a screenshot inside a browser frame that
scrolls **internally** as the visitor passes — for a tall full-page capture this
reveals the whole page top-to-bottom.

## Exact files — drop full-page captures here (`/public/portfolio/`)

| Project      | Live site        | File (any of `.jpg` / `.jpeg` / `.png`) | Status                          |
| ------------ | ---------------- | --------------------------------------- | ------------------------------- |
| Sumou Jet    | sumoujet.com     | `sumou-jet.jpg`                         | interim (single-viewport) — replace |
| Grailhaus    | grailhaus.com    | `grailhaus.jpg`                         | interim (single-viewport) — replace |
| Maison Padel | maisonpadel.ae   | `maison-padel.png`                      | interim (single-viewport) — replace |

**Please replace each with a full-page screenshot** — the entire scrollable
page, top to bottom (e.g. a browser "capture full page" export, ~1440px wide and
as tall as the page). The frame is already sized for tall images: it crops to a
browser-window shape and the `object-position` reveal walks the image from its
top to its bottom as the project scrolls past. The current interim images are
single-viewport captures of each site, so they fill the frame but there is little
to reveal until the full-page versions are dropped in.

## Notes

- Filenames are driven by each project's `slug` in `config/site.ts` (resolved
  `.jpg → .jpeg → .png`). To change projects, edit the `portfolio` array there.
- Images are served through `next/image` — optimised, lazy-loaded below the
  fold, with intrinsic sizes read at build time so there is no layout shift.
- If a file is missing, the frame falls back to a clean tinted panel.
