import { site } from "@/config/site";
import { waLink } from "@/lib/whatsapp";

export default function Hero() {
  const { hero } = site;
  return (
    <header id="top">
      <div className="wrap">
        <h1 className="rv">{hero.headline}</h1>
        <p className="h-sub rv">{hero.sub}</p>
        <div className="h-ctas rv">
          <a className="btn" href={waLink()} target="_blank" rel="noopener noreferrer">
            {hero.ctaPrimary}
          </a>
          <a className="tlink" href="#work">
            {hero.ctaSecondary}
          </a>
        </div>
      </div>
    </header>
  );
}
