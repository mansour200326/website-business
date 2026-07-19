import { site } from "@/config/site";

export default function Process() {
  return (
    <section id="process">
      <div className="wrap">
        <div className="eyebrow mono">{site.labels.process}</div>
        <div className="timeline">
          {site.process.map((step) => (
            <div className="tstep rv" key={step.day}>
              <div className="d">{step.day}</div>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
