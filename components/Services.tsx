import { site } from "@/config/site";
import { waLink } from "@/lib/whatsapp";

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="eyebrow mono">{site.labels.services}</div>
        <div className="services">
          {site.services.map((service) => (
            <div className="service rv" key={service.name}>
              <h3 className="name">{service.name}</h3>
              <p>{service.description}</p>
              <a
                className="link"
                href={waLink(service.subject)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get a quote
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
