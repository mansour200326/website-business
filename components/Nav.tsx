import Logo from "./Logo";

export default function Nav() {
  return (
    <nav>
      <div className="nav-in">
        <a className="logo" href="/#top" aria-label="Websmith — home">
          <Logo variant="inline" tone="ink" />
        </a>
        <div className="links">
          <a href="/#work">Work</a>
          <a href="/#services">Services</a>
          <a href="/#process">Process</a>
          <a className="cta" href="/#contact">
            Get a quote
          </a>
        </div>
      </div>
    </nav>
  );
}
