/**
 * The Atelier Digital logotype — a typographic lockup: "atelier" in Instrument
 * Serif italic over/before "digital" in Manrope medium, both lowercase.
 *
 *  - variant "inline"  → one line, for the nav.
 *  - variant "stacked" → two lines, tight leading, for the footer / OG.
 *  - tone "ink" (default) or "ivory" recolours both words.
 */
export default function Logo({
  variant = "inline",
  tone = "ink",
}: {
  variant?: "inline" | "stacked";
  tone?: "ink" | "ivory";
}) {
  return (
    <span className={`logo-lockup logo-${variant} logo-tone-${tone}`} aria-label="Atelier Digital">
      <span className="lg-atelier">atelier</span>
      <span className="lg-digital">digital</span>
    </span>
  );
}
