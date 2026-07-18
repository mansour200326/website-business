import { site } from "@/config/site";

/**
 * Decorative marquee. Items are rendered twice back-to-back so the CSS
 * translateX(-50%) loop is seamless. aria-hidden — it carries no information.
 */
export default function Reel() {
  const items = site.reel;
  const doubled = [...items, ...items];
  return (
    <div className="reel" aria-hidden="true">
      <div className="reel-track" id="reelTrack">
        {doubled.map((word, i) => (
          <span key={i}>
            {word}
            <i>/</i>
          </span>
        ))}
      </div>
    </div>
  );
}
