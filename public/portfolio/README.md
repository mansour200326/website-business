# Portfolio screenshots

Each project on the homepage shows a full-page screenshot inside a browser
frame that parallax-scrolls as you pass it. Drop the real screenshots here.

## Exact files (one per project, named by its `slug` in `config/site.ts`)

| Project          | File                              | Status                    |
| ---------------- | --------------------------------- | ------------------------- |
| Sumou Jet        | `sumou-jet.jpg`                   | ✅ real screenshot        |
| Grailhaus        | `grailhaus.jpg`                   | ✅ real screenshot        |
| Rack On          | `rack-on.png`                     | ⛔ **placeholder — replace** |
| Prairies Fodder  | `prairies-fodder.png`             | ⛔ **placeholder — replace** |

Any of `.jpg`, `.jpeg`, or `.png` is accepted (resolved in that order). If a
file is missing the frame falls back to a clean tinted panel.

## Notes

- **Tall, full-page captures work best** — the image is shown at 128% of the
  frame height and parallax-scrolls through as the visitor passes, so the more
  vertical page you capture, the more there is to reveal.
- Images are served through `next/image` (optimised + lazy-loaded below the
  fold); intrinsic size is read at build time so there is no layout shift.
- To add or rename a project, edit the `portfolio` array in `config/site.ts`
  (the `slug` drives the filename) and drop the matching image here.
