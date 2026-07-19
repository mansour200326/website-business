import { site, monogram, NAME_PLACEHOLDER } from "@/config/site";

export default function Nav() {
  const { studioName } = site;
  return (
    <nav>
      <a className="logo" href="#top" aria-label={studioName || NAME_PLACEHOLDER}>
        <span className="m">{monogram(studioName)}</span>
        {studioName ? (
          <span className="name">{studioName}</span>
        ) : (
          <span className="pend">{NAME_PLACEHOLDER}</span>
        )}
      </a>
      <div className="links">
        <a href="#work">Work</a>
        <a href="#services">Services</a>
        <a href="#process">Process</a>
        <a className="go" href="#contact">
          Start
        </a>
      </div>
    </nav>
  );
}
