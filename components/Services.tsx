import { site } from "@/config/site";
import { waLink } from "@/lib/whatsapp";

export default function Services() {
  const head = site.sections.services;
  return (
    <section id="services">
      <div className="wrap">
        <div className="sec-head-row rv">
          <span className="mono">{head.eyebrow}</span>
          <span className="idx">{head.idx}</span>
        </div>
        <h2 className="sec-title rv">{head.title}</h2>
        <div className="svc-list">
          {site.services.map((service) => (
            <div className="svc rv" key={service.name}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <a href={waLink(service.subject)} target="_blank" rel="noopener noreferrer">
                Get a quote →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
