import { site, NAME_PLACEHOLDER } from "@/config/site";
import { waLink } from "@/lib/whatsapp";
import Logo from "./Logo";

export default function Footer() {
  const name = site.studioName || NAME_PLACEHOLDER;
  const { footer } = site;
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="f-logo rv">
          <Logo variant="stacked" tone="ivory" />
        </div>
        <div className="f-title rv">{footer.title}</div>
        <p className="f-sub rv">{footer.sub}</p>
        <a className="btn-wa rv" href={waLink()} target="_blank" rel="noopener noreferrer">
          {footer.button}
        </a>
        <div className="f-meta">
          {footer.meta.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <a className="f-link" href="/privacy">
            Privacy
          </a>
          <span>© {name}</span>
        </div>
      </div>
    </footer>
  );
}
