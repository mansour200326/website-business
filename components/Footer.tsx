import { site } from "@/config/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="f-mark">
          <Logo variant="inline" tone="ivory" />
        </div>
        <div className="f-in">
          <span className="f-legal">{site.footer.legal}</span>
          <div className="f-right">
            <a className="f-link sweep" href="/privacy">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
