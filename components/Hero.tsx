import { site } from "@/config/site";
import { waLink } from "@/lib/whatsapp";

export default function Hero() {
  const { hero } = site;
  return (
    <header id="top">
      <div className="wrap">
        <div className="h-eyebrow mono">{hero.eyebrow}</div>
        <h1>
          {hero.headline.map((line, i) => (
            <span className="row" key={i}>
              {line}
            </span>
          ))}
        </h1>
        <p className="h-sub">{hero.sub}</p>
        <div className="h-ctas">
          <a className="btn" href={waLink()} target="_blank" rel="noopener noreferrer">
            {hero.ctaPrimary}
          </a>
          <a className="link" href="#work">
            {hero.ctaSecondary}
          </a>
        </div>
      </div>
    </header>
  );
}
