/**
 * The Websmith wordmark — "Websmith." set in Instrument Serif, ink (or ivory on
 * the dark footer band), with the final period in cyan. Instrument Serif is
 * used only for the wordmark, project names and the watermark; UI text is Manrope.
 *
 *  - variant "inline"  → nav size.
 *  - variant "display" → larger, for the footer / OG.
 *  - tone "ink" (default) → word in ink; tone "ivory" → word in ivory (dark
 *    footer band). The period is always cyan in both.
 */
export default function Logo({
  variant = "inline",
  tone = "ink",
}: {
  variant?: "inline" | "display";
  tone?: "ink" | "ivory";
}) {
  return (
    <span className={`wordmark wm-${variant} wm-tone-${tone}`} aria-label="Websmith">
      Websmith<span className="wm-dot">.</span>
    </span>
  );
}
