import { site } from "@/config/site";
import { waLink } from "@/lib/whatsapp";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="f-mark">
          <Logo variant="inline" tone="ivory" />
        </div>
        <div className="f-in">
          <span className="f-legal">
            {site.footer.legal}
            <br />
            {site.footer.copyright}
          </span>
          <div className="f-right">
            <a className="f-link sweep" href={waLink()} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a className="f-link sweep" href="tel:+971585461253">
              +971 58 546 1253
            </a>
            <a className="f-link sweep" href="https://websmith.ae" target="_blank" rel="noopener noreferrer">
              websmith.ae
            </a>
            <a className="f-link sweep" href="/privacy">
              Privacy
            </a>
            <a className="f-link sweep" href="/terms">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
