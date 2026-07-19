import { site, monogram, NAME_PLACEHOLDER } from "@/config/site";

export default function Nav() {
  const { studioName } = site;
  return (
    <nav>
      <div className="nav-in">
        <a className="logo" href="#top" aria-label={studioName || NAME_PLACEHOLDER}>
          {studioName ? (
            studioName
          ) : (
            <>
              {monogram(studioName)}
              <span>· {NAME_PLACEHOLDER}</span>
            </>
          )}
        </a>
        <div className="links">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a className="cta" href="#contact">
            Get a quote
          </a>
        </div>
      </div>
    </nav>
  );
}
