import { site } from "@/config/site";
import { workShot } from "@/lib/workShots";
import WorkScene from "./WorkScene";

export default function Work() {
  const head = site.sections.work;
  return (
    <section id="work">
      <div className="wrap">
        <div className="sec-head-row rv">
          <span className="mono">{head.eyebrow}</span>
          <span className="idx">{head.idx}</span>
        </div>
        <h2 className="sec-title rv">{head.title}</h2>
        <div className="work-list">
          {site.scenes.map((scene) => (
            <WorkScene key={scene.slug} scene={scene} shot={workShot(scene.slug)} />
          ))}
        </div>
      </div>
    </section>
  );
}
