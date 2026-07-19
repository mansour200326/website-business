import { site, NAME_PLACEHOLDER } from "@/config/site";
import { waLink } from "@/lib/whatsapp";

export default function Footer() {
  const name = site.studioName || NAME_PLACEHOLDER;
  const { footer } = site;
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="f-title rv">{footer.title}</div>
        <p className="f-sub rv">{footer.sub}</p>
        <a className="btn-wa rv" href={waLink()} target="_blank" rel="noopener noreferrer">
          {footer.button}
        </a>
        <div className="f-meta">
          {footer.meta.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span>© {name}</span>
        </div>
      </div>
    </footer>
  );
}
