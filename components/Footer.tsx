import { site, NAME_PLACEHOLDER } from "@/config/site";
import { waLink } from "@/lib/whatsapp";

export default function Footer() {
  const name = site.studioName || NAME_PLACEHOLDER;
  return (
    <footer id="contact">
      <div className="f-big rv">
        <a href={waLink()} target="_blank" rel="noopener noreferrer">
          {site.footer.big}
        </a>
      </div>
      <div className="f-meta">
        {site.footer.meta.map((line) => (
          <span key={line}>{line}</span>
        ))}
        <span>© 2026 — {name}</span>
      </div>
    </footer>
  );
}
