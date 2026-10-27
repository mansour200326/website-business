import { site } from "@/config/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="f-mark">
          <Logo variant="inline" tone="ivory" />
        </div>
        <p className="f-company">{site.company}</p>
        <div className="f-in">
          <span className="f-legal">
            {site.footer.legal}
            <br />
            {site.footer.copyright}
          </span>
          <div className="f-right">
            {/* /wa and /call are the tracked redirects (app/wa, app/call) */}
            <a className="f-link sweep" href="/wa">
              WhatsApp {site.whatsappNumber}
            </a>
            <a className="f-link sweep" href="/call">
              Call {site.whatsappNumber}
            </a>
            <a className="f-link sweep" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a className="f-link sweep" href="/privacy">
              Privacy
            </a>
            <a className="f-link sweep" href="/terms">
              Terms
            </a>
          </div>
        </div>
        <p className="f-terms">
          {site.offer.short}. {site.footer.terms} <a href="/terms#launch-offer">Read the terms</a>.
        </p>
      </div>
    </footer>
  );
}
