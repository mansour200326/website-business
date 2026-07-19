# Work screenshots

Drop project screenshots here to turn each work scene's placeholder frame into
a real "display" (desktop screenshot in browser chrome + a floating phone on the
scene's brand-color glow).

## Expected files

For every scene, named by its `slug` in `config/site.ts`. Both `.png` and
`.jpeg` are accepted — for each image `.png` is tried first, then `.jpeg`:

| Scene        | Desktop                             | Mobile                             |
| ------------ | ----------------------------------- | ---------------------------------- |
| Grailhaus    | `grailhaus-desktop.png` \| `.jpeg`  | `grailhaus-mobile.png` \| `.jpeg`  |
| Sumou Jet    | `sumoujet-desktop.png` \| `.jpeg`   | `sumoujet-mobile.png` \| `.jpeg`   |
| Maison Padel | `maisonpadel-desktop.png` \| `.jpeg`| `maisonpadel-mobile.png` \| `.jpeg`|

## Notes

- **Fallback:** if a scene's `*-desktop.png` is missing, that scene falls back
  to the original gradient frame (per-scene, others are unaffected). If only the
  `*-mobile.png` is missing, the desktop display renders without the phone.
- **Format:** `.png` or `.jpeg` (`.png` wins if both exist for the same image).
  Full-page screenshots work best. They're cropped with
  `object-fit: cover; object-position: top`, and on hover the desktop shot pans
  down to reveal more of the page — so tall captures look great.
  - Desktop: capture at a wide viewport (e.g. 1440px wide).
  - Mobile: capture at a phone viewport (e.g. 390px wide).
- After adding or changing files, rebuild (`npm run build`) — presence is
  resolved at build time.
- Adding a new scene? Give it a `slug` in `config/site.ts` and drop
  `${slug}-desktop.png` / `${slug}-mobile.png` here.
