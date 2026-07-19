# Work screenshots

Drop a project screenshot here and it fills that work card (no browser chrome),
with a slow hover pan. A missing screenshot falls back to the design's gradient
+ wordmark treatment for that card only.

## Expected files

One screenshot per scene, named by its `slug` in `config/site.ts`. Both `.png`
and `.jpeg` are accepted — `.png` is tried first, then `.jpeg`:

| Scene        | Screenshot                              |
| ------------ | --------------------------------------- |
| Grailhaus    | `grailhaus-desktop.png` \| `.jpeg`      |
| Sumou Jet    | `sumoujet-desktop.png` \| `.jpeg`       |
| Maison Padel | `maisonpadel-desktop.png` \| `.jpeg`    |

## Notes

- Screenshots are cropped with `object-fit: cover; object-position: top` inside
  a 16 / 10.5 rounded card. Tall, full-page captures reveal the most on the
  hover pan; wide hero-only captures simply fill the card.
- After adding or changing files, rebuild (`npm run build`) — presence is
  resolved at build time.
- Adding a new scene? Give it a `slug` in `config/site.ts` and drop
  `${slug}-desktop.png` (or `.jpeg`) here.
