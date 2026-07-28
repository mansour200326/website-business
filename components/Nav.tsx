import Logo from "./Logo";
import { waLink } from "@/lib/whatsapp";

export default function Nav() {
  return (
    <nav>
      <div className="nav-in">
        <a className="logo" href="/#top" aria-label="Websmith — home">
          <Logo variant="inline" tone="ink" />
        </a>
        <div className="nav-links">
          <a href="/#work" className="sweep">
            Work
          </a>
          <a href="/#packages" className="sweep">
            Packages
          </a>
          <a href="/#studio" className="sweep">
            Studio
          </a>
          <a className="cta" href={waLink()} target="_blank" rel="noopener noreferrer">
            Start
          </a>
        </div>
      </div>
    </nav>
  );
}
