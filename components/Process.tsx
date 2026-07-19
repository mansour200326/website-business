import { site } from "@/config/site";

export default function Process() {
  const head = site.sections.process;
  return (
    <section id="process">
      <div className="wrap">
        <div className="sec-head-row rv">
          <span className="mono">{head.eyebrow}</span>
          <span className="idx">{head.idx}</span>
        </div>
        <h2 className="sec-title rv">{head.title}</h2>
        <div className="steps">
          {site.process.map((step) => (
            <div className="step rv" key={step.day}>
              <div className="d mono">{step.day}</div>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
