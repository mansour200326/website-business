import { site } from "@/config/site";
import { waLink } from "@/lib/whatsapp";

export default function Plans() {
  return (
    <section id="plans">
      <div className="sec-label mono" style={{ padding: 0, marginBottom: 60 }}>
        {site.labels.plans}
      </div>
      <div className="plan-grid">
        {site.plans.map((plan) => (
          <div className={`plan${plan.hot ? " hot" : ""} rv`} key={plan.name}>
            <div className="tier mono">{plan.tier}</div>
            <h3>{plan.name}</h3>
            <div className="price">{plan.price}</div>
            <div className="days">{plan.days}</div>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a
              className={`btn${plan.hot ? " btn-solid" : ""}`}
              href={waLink(plan.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request {plan.name}
            </a>
          </div>
        ))}
      </div>
      <div className="addon-row">
        {site.addons.map((addon) => (
          <div className="addon rv" key={addon.label}>
            <b>{addon.label}</b>
            {addon.text}
          </div>
        ))}
      </div>
      <div className="fine">{site.pricingFine}</div>
    </section>
  );
}
