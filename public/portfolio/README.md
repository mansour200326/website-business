# Portfolio media

Exactly three projects. Each portfolio moment plays a short **screen recording**
of the real site (its opening animation + a scroll) inside a browser frame. The
clip is lazy-loaded and plays only while the section is on screen; a poster still
shows until it plays and stays as the fallback.

## Files per project (`/public/portfolio/`)

For each `slug` (`sumou-jet`, `grailhaus`, `maison-padel`):

| File                      | What it is                                            |
| ------------------------- | ----------------------------------------------------- |
| `${slug}-poster.webp`     | poster still (also the reduced-motion / fallback image) |
| `${slug}-desktop.webm`    | VP9 desktop clip (~1400px wide)                       |
| `${slug}-desktop.mp4`     | H.264 desktop clip (~1400px wide)                     |
| `${slug}-mobile.webm`     | VP9 mobile clip (~700px wide)                         |
| `${slug}-mobile.mp4`      | H.264 mobile clip (~700px wide)                       |

All clips are **muted with the audio track stripped**. Desktop variants stay
under 2.5 MB, mobile under 1 MB. The frame's aspect-ratio is set from the poster's
intrinsic size, so there is no layout shift.

## Regenerating from a screen recording

Given a source recording `in.mov`, produce every output with `ffmpeg` (two-pass;
pick a target bitrate that keeps the longest clip under budget), strip audio with
`-an`, drop to 30 fps, and add `-movflags +faststart` to the MP4s:

```bash
# desktop MP4 (H.264) — repeat pass 1/2; WebM uses -c:v libvpx-vp9
ffmpeg -i in.mov -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -vf "scale=1400:-2:flags=lanczos,fps=30" -b:v 600k -preset medium \
  -movflags +faststart sumou-jet-desktop.mp4
# mobile: scale=700:-2 and a lower bitrate (~250k)
# poster: a clean frame from the settled site
ffmpeg -ss 8 -i in.mov -frames:v 1 -vf "scale=1400:-2" -c:v libwebp -quality 82 \
  sumou-jet-poster.webp
```

## Notes

- Slugs are driven by each project's `slug` in `config/site.ts`. `lib/portfolio.ts`
  (`portfolioMedia`) resolves the poster + the four video files at build time.
- The video is wired with `preload="none"`, `muted`, `playsinline`, `loop`. An
  `IntersectionObserver` picks the mobile/desktop size and webm/mp4 codec in JS,
  sets the source only as the visitor approaches, and plays/pauses on scroll.
- If the video files are missing but a poster exists, the frame shows the poster
  still; if nothing exists, it falls back to a clean tinted panel.
